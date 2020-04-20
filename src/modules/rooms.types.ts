export type Message = {
  id: string
  userId: string
  iconUrl?: string
  userAccount: string
  message: string
  iine: number
  html?: string
  updated: boolean
  createdAt: string
}

export type Room = {
  id: string
  name: string
  iconUrl: string
  unread: number
  messages: string[]
  loading: boolean
  receivedMessages: boolean
  existHistory: boolean
}

export type ReceiveRoom = {
  id: string
  name: string
  iconUrl: string
  unread: number
}

export type RoomsState = {
  rooms: {
    byId: { [key: string]: Room }
    allIds: string[]
  }
  currentRoomId: string
  currentRoomName: string
  scrollTargetIndex: number | 'bottom'
  openRoomSetting: boolean
}

export const RoomsActions = {
  ReceiveRooms: 'roomAction:receive',
  ReceiveMessage: 'roomAction:receiveMessage',
  ReceiveMessages: 'roomAction:receiveMessages',
  ReloadMessages: 'roomAction:reloadMessages',
  GetMessages: 'roomAction:getMessages',
  EnterRoomSuccess: 'roomAction:enterRoomSuccess',
  ExitRoom: 'roomAction:exitRoom',
  CreateRoom: 'roomAction:createRoom',
  ChangeRoom: 'roomAction:changeRoom',
  // 既読
  AlreadyRead: 'roomAction:alreadyRead',
  ToggleSetting: 'roomAction:toggleSetting',
  CloseSetting: 'roomAction:closeSetting',
  SetIcon: 'roomAction:setIcon'
} as const

export type RoomsAction =
  | {
      type: typeof RoomsActions.ReceiveRooms
      payload: { rooms: ReceiveRoom[] }
    }
  | {
      type: typeof RoomsActions.ReceiveMessage
      payload: { message: string; room: string }
    }
  | {
      type: typeof RoomsActions.EnterRoomSuccess
      payload: { id: string; name: string; loading: boolean }
    }
  | {
      type: typeof RoomsActions.ExitRoom
    }
  | {
      type: typeof RoomsActions.CreateRoom
      payload: { id: string; name: string }
    }
  | {
      type: typeof RoomsActions.ReceiveMessages
      payload: {
        room: string
        existHistory: boolean
        messages: string[]
      }
    }
  | {
      type: typeof RoomsActions.ChangeRoom
      payload: {
        id: string
      }
    }
  | {
      type: typeof RoomsActions.GetMessages
      payload: {
        id: string
      }
    }
  | {
      type: typeof RoomsActions.AlreadyRead
      payload: {
        room: string
      }
    }
  | {
      type: typeof RoomsActions.ReloadMessages
      payload: {
        room: string
      }
    }
  | { type: typeof RoomsActions.ToggleSetting }
  | { type: typeof RoomsActions.CloseSetting }
  | {
      type: typeof RoomsActions.SetIcon
      payload: { id: string; version: string }
    }
