import React, { useMemo } from 'react'
import { connect } from 'react-redux'
import * as actions from './modules/index'

function init(
  url: string,
  initSocket: typeof actions.initSocket,
  onMessage: typeof actions.onMessage
) {
  const ws = new WebSocket(url)
  initSocket(ws)

  ws.addEventListener('message', e => {
    onMessage(e)
  })
  ws.addEventListener('close', () => {
    init(url, initSocket, onMessage)
  })
  ws.addEventListener('error', () => {
    location.href = '/auth/twitter'
  })
  return ws
}

function Socket({
  url,
  initSocket,
  onMessage
}: {
  url: string
  initSocket: typeof actions.initSocket
  onMessage: typeof actions.onMessage
}) {
  useMemo(() => {
    init(url, initSocket, onMessage)
  }, [url])
  return <></>
}

export default connect(
  () => ({}),
  {
    initSocket: actions.initSocket,
    onMessage: actions.onMessage
  }
)(Socket)
