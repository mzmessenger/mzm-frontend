import { Dispatch } from 'redux'
import { sendSocket, SendSocketMessage, SendSocketCmdEnum } from '../lib/util'
import { State } from './index'
import {
  RoomActionEnum,
  RoomsAction,
  ReceiveRoom,
  RoomsState,
  Room
} from './rooms.types'
import { closeMenu } from './ui'

const splited = location.pathname.split('/')
const initCurrentRoomName = splited[1] === 'rooms' ? splited[2] : ''

export const initState: RoomsState = {
  rooms: { byId: {}, allIds: [] },
  currentRoomId: '',
  currentRoomName: initCurrentRoomName,
  scrollTargetIndex: 'bottom'
}

export function reducer(
  state: RoomsState = initState,
  action: RoomsAction
): RoomsState {
  switch (action.type) {
    case RoomActionEnum.ReceiveRooms: {
      const allIds = []
      for (const r of action.payload.rooms) {
        if (!allIds.includes(r.id)) {
          allIds.push(r.id)

          const room: Room = {
            id: r.id,
            name: r.name,
            unread: r.unread,
            messages: [],
            loading: false,
            receivedMessages: false,
            existHistory: false
          }
          state.rooms.byId[r.id] = room
        }
      }
      state.rooms.allIds = allIds
      return { ...state }
    }
    case RoomActionEnum.CreateRoom: {
      return {
        ...state,
        currentRoomId: action.payload.id,
        currentRoomName: action.payload.name
      }
    }
    case RoomActionEnum.GetMessages: {
      const room = state.rooms.byId[action.payload.id]
      if (room) {
        state.rooms.byId[action.payload.id] = { ...room, loading: true }
      }
      return { ...state }
    }
    case RoomActionEnum.ChangeRoom: {
      return {
        ...state,
        currentRoomId: action.payload.id,
        currentRoomName: state.rooms.byId[action.payload.id].name,
        scrollTargetIndex: 'bottom'
      }
    }
    case RoomActionEnum.EnterRoomSuccess: {
      const room = state.rooms.byId[action.payload.id]
      if (room) {
        state.rooms.byId[action.payload.id] = {
          ...state.rooms.byId[action.payload.id],
          loading: action.payload.loading
        }
      }

      return {
        ...state,
        currentRoomId: action.payload.id,
        currentRoomName: action.payload.name
      }
    }
    case RoomActionEnum.ExitRoom: {
      return {
        ...state,
        currentRoomId: '',
        currentRoomName: ''
      }
    }
    case RoomActionEnum.ReceiveMessage: {
      const isCurrent = action.payload.room === state.currentRoomId
      const room = state.rooms.byId[action.payload.room]

      room.loading = false
      room.messages = [...room.messages, action.payload.message]
      if (!isCurrent) {
        room.unread++
      }

      return {
        ...state,
        scrollTargetIndex: 'bottom'
      }
    }
    case RoomActionEnum.ReceiveMessages: {
      const roomId = action.payload.room
      // uniq
      const arr = [
        ...action.payload.messages,
        ...state.rooms.byId[roomId].messages
      ]
      const messages = [...new Set(arr)]

      const scrollTargetIndex =
        action.payload.room === state.currentRoomId &&
        !state.rooms.byId[roomId].receivedMessages
          ? action.payload.messages.length
          : state.scrollTargetIndex

      const room = {
        ...state.rooms.byId[roomId],
        messages,
        loading: false,
        receivedMessages: true,
        existHistory: action.payload.existHistory
      }
      state.rooms.byId[roomId] = room

      return {
        ...state,
        scrollTargetIndex
      }
    }
    case RoomActionEnum.AlreadyRead: {
      state.rooms.byId[action.payload.room] = {
        ...state.rooms.byId[action.payload.room],
        unread: 0
      }
      return { ...state }
    }
    case RoomActionEnum.ReloadMessages: {
      state.rooms.byId[action.payload.room].messages = [
        ...state.rooms.byId[action.payload.room].messages
      ]
      return { ...state }
    }
    default:
      return state
  }
}

export function getMessages(roomId: string, socket: WebSocket): RoomsAction {
  sendSocket(socket, {
    cmd: SendSocketCmdEnum.GetMessages,
    room: roomId
  })
  return { type: RoomActionEnum.GetMessages, payload: { id: roomId } }
}

export function createRoom(name: string) {
  return async function (
    dispatch: Dispatch<RoomsAction>,
    getState: () => State
  ) {
    const res = await fetch('/api/rooms', {
      method: 'POST',
      mode: 'cors',
      headers: {
        'Content-Type': 'application/json; charset=utf-8'
      },
      body: JSON.stringify({ name })
    })
    if (res.status === 200) {
      const room: { id: string; name: string } = await res.json()
      sendSocket(getState().socket.socket, { cmd: SendSocketCmdEnum.GetRooms })
      dispatch({
        type: RoomActionEnum.CreateRoom,
        payload: { id: room.id, name: room.name }
      })
    }
    return res
  }
}

