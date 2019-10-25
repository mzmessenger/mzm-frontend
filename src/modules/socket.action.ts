import { Dispatch } from 'redux'
import { State } from './index'
import { sendSocket, SendSocketMessage, SendSocketCmdEnum } from '../lib/util'
import { SocketAction, SocketActionEnum } from './socket.types'

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
