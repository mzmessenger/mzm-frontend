import React, { useMemo } from 'react'
import { Dispatch } from 'redux'
import { useSelector, useDispatch } from 'react-redux'
import {
  logout as actionLogout,
  initSocket as actionInitSocket,
  onMessage as actionOnMessage
} from '../modules/index.action'
import { State } from '../modules/index.types'

function init(
  dispatch: Dispatch,
  url: string,
  logout: typeof actionLogout,
  initSocket: typeof actionInitSocket,
  onMessage: typeof actionOnMessage
) {
  const ws = new WebSocket(url)

  ws.addEventListener('open', () => {
    dispatch(initSocket(ws))
  })
  ws.addEventListener('message', e => {
    if (e.data === 'ping') {
      ws.send('pong')
      return
    }
    onMessage(e)(dispatch)
  })
  ws.addEventListener('close', () => {
    init(dispatch, url, logout, initSocket, onMessage)
  })
  ws.addEventListener('error', () => {
    dispatch(logout())
  })
  return ws
}

export default function Socket({ url }: { url: string }) {
  const login = useSelector((state: State) => state.login)
  const dispatch = useDispatch()

  useMemo(() => {
    if (login) {
      init(dispatch, url, actionLogout, actionInitSocket, actionOnMessage)
    }
  }, [url, login])

  return <></>
}
