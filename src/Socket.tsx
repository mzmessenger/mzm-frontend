import React, { useMemo } from 'react'
import { connect } from 'react-redux'
import * as actions from './modules/index'

function init(
  url: string,
  logout: typeof actions.logout,
  initSocket: typeof actions.initSocket,
  onMessage: typeof actions.onMessage
) {
  const ws = new WebSocket(url)
  initSocket(ws)

  ws.addEventListener('message', e => {
    if (e.data === 'ping') {
      ws.send('pong')
      return
    }
    onMessage(e)
  })
  ws.addEventListener('close', () => {
    init(url, logout, initSocket, onMessage)
  })
  ws.addEventListener('error', () => {
    logout()
  })
  return ws
}

type Props = {
  url: string
  logout: typeof actions.logout
  initSocket: typeof actions.initSocket
  onMessage: typeof actions.onMessage
}

const Socket: React.FC<Props> = ({ url, logout, initSocket, onMessage }) => {
  useMemo(() => {
    init(url, logout, initSocket, onMessage)
  }, [url])
  return <></>
}

export default connect(
  () => ({}),
  {
    logout: actions.logout,
    initSocket: actions.initSocket,
    onMessage: actions.onMessage
  }
)(Socket)
