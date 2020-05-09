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

export type RoomUser = {
  account: string
  icon: string
  userId: string
  enterId: string
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
    order: string[]
  }
  users: {
    byId: { [key: string]: { count: number; users: RoomUser[] } }
    allIds: string[]
  }
  currentRoomId: string
  currentRoomName: string
  currentRoomIcon: string
  scrollTargetIndex: number | 'bottom'
  openRoomSetting: boolean
}

export const RoomsActions = {
  SetRooms: 'roomAction:setRooms',
  SetRoomOrder: 'roomAction:setRoomOrder',
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
  SetIcon: 'roomAction:setIcon',
  SetRoomUsers: 'roomAction:setRoomUsers',
  SetNextRoomUsers: 'roomAction:setNextRoomUsers'
} as const

export type RoomsAction =
  | {
      type: typeof RoomsActions.SetRooms
      payload: { rooms: ReceiveRoom[]; roomOrder: string[] }
    }
  | {
      type: typeof RoomsActions.ReceiveMessage
      payload: { message: string; room: string }
    }
  | {
      type: typeof RoomsActions.EnterRoomSuccess
      payload: { id: string; name: string; iconUrl: string; loading: boolean }
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
  | {
      type: typeof RoomsActions.SetRoomOrder
      payload: { roomOrder: string[]; allIds: string[] }
    }
  | {
      type: typeof RoomsActions.SetRoomUsers
      payload: { room: string; users: RoomUser[]; count: number }
    }
  | {
      type: typeof RoomsActions.SetNextRoomUsers
      payload: { room: string; users: RoomUser[] }
    }
