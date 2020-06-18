export const sendSocket = (socket: WebSocket, message: SendSocketMessage) => {
  if (!socket || socket.readyState !== WebSocket.OPEN) {
    return
  }
  socket.send(JSON.stringify(message))
}

export const SendSocketCmd = {
  ROOMS_GET: 'rooms:get',
  ROOMS_ENTER: 'rooms:enter',
  ROOMS_READ: 'rooms:read',
  ROOMS_SORT: 'rooms:sort',
  ROOMS_OPEN: 'rooms:open',
  ROOMS_CLOSE: 'rooms:close',
  MESSAGE_SEND: 'message:send',
  MESSAGE_IINE: 'message:iine',
  MESSAGE_MODIFY: 'message:modify',
  MESSAGES_ROOM: 'messages:room'
} as const

export type SendSocketMessage =
  | {
      cmd: typeof SendSocketCmd.ROOMS_GET
    }
  | {
      cmd: typeof SendSocketCmd.ROOMS_ENTER
      name: string
    }
  | {
      cmd: typeof SendSocketCmd.ROOMS_READ
      room: string
    }
  | {
      cmd: typeof SendSocketCmd.ROOMS_SORT
      roomOrder: string[]
    }
  | {
      cmd: typeof SendSocketCmd.MESSAGE_SEND
      message: string
      room: string
    }
  | {
      cmd: typeof SendSocketCmd.MESSAGE_IINE
      id: string
    }
  | {
      cmd: typeof SendSocketCmd.MESSAGE_MODIFY
      id: string
      message: string
    }
  | {
      cmd: typeof SendSocketCmd.MESSAGES_ROOM
      room: string
      id?: string
    }
  | {
      cmd: typeof SendSocketCmd.ROOMS_OPEN
      roomId: string
    }
  | {
      cmd: typeof SendSocketCmd.ROOMS_CLOSE
      roomId: string
    }

export const isReplied = (account: string, message: string) => {
  return new RegExp(`([\\s]+|^)@${account}(?:[^a-z]|$)`).test(message)
}
