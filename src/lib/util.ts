export const sendSocket = (socket: WebSocket, message: SendSocketMessage) => {
  if (!socket) {
    return
  }
  socket.send(JSON.stringify(message))
}

export const SendSocketCmd = {
  SendMessage: 'message:send',
  GetMessages: 'messages:room',
  GetRooms: 'rooms:get',
  EnterRoom: 'rooms:enter',
  ModifyMessage: 'message:modify',
  SendAlreadyRead: 'rooms:read',
  IncrementIine: 'message:iine'
} as const

export type SendSocketMessage =
  | {
      cmd: typeof SendSocketCmd.SendMessage
      message: string
      room: string
    }
  | {
      cmd: typeof SendSocketCmd.GetMessages
      room: string
      id?: string
    }
  | {
      cmd: typeof SendSocketCmd.GetRooms
    }
  | {
      cmd: typeof SendSocketCmd.EnterRoom
      name: string
    }
  | {
      cmd: typeof SendSocketCmd.ModifyMessage
      id: string
      message: string
    }
  | {
      cmd: typeof SendSocketCmd.SendAlreadyRead
      room: string
    }
  | {
      cmd: typeof SendSocketCmd.IncrementIine
      id: string
    }
