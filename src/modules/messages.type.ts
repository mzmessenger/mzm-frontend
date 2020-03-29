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

export enum MessageActionEnum {
  AddMessages = 'messageAction:addMessages',
  AddMessage = 'messageAction:addMessage',
  ModifyMessageSuccess = 'messageAction:modifyMessageSuccess',
  UpdateIine = 'roomAction:UpdateIine'
}

export type MessagesAction =
  | {
      type: MessageActionEnum.AddMessages
      payload: { messages: Message[] }
    }
  | {
      type: MessageActionEnum.AddMessage
      payload: { message: Message }
    }
  | {
      type: MessageActionEnum.ModifyMessageSuccess
      payload: { message: Message }
    }
  | {
      type: MessageActionEnum.UpdateIine
      payload: {
        message: string
        iine: number
      }
    }
