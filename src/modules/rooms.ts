import { createIconUrl } from '../lib/util'
import { RoomsState, RoomsAction, Message, Room } from './rooms.types'

const splited = location.pathname.split('/')
const initCurrentRoomName = splited[1] === 'rooms' ? splited[2] : ''

export const initState: RoomsState = {
  rooms: [],
  flatRooms: {},
  currentRoomId: '',
  currentRoomName: initCurrentRoomName,
  currentRoomMessages: [],
  currentRoomExistHistory: false,
  scrollTargetIndex: 'bottom'
}

function replaceRoom(
  index: number,
  room: Room,
  flatRooms: RoomsState['flatRooms'],
  rooms: Room[]
): { rooms: Room[]; flatRooms: RoomsState['flatRooms'] } {
  const newRoom = { ...room }
  flatRooms[room.id] = {
    room: newRoom,
    index: index
  }
  rooms[index] = newRoom
  rooms = [...rooms]

  return { rooms: rooms, flatRooms }
}

export function reducer(
  state: RoomsState = initState,
  action: RoomsAction
): RoomsState {
  switch (action.type) {
    case 'receive:rooms': {
      const flatRooms = {}

      const rooms = []
      action.payload.rooms.forEach((r, i) => {
        const room: Room = {
          id: r.id,
          name: r.name,
          unread: r.unread,
          messages: [],
          loading: false,
          receivedMessages: false,
          existHistory: false
        }
        flatRooms[room.id] = { room, index: i }
        rooms.push(room)
      })

      return {
        ...state,
        rooms,
        flatRooms
      }
    }
    case 'rooms:create': {
      const room = state.flatRooms[action.payload.id]
        ? state.flatRooms[action.payload.id].room
        : null

      return {
        ...state,
        currentRoomId: action.payload.id,
        currentRoomName: action.payload.name,
        currentRoomMessages: room ? [...room.messages] : [],
        currentRoomExistHistory: room ? room.existHistory : false
      }
    }
    case 'get:messages': {
      const room = state.flatRooms[action.payload.id]
      if (room) {
        room.room.loading = true
        const replaced = replaceRoom(
          room.index,
          room.room,
          state.flatRooms,
          state.rooms
        )
        state.rooms = replaced.rooms
        state.flatRooms = replaced.flatRooms
      }
      return { ...state }
    }
    case 'change:room': {
      const room = state.flatRooms[action.payload.id]
      return {
        ...state,
        currentRoomId: action.payload.id,
        currentRoomName: room.room.name,
        currentRoomMessages: room.room.messages,
        currentRoomExistHistory: room.room.existHistory,
        scrollTargetIndex: 'bottom'
      }
    }
    case 'rooms:enter:success': {
      const room = state.flatRooms[action.payload.id]
      if (room) {
        room.room.loading = action.payload.loading
        const replaced = replaceRoom(
          room.index,
          room.room,
          state.flatRooms,
          state.rooms
        )
        state.rooms = replaced.rooms
        state.flatRooms = replaced.flatRooms
      }

      return {
        ...state,
        currentRoomId: action.payload.id,
        currentRoomName: action.payload.name,
        currentRoomMessages: room ? [...room.room.messages] : [],
        currentRoomExistHistory: room ? room.room.existHistory : false
      }
    }
    case 'rooms:exit': {
      return {
        ...state,
        currentRoomId: '',
        currentRoomName: '',
        currentRoomMessages: [],
        currentRoomExistHistory: false
      }
    }
    case 'message:receive': {
      const isCurrent = action.payload.room === state.currentRoomId
      const message = action.payload.message
      if (message.userAccount) {
        message.iconUrl = createIconUrl(message.userAccount)
      }
      const room = state.flatRooms[action.payload.room]
      room.room.loading = false

      const index = room.room.messages.map(r => r.id).indexOf(message.id)

      if (index > -1) {
        room.room.messages[index] = message
      } else {
        room.room.messages = [...room.room.messages, message]
        if (!isCurrent) {
          room.room.unread++
        }
      }

      const replaced = replaceRoom(
        room.index,
        room.room,
        state.flatRooms,
        state.rooms
      )

      const currentRoomMessages = isCurrent
        ? room.room.messages
        : state.currentRoomMessages
      return {
        ...state,
        rooms: replaced.rooms,
        flatRooms: replaced.flatRooms,
        currentRoomMessages,
        scrollTargetIndex: 'bottom'
      }
    }
    case 'message:modify:success': {
      const room = { ...state.flatRooms[action.payload.room].room }
      const index = room.messages
        .map(r => r.id)
        .indexOf(action.payload.message.id)
      if (index > -1) {
        const message = action.payload.message
        if (message.userAccount) {
          message.iconUrl = createIconUrl(message.userAccount)
        }
        room.messages[index] = message
        room.messages = [...room.messages]
      }
      state.flatRooms[action.payload.room].room = room
      const currentRoomMessages =
        action.payload.room === state.currentRoomId
          ? room.messages
          : state.currentRoomMessages
      return { ...state, currentRoomMessages }
    }
    case 'messages:room': {
      const received: Message[] = action.payload.messages.map(message => {
        const iconUrl = message.userAccount
          ? createIconUrl(message.userAccount)
          : null
        return { ...message, iconUrl }
      })
      const room = state.flatRooms[action.payload.room]
      room.room.loading = false
      room.room.existHistory = action.payload.existHistory
      room.room.receivedMessages = true

      // uniq
      const join = [...received, ...room.room.messages]
      const messages = [...new Set(join.map(m => m.id))].map(id =>
        join.find(m => m.id === id)
      )
      room.room.messages = messages

      const replaced = replaceRoom(
        room.index,
        room.room,
        state.flatRooms,
        state.rooms
      )
      state.rooms = replaced.rooms

      const isCurrent = action.payload.room === state.currentRoomId
      const currentRoomMessages = isCurrent
        ? room.room.messages
        : state.currentRoomMessages
      const currentRoomExistHistory = isCurrent
        ? room.room.existHistory
        : state.currentRoomExistHistory
      const scrollTargetIndex = isCurrent
        ? received.length
        : state.scrollTargetIndex
      return {
        ...state,
        currentRoomMessages,
        currentRoomExistHistory,
        scrollTargetIndex
      }
    }
    case 'already:read': {
      const room = state.flatRooms[action.payload.room]
      room.room.unread = 0
      const replaced = replaceRoom(
        room.index,
        room.room,
        state.flatRooms,
        state.rooms
      )
      return { ...state, rooms: replaced.rooms, flatRooms: replaced.flatRooms }
    }
    default:
      return state
  }
}
