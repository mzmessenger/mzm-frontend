import { Dispatch } from 'redux'
import { createIconUrl } from '../lib/util'
import { convertToHtml } from '../lib/messages'
import { Action, ReceiveMessage } from './index.types'

export function initSocket(socket: WebSocket): Action {
  return { type: 'websocket:init', payload: socket }
}

export function sendMessage(message: string): Action {
  return { type: 'message:send', payload: message }
}

export function onMessage(e: MessageEvent) {
  return async function(dispatch: Dispatch<Action>) {
    try {
      const parsed: ReceiveMessage = JSON.parse(e.data)
      if (parsed.cmd === 'rooms') {
        return dispatch({ type: 'rooms:receive', payload: parsed.rooms })
      } else if (parsed.cmd === 'message:receive') {
        const html = await convertToHtml(parsed.message.message)
        return dispatch({
          type: 'message:receive',
          payload: { ...parsed.message, html: html }
        })
      } else if (parsed.cmd === 'messages:room') {
        const promises = parsed.messages.map(m => convertToHtml(m.message))
        const html = await Promise.all(promises)
        const messages = parsed.messages.map((m, i) => {
          return { ...m, html: html[i] }
        })

        return dispatch({
          type: 'messages:room',
          payload: {
            room: parsed.room,
            existHistory: parsed.existHistory,
            messages: messages
          }
        })
      } else if (parsed.cmd === 'rooms:enter:success') {
        return dispatch({
          type: 'rooms:enter:success',
          payload: { id: parsed.id, name: parsed.name }
        })
      }
    } catch (e) {
      console.error(e)
    }
  }
}

export function getMyInfo() {
  return async function(dispatch: Dispatch<Action>) {
    const res = await fetch('/api/user/@me')
    if (res.status === 200) {
      const payload: { account: string; id: string } = await res.json()
      const iconUrl = payload.account ? createIconUrl(payload.account) : null
      dispatch({ type: 'me:set', payload: { ...payload, iconUrl } })
    } else {
      dispatch({ type: 'logout' })
    }
    return res
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

export function enterRooms(roomName: string): Action {
  return { type: 'rooms:enter', payload: { name: roomName } }
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

export function removeUser() {
  return async function(dispatch: Dispatch<Action>) {
    const res = await fetch('/auth/user', {
      method: 'DELETE',
      mode: 'cors',
      headers: {
        'Content-Type': 'application/json; charset=utf-8'
      }
    })
    if (res.status === 200) {
      dispatch({ type: 'remove:user' })
    }
    return res
  }
}

export function onResize(innerWidth: number, innerHeight: number): Action {
  return { type: 'onresize', payload: { innerWidth, innerHeight } }
}

export function openMenu(): Action {
  return { type: 'menu:open' }
}

export function closeMenu(): Action {
  return { type: 'menu:close' }
}
