export type Message = {
  id: string
  userId: string
  iconUrl?: string
  userAccount: string
  message: string
  html?: string
  createdAt: string
}

export type Room = {
  id: string
  name: string
  messages: Message[]
  loading: boolean
  receivedMessages: boolean
  existHistory: boolean
}

export type RoomsState = {
  rooms: Room[]
  roomMap: Map<string, Room>
  currentRoomId: string
  currentRoomName: string
  currentRoomMessages: Message[]
  currentRoomExistHistory: boolean
  scrollBottomMessage: boolean
}

export type RoomsAction =
  | {
      type: 'receive:rooms'
      payload: { rooms: { id: string; name: string }[] }
    }
  | {
      type: 'message:send'
      payload: string
    }
  | {
      type: 'message:receive'
      payload: { message: Message; room: string }
    }
  | {
      type: 'rooms:enter:success'
      payload: { id: string; name: string; loading: boolean }
    }
  | {
      type: 'rooms:exit'
    }
  | {
      type: 'rooms:create'
      payload: { id: string; name: string }
    }
  | {
      type: 'messages:room'
      payload: {
        room: string
        existHistory: boolean
        messages: {
          id: string
          message: string
          userAccount: string
          userId: string
          createdAt: string
        }[]
      }
    }
  | {
      type: 'enter:room'
    }
  | {
      type: 'change:room'
      payload: {
        id: string
      }
    }
