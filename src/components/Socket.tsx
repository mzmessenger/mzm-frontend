import React, { useMemo } from 'react'
import { Dispatch, Store } from 'redux'
import { useSelector, useDispatch } from 'react-redux'
import { useHistory } from 'react-router-dom'
import { store, State } from '../modules/index'
import { initSocket } from '../modules/socket'
import { logout } from '../modules/user'
import {
  receiveRooms,
  receiveMessage,
  receiveMessages,
  enterSuccess,
  alreadyRead,
  reloadMessage
} from '../modules/rooms'
import {
  addMessages,
  addMessage,
  modifyMessage,
  updateIine
} from '../modules/messages'

type Message = {
  id: string
  userId: string
  userAccount: string
  message: string
  iine: number
  createdAt: string
  updated: boolean
  updatedAt: string
}

type ReceiveMessage =
  | {
      cmd: 'message:receive'
      message: Message
      room: string
    }
  | {
      cmd: 'rooms'
      rooms: { id: string; name: string; unread: number }[]
    }
  | {
      cmd: 'messages:room'
      messages: Message[]
      room: string
      existHistory: boolean
    }
  | {
      cmd: 'rooms:enter:success'
      id: string
      name: string
    }
  | {
      cmd: 'message:modify'
      message: Message
      room: string
    }
  | {
      cmd: 'rooms:read'
      user: string
      room: string
    }
  | {
      cmd: 'message:iine'
      room: string
      id: string
      iine: number
    }

async function onMessage(
  e: MessageEvent,
  store: Store<State>,
  dispatch: Dispatch,
  history: ReturnType<typeof useHistory>
) {
  try {
    const parsed: ReceiveMessage = JSON.parse(e.data)
    if (parsed.cmd === 'rooms') {
      receiveRooms(parsed.rooms, store.getState().rooms.currentRoomId)(
        dispatch,
        store.getState
      )
    } else if (parsed.cmd === 'message:receive') {
      addMessage(parsed.message)(dispatch).then(() => {
        receiveMessage(parsed.message.id, parsed.room)(dispatch, store.getState)
      })
    } else if (parsed.cmd === 'message:modify') {
      modifyMessage(parsed.message)(dispatch).then(() => {
        dispatch(reloadMessage(parsed.room))
      })
    } else if (parsed.cmd === 'messages:room') {
      // wait converting html
      addMessages(parsed.messages)(dispatch).then(() => {
        receiveMessages({
          messageIds: parsed.messages.map(m => m.id),
          room: parsed.room,
          existHistory: parsed.existHistory
        })(dispatch)
      })
    } else if (parsed.cmd === 'rooms:enter:success') {
      if (history.location.pathname !== parsed.name) {
        history.push(`/rooms/${parsed.name}`)
      }
      enterSuccess(parsed.id, parsed.name)(dispatch, store.getState)
    } else if (parsed.cmd === 'rooms:read') {
      dispatch(alreadyRead(parsed.room))
    } else if (parsed.cmd === 'message:iine') {
      dispatch(updateIine(parsed.id, parsed.iine))
      dispatch(reloadMessage(parsed.room))
    }
  } catch (e) {
    console.error(e)
  }
}

function init(
  store: Store<State>,
  dispatch: Dispatch,
  url: string,
  history: ReturnType<typeof useHistory>
) {
  const ws = new WebSocket(url)

  ws.addEventListener('open', () => {
    dispatch(initSocket(ws, store.getState().rooms.currentRoomName))
  })
  ws.addEventListener('message', e => {
    if (e.data === 'ping') {
      ws.send('pong')
      return
    }
    onMessage(e, store, dispatch, history)
  })
  ws.addEventListener('close', () => {
    init(store, dispatch, url, history)
  })
  ws.addEventListener('error', () => {
    ws.close()
    dispatch(logout())
  })
  return ws
}

type Props = {
  url: string
}

export default function Socket({ url }: Props) {
  const history = useHistory()
  const login = useSelector((state: State) => state.user.login)
  const dispatch = useDispatch()

  useMemo(() => {
    if (login) {
      init(store, dispatch, url, history)
    }
  }, [url, login])

  return <></>
}
