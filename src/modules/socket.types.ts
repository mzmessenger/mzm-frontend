export type SocketState = {
  socket: WebSocket
}

export const SocketActions = {
  Init: 'SocketAction:Init'
} as const

export type SocketAction = {
  type: typeof SocketActions.Init
  payload: WebSocket
}

type Message = {
  id: string
  userId: string
  userAccount: string
  message: string
  iine: number
  createdAt: string
  updated: boolean
  updatedAt: string
  icon: string
}

export type ReceiveMessage =
  | { cmd: 'client:reload' }
  | {
      cmd: 'message:receive'
      message: Message
      room: string
    }
  | {
      cmd: 'rooms'
      rooms: { id: string; name: string; iconUrl: string; unread: number }[]
      roomOrder: string[]
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
      iconUrl: string
    }
  | {
      cmd: 'message:modify'
      message: Message
      room: string
    }
  | {
      cmd: 'rooms:read'
      user: string
      room: string
    }
  | {
      cmd: 'message:iine'
      room: string
      id: string
      iine: number
    }
  | {
      user: string
      cmd: 'rooms:sort:success'
      roomOrder: string[]
    }
