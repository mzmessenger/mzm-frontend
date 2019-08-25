export function createIconUrl(user: string) {
  return `/api/imager/icon/${user}`
}

export function sendSocket(socket: WebSocket, message: SendSocketMessage) {
  if (!socket) {
    return
  }
  socket.send(JSON.stringify(message))
}

export enum SendSocketCmdEnum {
  SendMessage = 'message:send',
  GetMessages = 'messages:room',
  GetRooms = 'rooms:get',
  EnterRoom = 'rooms:enter',
  ModifyMessage = 'message:modify',
  SendAlreadyRead = 'rooms:read'
}

export type SendSocketMessage =
  | {
      cmd: SendSocketCmdEnum.SendMessage
      message: string
      room: string
    }
  | {
      cmd: SendSocketCmdEnum.GetMessages
      room: string
      id?: string
    }
  | {
      cmd: SendSocketCmdEnum.GetRooms
    }
  | {
      cmd: SendSocketCmdEnum.EnterRoom
      name: string
    }
  | {
      cmd: SendSocketCmdEnum.ModifyMessage
      id: string
      message: string
    }
  | {
      cmd: SendSocketCmdEnum.SendAlreadyRead
      room: string
    }
