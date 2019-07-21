import { createIconUrl } from '../lib/util'
import { RoomsState, RoomsAction, Message, Room } from './rooms.types'

const splited = location.pathname.split('/')
const initCurrentRoomName = splited[1] === 'rooms' ? splited[2] : ''

export const initState: RoomsState = {
  rooms: [],
  roomMap: new Map<string, Room>(),
  currentRoomId: '',
  currentRoomName: initCurrentRoomName,
  currentRoomMessages: [],
  currentRoomExistHistory: false,
  scrollTargetIndex: 'bottom'
}

export function reducer(
  state: RoomsState = initState,
  action: RoomsAction
): RoomsState {
  switch (action.type) {
    case 'receive:rooms': {
      state.roomMap.clear()

      const rooms = []
      action.payload.rooms.forEach(r => {
        const room: Room = {
          id: r.id,
          name: r.name,
          messages: [],
          loading: false,
          receivedMessages: false,
          existHistory: false
        }
        state.roomMap.set(room.id, room)
        rooms.push(room)
      })

      return {
        ...state,
        rooms: rooms,
        roomMap: new Map(state.roomMap)
      }
    }
    case 'rooms:create': {
      const room = state.roomMap.get(action.payload.id)

      return {
        ...state,
        currentRoomId: action.payload.id,
        currentRoomName: action.payload.name,
        currentRoomMessages: room ? [...room.messages] : [],
        currentRoomExistHistory: room ? room.existHistory : false
      }
    }
    case 'change:room': {
      const room = state.roomMap.get(action.payload.id)
      return {
        ...state,
        currentRoomId: action.payload.id,
        currentRoomName: room.name,
        currentRoomMessages: room.messages,
        currentRoomExistHistory: room.existHistory
      }
    }
    case 'rooms:enter:success': {
      const room = state.roomMap.get(action.payload.id)
      if (room) {
        room.loading = action.payload.loading
      }

      return {
        ...state,
        currentRoomId: action.payload.id,
        currentRoomName: action.payload.name,
        currentRoomMessages: room ? [...room.messages] : [],
        currentRoomExistHistory: room ? room.existHistory : false
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
      const message = action.payload.message
      if (message.userAccount) {
        message.iconUrl = createIconUrl(message.userAccount)
      }
      const room = { ...state.roomMap.get(action.payload.room) }
      room.receivedMessages = true
      room.messages = [...room.messages, message]
      state.roomMap.set(action.payload.room, room)
      const isCurrent = action.payload.room === state.currentRoomId
      const currentRoomMessages = isCurrent
        ? room.messages
        : state.currentRoomMessages
      return {
        ...state,
        currentRoomMessages,
        scrollTargetIndex: 'bottom'
      }
    }
    case 'messages:room': {
      const received: Message[] = action.payload.messages.map(message => {
        const iconUrl = message.userAccount
          ? createIconUrl(message.userAccount)
          : null
        return { ...message, iconUrl }
      })
      const room = {
        ...state.roomMap.get(action.payload.room),
        loading: false,
        existHistory: action.payload.existHistory
      }
      room.receivedMessages = true
      room.messages = [...received, ...room.messages]
      state.roomMap.set(action.payload.room, room)

      const isCurrent = action.payload.room === state.currentRoomId
      const currentRoomMessages = isCurrent
        ? room.messages
        : state.currentRoomMessages
      const currentRoomExistHistory = isCurrent
        ? room.existHistory
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
    default:
      return state
  }
}
