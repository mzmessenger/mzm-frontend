export type MessagesState = {
  messages: {
    byId: {
      [key: string]: Message
    }
    allIds: string[]
  }
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
}

export const MessagesActions = {
  AddMessages: 'messageAction:addMessages',
  AddMessage: 'messageAction:addMessage',
  ModifyMessageSuccess: 'messageAction:modifyMessageSuccess',
  UpdateIine: 'roomAction:UpdateIine'
} as const

export type MessagesAction =
  | {
      type: typeof MessagesActions.AddMessages
      payload: { messages: Message[] }
    }
  | {
      type: typeof MessagesActions.AddMessage
      payload: { message: Message }
    }
  | {
      type: typeof MessagesActions.ModifyMessageSuccess
      payload: { message: Message }
    }
  | {
      type: typeof MessagesActions.UpdateIine
      payload: {
        message: string
        iine: number
      }
    }
