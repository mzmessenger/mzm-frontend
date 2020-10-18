export type ReceiveMessage = {
  id: string
  userId: string
  userAccount: string
  message: string
  iine: number
  createdAt: string
  updated: boolean
  updatedAt: string
  icon: string
  vote?: Vote
}

type Vote = {
  questions: { text: string }[]
  answers: {
    answer: number
    index: number
    userId: string
    userAccount: string
    icon: string
  }[]
  status: 0 | 1
}

export type ReceiveRoom = {
  id: string
  name: string
  iconUrl: string
  unread: number
  replied: number
  status: 'open' | 'close'
}


export type ReceiveSocketMessage =
  | { cmd: 'client:reload' }
  | {
      cmd: 'message:receive'
      message: ReceiveMessage
      room: string
    }
  | {
      cmd: 'rooms'
      rooms: ReceiveRoom[]
      roomOrder: string[]
    }
  | {
      cmd: 'messages:room'
      messages: ReceiveMessage[]
      room: string
      existHistory: boolean
    }
  | {
      cmd: 'rooms:enter:success'
      id: string
      name: string
      iconUrl: string
    }
  | {
      cmd: 'rooms:enter:fail'
      id: string | null
      name: string | null
      reason: string
    }
  | {
      cmd: 'message:modify'
      message: ReceiveMessage
      room: string
    }
  | {
      cmd: 'rooms:read'
      user: string
      room: string
    }
  | {
      cmd: 'message:iine'
      room: string
      id: string
      iine: number
    }
  | {
      user: string
      cmd: 'rooms:sort:success'
      roomOrder: string[]
    }
  | {
      user?: string
      cmd: 'vote:answers'
      messageId: string
      answers: Vote['answers']
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
  MESSAGES_ROOM: 'messages:room',
  VOTE_ANSWER_SEND: 'vote:answer:send',
  VOTE_ANSWER_REMOVE: 'vote:answer:remove'
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
      vote?: {
        questions: { text: string }[]
      }
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
  | {
      cmd: typeof SendSocketCmd.VOTE_ANSWER_SEND
      messageId: string
      index: number
      answer: number
    }
  | {
      cmd: typeof SendSocketCmd.VOTE_ANSWER_REMOVE
      messageId: string
      index: number
    }

export const VoteAnswerTypeEnum = {
  ok: '○',
  ng: '×',
  na: '△'
} as const

export type VoteAnswer = {
  answer: number
  index: number
  userId: string
  userAccount: string
  icon: string
}

export type Message = {
  id: string
  userId: string
  icon: string
  userAccount: string
  message: string
  iine: number
  html?: string
  updated: boolean
  createdAt: string
  vote?: {
    questions: { text: string }[]
    answers: {
      [key: number]: VoteAnswer[]
    }
    status: 0 | 1
  }
}
