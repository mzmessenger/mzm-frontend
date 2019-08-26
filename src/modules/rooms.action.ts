import { Dispatch } from 'redux'
import { sendSocket, SendSocketMessage, SendSocketCmdEnum } from '../lib/util'
import { convertToHtml } from '../lib/markdown'
import { State } from './index'
import {
  RoomActionEnum,
  RoomsAction,
  Message,
  Room,
  ReceiveRoom
} from './rooms.types'
import { closeMenu } from './ui.action'

export function getMessages(roomId: string, socket: WebSocket): RoomsAction {
  sendSocket(socket, {
    cmd: SendSocketCmdEnum.GetMessages,
    room: roomId
  })
  return { type: RoomActionEnum.GetMessages, payload: { id: roomId } }
}

export function createRoom(name: string) {
  return async function(
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

export function enterRoom(roomName: string, rooms: Room[]) {
  return async function(dispatch: Dispatch, getState: () => State) {
    const [room] = rooms.filter(r => r.name === roomName)
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
  return async function(
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
  return async function(
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

export function receiveMessage(message: Message, room: string) {
  return async function(
    dispatch: Dispatch<RoomsAction>,
    getState: () => State
  ) {
    // 現在みている部屋だったら既読フラグを返す
    if (room === getState().rooms.currentRoomId) {
      readMessages(room)(dispatch, getState)
    }
    const html = await convertToHtml(message.message)
    return dispatch({
      type: RoomActionEnum.ReceiveMessage,
      payload: {
        message: { ...message, html: html },
        room: room
      }
    })
  }
}

export function receiveModifyMessage(message: Message, room: string) {
  return async function(dispatch: Dispatch<RoomsAction>) {
    const html = await convertToHtml(message.message)
    return dispatch({
      type: RoomActionEnum.ModifyMessageSuccess,
      payload: {
        message: { ...message, html: html },
        room: room
      }
    })
  }
}

export function receiveMessages({
  messages,
  room,
  existHistory
}: {
  messages: Message[]
  room: string
  existHistory: boolean
}) {
  return async function(dispatch: Dispatch<RoomsAction>) {
    const promises = messages.map(m => convertToHtml(m.message))
    const html = await Promise.all(promises)
    const converted = messages.map((m, i) => {
      return { ...m, html: html[i] }
    })

    return dispatch({
      type: RoomActionEnum.ReceiveMessages,
      payload: {
        room: room,
        existHistory: existHistory,
        messages: converted
      }
    })
  }
}

export function enterSuccess(id: string, name: string, rooms: Room[]) {
  return async function(
    dispatch: Dispatch<RoomsAction>,
    getState: () => State
  ) {
    const [room] = rooms.filter(r => r.id === id)
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
  return async function(_dispatch: Dispatch<RoomsAction>) {
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
  return async function(
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
