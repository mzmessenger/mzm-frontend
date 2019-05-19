type Message = {
  id: string
  userId: string
  userAccount: string
  message: string
  createdAt: string
}

type MyInfo = {
  id: string
  account: string
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

export type SendMessage =
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

export type Actions =
  | {
      type: 'websocket:init'
      payload: WebSocket
    }
  | {
      type: 'message:send'
      payload: string
    }
  | {
      type: 'message:receive'
      payload: Message
    }
  | {
      type: 'rooms:receive'
      payload: { id: string; name: string }[]
    }
  | {
      type: 'rooms:set:current'
      payload: string
    }
  | {
      type: 'messages:room'
      payload: { room: string; existHistory: boolean; messages: Message[] }
    }
  | {
      type: 'me:set'
      payload: MyInfo
    }
  | {
      type: 'rooms:create'
    }
  | {
      type: 'messages:get:room:history'
      payload: string
    }

export type State = {
  socket: WebSocket
  messages: Message[]
  existHistory: boolean
  rooms: {
    id: string
    name: string
    current: boolean
  }[]
  currentRoom: string
  currentRoomName: string
  me: MyInfo
}
