import { Dispatch } from 'redux'
import { sendSocket, SendSocketMessage } from '../lib/util'
import { convertToHtml } from '../lib/markdown'
import { State } from './index'
import { RoomsAction, Message, Room, ReceiveRoom } from './rooms.types'
import { closeMenu } from './ui.action'

export function getMessages(roomId: string, socket: WebSocket): RoomsAction {
  sendSocket(socket, {
    cmd: 'messages:room',
    room: roomId
  })
  return { type: 'get:messages', payload: { id: roomId } }
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
      sendSocket(getState().socket.socket, { cmd: 'rooms:get' })
      dispatch({
        type: 'rooms:create',
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
        type: 'change:room',
        payload: {
          id: room.id
        }
      })
      dispatch(closeMenu())
      return
    }
    sendSocket(getState().socket.socket, {
      cmd: 'rooms:enter',
      name: roomName
    })
    dispatch({ type: 'enter:room' })
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
      sendSocket(getState().socket.socket, { cmd: 'rooms:get' })
      dispatch({ type: 'rooms:exit' })
    }
    return res
  }
}

export function getHistory(id: string, roomId: string, socket: WebSocket) {
  const message: SendSocketMessage = {
    cmd: 'messages:room',
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
      type: 'receive:rooms',
      payload: {
        rooms: rooms
      }
    })
  }
}

export function receiveMessage(message: Message, room: string) {
  return async function(dispatch: Dispatch<RoomsAction>) {
    const html = await convertToHtml(message.message)
    return dispatch({
      type: 'message:receive',
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
      type: 'message:modify:success',
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
      type: 'messages:room',
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
      sendSocket(getState().socket.socket, { cmd: 'rooms:get' })
    }
    let loading = false
    if (room && !room.receivedMessages && !loading) {
      dispatch(getMessages(id, getState().socket.socket))
      loading = true
    }
    dispatch({
      type: 'rooms:enter:success',
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

export function readMessages(roomId: string, socket: WebSocket) {
  sendSocket(socket, {
    cmd: 'rooms:read',
    room: roomId
  })
}

export function alreadyRead(roomId: string): RoomsAction {
  return { type: 'already:read', payload: { room: roomId } }
}
