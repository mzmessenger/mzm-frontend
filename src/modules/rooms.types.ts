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
  messages: Message[]
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
  rooms: Room[]
  flatRooms: { [key: string]: { room: Room; index: number } }
  currentRoomId: string
  currentRoomName: string
  currentRoomMessages: Message[]
  currentRoomExistHistory: boolean
  scrollTargetIndex: number | 'bottom'
}

export enum RoomActionEnum {
  ReceiveRooms = 'roomAction:receive',
  ReceiveMessage = 'roomAction:receiveMessage',
  ReceiveMessages = 'roomAction:receiveMessages',
  GetMessages = 'roomAction:getMessages',
  ModifyMessageSuccess = 'roomAction:modifyMessageSuccess',
  EnterRoomSuccess = 'roomAction:enterRoomSuccess',
  ExitRoom = 'roomAction:exitRoom',
  CreateRoom = 'roomAction:createRoom',
  ChangeRoom = 'roomAction:changeRoom',
  // 既読
  AlreadyRead = 'roomAction:alreadyRead',
  ReceiveIine = 'roomAction:reveiceIine'
}

export type RoomsAction =
  | {
      type: RoomActionEnum.ReceiveRooms
      payload: { rooms: ReceiveRoom[] }
    }
  | {
      type: RoomActionEnum.ReceiveMessage
      payload: { message: Message; room: string }
    }
  | {
      type: RoomActionEnum.ModifyMessageSuccess
      payload: { message: Message; room: string }
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
        messages: Message[]
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
      type: RoomActionEnum.ReceiveIine
      payload: {
        room: string
        message: string
        iine: number
      }
    }
