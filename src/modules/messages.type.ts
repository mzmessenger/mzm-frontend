import { Message, VoteAnswer } from '../type'

export type MessagesState = {
  messages: {
    byId: {
      [key: string]: Message
    }
    allIds: string[]
  }
  voteAnswers: {
    byId: {
      [key: string]: {
        [key: number]: VoteAnswer[]
      }
    }
  }
}


export const MessagesActions = {
  AddMessages: 'messageAction:addMessages',
  AddMessage: 'messageAction:addMessage',
  ModifyMessageSuccess: 'messageAction:modifyMessageSuccess',
  UpdateIine: 'messageAction:updateIine',
  SetVoteAnswers: 'messageAction:setVoteAnswers',
  SendVoteAnswer: 'messageAction:sendVoteAnswer',
  RemoveVoteAnswer: 'messageAction:removeVoteAnswer'
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
  | {
      type: typeof MessagesActions.SetVoteAnswers
      payload: {
        messageId: string
        answers: {
          [key: number]: VoteAnswer[]
        }
      }
    }
  | {
      type: typeof MessagesActions.SendVoteAnswer
      payload: {
        messageId: string,
        userId: string,
        vote: VoteAnswer
      }
    }
  | {
      type: typeof MessagesActions.RemoveVoteAnswer
      payload: {
        messageId: string,
        userId: string
        index: number
      }
    }
