import { Dispatch } from 'redux'
import { Action, ReceiveMessage } from './index.types'
import identicon from '../lib/identicon'

export function initSocket(socket: WebSocket): Action {
  return { type: 'websocket:init', payload: socket }
}

export function sendMessage(message: string): Action {
  return { type: 'message:send', payload: message }
}

export function onMessage(e: MessageEvent): Action {
  try {
    const parsed: ReceiveMessage = JSON.parse(e.data)
    if (parsed.cmd === 'rooms') {
      return { type: 'rooms:receive', payload: parsed.rooms }
    } else if (parsed.cmd === 'message:receive') {
      return { type: 'message:receive', payload: parsed.message }
    } else if (parsed.cmd === 'messages:room') {
      return {
        type: 'messages:room',
        payload: {
          room: parsed.room,
          existHistory: parsed.existHistory,
          messages: parsed.messages
        }
      }
    } else if (parsed.cmd === 'rooms:enter:success') {
      return {
        type: 'rooms:set:current',
        payload: {
          id: parsed.id,
          name: parsed.name
        }
      }
    }
  } catch (e) {
    console.error(e)
  }
}

export function setCurrentRooms(roomId: string): Action {
  return { type: 'rooms:set:current', payload: { id: roomId } }
}

export function getMyInfo() {
  return async function(dispatch: Dispatch<Action>) {
    const res = await fetch('/api/user/@me')
    if (res.status === 200) {
      const payload: { account: string; id: string } = await res.json()
      dispatch({ type: 'me:set', payload })

      identicon(payload.account, 100, (err, data) => {
        if (!err) {
          dispatch({ type: 'me:set:icon', payload: data })
        }
      })
    } else {
      dispatch({ type: 'logout' })
    }
  }
}

export function createRoom(name: string) {
  return async function(dispatch: Dispatch<Action>) {
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
      dispatch({
        type: 'rooms:create',
        payload: { id: room.id, name: room.name }
      })
    }
    return res
  }
}

export function exitRoom(roomId: string) {
  return async function(dispatch: Dispatch<Action>) {
    const res = await fetch('/api/rooms/enter', {
      method: 'DELETE',
      mode: 'cors',
      headers: {
        'Content-Type': 'application/json; charset=utf-8'
      },
      body: JSON.stringify({ room: roomId })
    })
    if (res.status === 200) {
      dispatch({ type: 'rooms:exit' })
    }
    return res
  }
}

export function getHistory(id: string) {
  return { type: 'messages:get:room:history', payload: id }
}

export function logout() {
  return { type: 'logout' }
}
