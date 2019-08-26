import React, { useMemo } from 'react'
import { Dispatch, Store } from 'redux'
import { useSelector, useDispatch } from 'react-redux'
import { withRouter, RouteComponentProps } from 'react-router-dom'
import { store, State } from '../modules/index'
import { initSocket } from '../modules/socket.action'
import { logout } from '../modules/user.action'
import {
  receiveRooms,
  receiveMessage,
  receiveModifyMessage,
  receiveMessages,
  enterSuccess,
  alreadyRead
} from '../modules/rooms.action'

type Message = {
  id: string
  userId: string
  userAccount: string
  message: string
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

async function onMessage(
  e: MessageEvent,
  store: Store<State>,
  dispatch: Dispatch,
  history: RouteComponentProps['history']
) {
  try {
    const parsed: ReceiveMessage = JSON.parse(e.data)
    if (parsed.cmd === 'rooms') {
      receiveRooms(parsed.rooms, store.getState().rooms.currentRoomId)(
        dispatch,
        store.getState
      )
    } else if (parsed.cmd === 'message:receive') {
      receiveMessage(parsed.message, parsed.room)(dispatch, store.getState)
    } else if (parsed.cmd === 'message:modify') {
      receiveModifyMessage(parsed.message, parsed.room)(dispatch)
    } else if (parsed.cmd === 'messages:room') {
      receiveMessages({
        messages: parsed.messages,
        room: parsed.room,
        existHistory: parsed.existHistory
      })(dispatch)
    } else if (parsed.cmd === 'rooms:enter:success') {
      if (history.location.pathname !== parsed.name) {
        history.push(`/rooms/${parsed.name}`)
      }
      enterSuccess(parsed.id, parsed.name, store.getState().rooms.rooms)(
        dispatch,
        store.getState
      )
    } else if (parsed.cmd === 'rooms:read') {
      dispatch(alreadyRead(parsed.room))
    }
  } catch (e) {
    console.error(e)
  }
}

function init(
  store: Store<State>,
  dispatch: Dispatch,
  url: string,
  history: RouteComponentProps['history']
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
} & RouteComponentProps

function Socket({ url, history }: Props) {
  const login = useSelector((state: State) => state.user.login)
  const dispatch = useDispatch()

  useMemo(() => {
    if (login) {
      init(store, dispatch, url, history)
    }
  }, [url, login])

  return <></>
}
export default withRouter(Socket)
