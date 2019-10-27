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
  unread: number
  messages: string[]
  loading: boolean
  receivedMessages: boolean
  existHistory: boolean
}

export type ReceiveRoom = {
  id: string
  name: string
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
}

export enum RoomActionEnum {
  ReceiveRooms = 'roomAction:receive',
  ReceiveMessage = 'roomAction:receiveMessage',
  ReceiveMessages = 'roomAction:receiveMessages',
  ReloadMessages = 'roomAction:reloadMessages',
  GetMessages = 'roomAction:getMessages',
  EnterRoomSuccess = 'roomAction:enterRoomSuccess',
  ExitRoom = 'roomAction:exitRoom',
  CreateRoom = 'roomAction:createRoom',
  ChangeRoom = 'roomAction:changeRoom',
  // 既読
  AlreadyRead = 'roomAction:alreadyRead'
}

export type RoomsAction =
  | {
      type: RoomActionEnum.ReceiveRooms
      payload: { rooms: ReceiveRoom[] }
    }
  | {
      type: RoomActionEnum.ReceiveMessage
      payload: { message: string; room: string }
    }
  | {
      type: RoomActionEnum.EnterRoomSuccess
      payload: { id: string; name: string; loading: boolean }
    }
  | {
      type: RoomActionEnum.ExitRoom
    }
  | {
      type: RoomActionEnum.CreateRoom
      payload: { id: string; name: string }
    }
  | {
      type: RoomActionEnum.ReceiveMessages
      payload: {
        room: string
        existHistory: boolean
        messages: string[]
      }
    }
  | {
      type: RoomActionEnum.ChangeRoom
      payload: {
        id: string
      }
    }
  | {
      type: RoomActionEnum.GetMessages
      payload: {
        id: string
      }
    }
  | {
      type: RoomActionEnum.AlreadyRead
      payload: {
        room: string
      }
    }
  | {
      type: RoomActionEnum.ReloadMessages
      payload: {
        room: string
      }
    }
