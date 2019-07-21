type Message = {
  id: string
  userId: string
  userAccount: string
  message: string
  createdAt: string
}

export type ReceiveMessage =
  | {
      cmd: 'message:receive'
      message: Message
      room: string
    }
  | {
      cmd: 'rooms'
      rooms: { id: string; name: string }[]
    }
  | {
      cmd: 'messages:room'
      messages: Message[]
      room: string
      existHistory: boolean
    }
  | {
      cmd: 'rooms:enter:success'
      id: string
      name: string
    }

export type SocketState = {
  socket: WebSocket
}

export type SocketAction = {
  type: 'websocket:init'
  payload: WebSocket
}
