export function createIconUrl(user: string) {
  return `/api/imager/icon/${user}`
}

export function sendSocket(socket: WebSocket, message: SendSocketMessage) {
  socket.send(JSON.stringify(message))
}

export type SendSocketMessage =
  | {
      cmd: 'message:send'
      message: string
      room: string
    }
  | {
      cmd: 'messages:room'
      room: string
      id?: string
    }
  | {
      cmd: 'rooms:get'
    }
  | {
      cmd: 'rooms:enter'
      name: string
    }
