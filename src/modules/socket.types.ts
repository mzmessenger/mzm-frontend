export type SocketState = {
  socket: WebSocket
  reconnectInterval: number
  reconnectAttempts: number
  reconnectTimer: number
}

export const SocketActions = {
  Init: 'SocketAction:Init',
  Open: 'SocketAction:Open',
  Close: 'SocketAction:Close'
} as const

export type SocketAction =
  | {
      type: typeof SocketActions.Init
      payload: WebSocket
    }
  | { type: typeof SocketActions.Open }
  | { type: typeof SocketActions.Close; payload: { timer: number } }

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

export type ReceiveRoom = {
  id: string
  name: string
  iconUrl: string
  unread: number
  replied: number
  status: 'open' | 'close'
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
      rooms: ReceiveRoom[]
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
      cmd: 'rooms:enter:fail'
      id: string | null
      name: string | null
      reason: string
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
