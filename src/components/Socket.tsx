import React, { useMemo } from 'react'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import { logout, initSocket, onMessage } from '../modules/index.action'

// @todo loginしていない間は再接続処理をしない

function init(
  url: string,
  logout: Props['logout'],
  initSocket: Props['initSocket'],
  onMessage: Props['onMessage']
) {
  const ws = new WebSocket(url)

  ws.addEventListener('open', () => {
    initSocket(ws)
  })
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
} & ReturnType<typeof mapDispatchToProps>

const Socket: React.FC<Props> = ({ url, logout, initSocket, onMessage }) => {
  useMemo(() => {
    init(url, logout, initSocket, onMessage)
  }, [url])
  return <></>
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators(
    {
      logout,
      initSocket,
      onMessage
    },
    dispatch
  )
}

export default connect(
  () => ({}),
  mapDispatchToProps
)(Socket)