export function enterRoom(roomName: string) {
  return async function (dispatch: Dispatch, getState: () => State) {
    const room = Object.values(getState().rooms.rooms.byId).find(
      (r) => r.name === roomName
    )
    if (room) {
      if (!room.receivedMessages && !room.loading) {
        dispatch(getMessages(room.id, getState().socket.socket))
      }
      dispatch({
        type: RoomActionEnum.ChangeRoom,
        payload: {
          id: room.id
        }
      })
      dispatch(closeMenu())
      return
    }
    sendSocket(getState().socket.socket, {
      cmd: SendSocketCmdEnum.EnterRoom,
      name: roomName
    })
    dispatch(closeMenu())
  }
}

export function exitRoom(roomId: string) {
  return async function (
    dispatch: Dispatch<RoomsAction>,
    getState: () => State
  ) {
    const res = await fetch('/api/rooms/enter', {
      method: 'DELETE',
      mode: 'cors',
      headers: {
        'Content-Type': 'application/json; charset=utf-8'
      },
      body: JSON.stringify({ room: roomId })
    })
    if (res.status === 200) {
      sendSocket(getState().socket.socket, { cmd: SendSocketCmdEnum.GetRooms })
      dispatch({ type: RoomActionEnum.ExitRoom })
    }
    return res
  }
}

export function getHistory(id: string, roomId: string, socket: WebSocket) {
  const message: SendSocketMessage = {
    cmd: SendSocketCmdEnum.GetMessages,
    room: roomId,
    id: id
  }
  sendSocket(socket, message)
}

export function receiveRooms(rooms: ReceiveRoom[], currentRoomId: string) {
  return async function (
    dispatch: Dispatch<RoomsAction>,
    getState: () => State
  ) {
    if (currentRoomId) {
      dispatch(getMessages(currentRoomId, getState().socket.socket))
    }
    dispatch({
      type: RoomActionEnum.ReceiveRooms,
      payload: {
        rooms: rooms
      }
    })
  }
}

export function receiveMessage(messageId: string, room: string) {
  return async function (
    dispatch: Dispatch<RoomsAction>,
    getState: () => State
  ) {
    // 現在みている部屋だったら既読フラグを返す
    if (room === getState().rooms.currentRoomId) {
      readMessages(room)(dispatch, getState)
    }
    return dispatch({
      type: RoomActionEnum.ReceiveMessage,
      payload: {
        message: messageId,
        room: room
      }
    })
  }
}

export function receiveMessages({
  messageIds,
  room,
  existHistory
}: {
  messageIds: string[]
  room: string
  existHistory: boolean
}) {
  return async function (dispatch: Dispatch<RoomsAction>) {
    return dispatch({
      type: RoomActionEnum.ReceiveMessages,
      payload: {
        room: room,
        existHistory: existHistory,
        messages: messageIds
      }
    })
  }
}

export function enterSuccess(id: string, name: string) {
  return async function (
    dispatch: Dispatch<RoomsAction>,
    getState: () => State
  ) {
    const room = getState().rooms.rooms.byId[id]
    // すでに入っている部屋だったら部屋の再取得をしない
    if (!room) {
      sendSocket(getState().socket.socket, { cmd: SendSocketCmdEnum.GetRooms })
    }
    let loading = false
    if (room && !room.receivedMessages && !loading) {
      dispatch(getMessages(id, getState().socket.socket))
      loading = true
    }
    dispatch({
      type: RoomActionEnum.EnterRoomSuccess,
      payload: { id: id, name: name, loading }
    })
  }
}

export function getUsers(roomId: string) {
  return async function (_dispatch: Dispatch<RoomsAction>) {
    if (!roomId) {
      return
    }
    const res = await fetch(`/api/rooms/${roomId}/users`, {
      method: 'GET',
      mode: 'cors',
      headers: {
        'Content-Type': 'application/json; charset=utf-8'
      }
    })
    return res
  }
}

export function readMessages(roomId: string) {
  return async function (
    _dispatch: Dispatch<RoomsAction>,
    getState: () => State
  ) {
    sendSocket(getState().socket.socket, {
      cmd: SendSocketCmdEnum.SendAlreadyRead,
      room: roomId
    })
  }
}

export function alreadyRead(roomId: string): RoomsAction {
  return { type: RoomActionEnum.AlreadyRead, payload: { room: roomId } }
}

export function reloadMessage(roomId: string): RoomsAction {
  return {
    type: RoomActionEnum.ReloadMessages,
    payload: { room: roomId }
  }
}
