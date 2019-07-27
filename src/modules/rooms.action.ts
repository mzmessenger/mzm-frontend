import { Dispatch } from 'redux'
import { sendSocket, SendSocketMessage } from '../lib/util'
import { convertToHtml } from '../lib/markdown'
import { RoomsAction, Message, Room } from './rooms.types'
import { closeMenu } from './user.action'

function getMessages(currentRoomId: string, socket: WebSocket) {
  sendSocket(socket, {
    cmd: 'messages:room',
    room: currentRoomId
  })
}

export function createRoom(name: string) {
  return async function(dispatch: Dispatch<RoomsAction>, socket: WebSocket) {
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
      sendSocket(socket, { cmd: 'rooms:get' })
      dispatch({
        type: 'rooms:create',
        payload: { id: room.id, name: room.name }
      })
    }
    return res
  }
}

export function enterRoom(roomName: string, rooms: Room[]) {
  return async function(dispatch: Dispatch, socket: WebSocket) {
    const [room] = rooms.filter(r => r.name === roomName)
    if (room) {
      if (!room.receivedMessages && !room.loading) {
        sendSocket(socket, {
          cmd: 'rooms:enter',
          name: roomName
        })
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
    sendSocket(socket, {
      cmd: 'rooms:enter',
      name: roomName
    })
    dispatch({ type: 'enter:room' })
    dispatch(closeMenu())
  }
}

export function exitRoom(roomId: string) {
  return async function(dispatch: Dispatch<RoomsAction>, socket: WebSocket) {
    const res = await fetch('/api/rooms/enter', {
      method: 'DELETE',
      mode: 'cors',
      headers: {
        'Content-Type': 'application/json; charset=utf-8'
      },
      body: JSON.stringify({ room: roomId })
    })
    if (res.status === 200) {
      sendSocket(socket, { cmd: 'rooms:get' })
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

export function receiveRooms(
  rooms: { id: string; name: string }[],
  currentRoomId: string,
  socket: WebSocket
): RoomsAction {
  if (currentRoomId) {
    getMessages(currentRoomId, socket)
  }
  return {
    type: 'receive:rooms',
    payload: {
      rooms: rooms
    }
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

export function enterSuccess(
  id: string,
  name: string,
  roomMap: Map<string, Room>,
  socket: WebSocket
): RoomsAction {
  const room = roomMap.get(id)
  // すでに入っている部屋だったら部屋の再取得をしない
  if (!room) {
    sendSocket(socket, { cmd: 'rooms:get' })
  }
  let loading = false
  if (room && !room.receivedMessages && !loading) {
    getMessages(id, socket)
    loading = true
  }
  return {
    type: 'rooms:enter:success',
    payload: { id: id, name: name, loading }
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
    if (res.status === 200) {
      console.log(await res.json())
    }
    return res
  }
}
