export type State = {
  signup: boolean
  signupAccount: string
  login: boolean
  socket: WebSocket
  scrollBottomMessage: boolean
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
  device: 'pc' | 'mobile'
  menuStatus: 'open' | 'close'
  overlay: boolean
}

type Message = {
  id: string
  userId: string
  iconUrl?: string
  userAccount: string
  message: string
  createdAt: string
}

type MyInfo = {
  id: string
  account: string
  iconUrl?: string
}

export type Action =
  | {
      type: 'signup'
      payload: { account?: string }
    }
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
      payload: {
        id: string
        name?: string
      }
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
      type: 'rooms:get'
    }
  | {
      type: 'messages:get:room:history'
      payload: string
    }
  | {
      type: 'logout'
    }
  | {
      type: 'rooms:exit'
    }
  | {
      type: 'rooms:create'
      payload: { id: string; name: string }
    }
  | {
      type: 'remove:user'
    }
  | {
      type: 'onresize'
      payload: { innerHeight: number; innerWidth: number }
    }
  | {
      type: 'menu:open'
    }
  | {
      type: 'menu:close'
    }
  | {
      type: 'overlay:show'
    }
  | {
      type: 'overlay:hide'
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
  | {
      cmd: 'rooms:enter'
      name: string
    }
