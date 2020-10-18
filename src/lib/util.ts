import { SendSocketMessage } from '../type'

export const sendSocket = (socket: WebSocket, message: SendSocketMessage) => {
  if (!socket || socket.readyState !== WebSocket.OPEN) {
    return
  }
  socket.send(JSON.stringify(message))
}

export const isReplied = (account: string, message: string) => {
  return new RegExp(`([\\s]+|^)@${account}(?:[^a-z]|$)`).test(message)
}

export const getRoomName = (path: string) => {
  const roomName = path.match(/rooms\/(.+)($|\/)/) && RegExp.$1
  return roomName
}
