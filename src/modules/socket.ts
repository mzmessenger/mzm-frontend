import { Dispatch } from 'redux'
import { useHistory } from 'react-router-dom'
import { State } from './index'
import { sendSocket, SendSocketMessage, SendSocketCmd } from '../lib/util'
import {
  SocketState,
  SocketAction,
  SocketActions,
  ReceiveMessage
} from './socket.types'
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
import { logout } from '../modules/user'

export const initState: SocketState = {
  socket: null
}

export const reducer = (
  state: SocketState = initState,
  action: SocketAction
): SocketState => {
  switch (action.type) {
    case SocketActions.Init: {
      if (state.socket) {
        state.socket.close()
      }
      const socket = action.payload
      return {
        ...state,
        socket: socket
      }
    }
    default:
      return state
  }
}

const onMessage = async (
  e: MessageEvent,
  dispatch: Dispatch,
  getState: () => State,
  history: ReturnType<typeof useHistory>
) => {
  try {
    const parsed: ReceiveMessage = JSON.parse(e.data)
    if (parsed.cmd === 'rooms') {
      receiveRooms(parsed.rooms, getState().rooms.currentRoomId)(
        dispatch,
        getState
      )
    } else if (parsed.cmd === 'message:receive') {
      addMessage(parsed.message)(dispatch).then(() => {
        receiveMessage(parsed.message.id, parsed.room)(dispatch, getState)
      })
    } else if (parsed.cmd === 'message:modify') {
      modifyMessage(parsed.message)(dispatch).then(() => {
        dispatch(reloadMessage(parsed.room))
      })
    } else if (parsed.cmd === 'messages:room') {
      // wait converting html
      addMessages(parsed.messages)(dispatch).then(() => {
        receiveMessages({
          messageIds: parsed.messages.map((m) => m.id),
          room: parsed.room,
          existHistory: parsed.existHistory
        })(dispatch)
      })
    } else if (parsed.cmd === 'rooms:enter:success') {
      if (history.location.pathname !== parsed.name) {
        history.push(`/rooms/${parsed.name}`)
      }
      enterSuccess(parsed.id, parsed.name)(dispatch, getState)
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

export const initSocket = (
  url: string,
  history: ReturnType<typeof useHistory>
) => {
  return (dispatch: Dispatch, getState: () => State) => {
    const ws = new WebSocket(url)

    ws.addEventListener('open', () => {
      const state = getState()
      if (state.rooms.currentRoomName) {
        sendSocket(ws, {
          cmd: SendSocketCmd.EnterRoom,
          name: state.rooms.currentRoomName
        })
      } else {
        sendSocket(ws, { cmd: SendSocketCmd.GetRooms })
      }
      dispatch({ type: SocketActions.Init, payload: ws })
    })

    ws.addEventListener('message', (e) => {
      if (e.data === 'ping') {
        ws.send('pong')
        return
      }
      onMessage(e, dispatch, getState, history)
    })

    ws.addEventListener('close', () => {
      initSocket(url, history)
    })

    ws.addEventListener('error', () => {
      ws.close()
      dispatch(logout())
    })
  }
}

export const sendMessage = (
  message: string,
  roomId: string,
  socket: WebSocket
) => {
  const send: SendSocketMessage = {
    cmd: SendSocketCmd.SendMessage,
    message: message,
    room: roomId
  }
  sendSocket(socket, send)
}

export const sendModifyMessage = (
  message: string,
  messageId: string,
  socket: WebSocket
) => {
  const send: SendSocketMessage = {
    cmd: SendSocketCmd.ModifyMessage,
    message: message,
    id: messageId
  }
  sendSocket(socket, send)
}

export const incrementIine = (messageId: string) => {
  return async (_dispatch: Dispatch, getState: () => State) => {
    sendSocket(getState().socket.socket, {
      cmd: SendSocketCmd.IncrementIine,
      id: messageId
    })
  }
}
