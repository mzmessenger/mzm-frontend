import { Dispatch } from 'redux'
import { State } from './index'
import { sendSocket, SendSocketMessage, SendSocketCmdEnum } from '../lib/util'
import { SocketState, SocketAction, SocketActionEnum } from './socket.types'

export const initState: SocketState = {
  socket: null
}

export function reducer(
  state: SocketState = initState,
  action: SocketAction
): SocketState {
  switch (action.type) {
    case SocketActionEnum.Init: {
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

export function initSocket(
  socket: WebSocket,
  currentRoomName: string
): SocketAction {
  if (currentRoomName) {
    sendSocket(socket, {
      cmd: SendSocketCmdEnum.EnterRoom,
      name: currentRoomName
    })
  } else {
    sendSocket(socket, { cmd: SendSocketCmdEnum.GetRooms })
  }
  return { type: SocketActionEnum.Init, payload: socket }
}

export function sendMessage(
  message: string,
  roomId: string,
  socket: WebSocket
) {
  const send: SendSocketMessage = {
    cmd: SendSocketCmdEnum.SendMessage,
    message: message,
    room: roomId
  }
  sendSocket(socket, send)
}

export function modifyMessage(
  message: string,
  messageId: string,
  socket: WebSocket
) {
  const send: SendSocketMessage = {
    cmd: SendSocketCmdEnum.ModifyMessage,
    message: message,
    id: messageId
  }
  sendSocket(socket, send)
}

export function incrementIine(messageId: string) {
  return async function(_dispatch: Dispatch, getState: () => State) {
    sendSocket(getState().socket.socket, {
      cmd: SendSocketCmdEnum.IncrementIine,
      id: messageId
    })
  }
}
