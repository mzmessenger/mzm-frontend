import { sendSocket, SendSocketMessage } from '../lib/util'
import { SocketAction } from './socket.types'

export function initSocket(
  socket: WebSocket,
  currentRoomName: string
): SocketAction {
  if (currentRoomName) {
    sendSocket(socket, { cmd: 'rooms:enter', name: currentRoomName })
  } else {
    sendSocket(socket, { cmd: 'rooms:get' })
  }
  return { type: 'websocket:init', payload: socket }
}

export function sendMessage(
  message: string,
  roomId: string,
  socket: WebSocket
) {
  const send: SendSocketMessage = {
    cmd: 'message:send',
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
    cmd: 'message:modify',
    message: message,
    id: messageId
  }
  sendSocket(socket, send)
}
