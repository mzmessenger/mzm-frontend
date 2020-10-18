import { Dispatch } from 'redux'
import { State } from './index'
import { sendSocket } from '../lib/util'
import {
  MessagesState,
  MessagesAction,
  MessagesActions,
} from './messages.type'
import { convertToHtml } from '../lib/markdown'
import {
  SendSocketCmd,
  ReceiveMessage,
  Message,
  VoteAnswer
} from '../type'

export const initState: MessagesState = {
  messages: {
    byId: {},
    allIds: []
  },
  voteAnswers: {
    byId: {}
  }
}

export const reducer = (
  state: MessagesState = initState,
  action: MessagesAction
): MessagesState => {
  switch (action.type) {
    case MessagesActions.AddMessages: {
      const allIds = [...state.messages.allIds]
      for (const message of action.payload.messages) {
        if (!allIds.includes(message.id)) {
          allIds.push(message.id)
          const m = { ...message }
          state.messages.byId[message.id] = m
        }
        if (message.vote) {
          state.voteAnswers.byId[message.id] = message.vote.answers
        }
      }
      state.messages.allIds = allIds
      return { ...state }
    }
    case MessagesActions.AddMessage: {
      const allIds = [...state.messages.allIds, action.payload.message.id]
      state.messages.byId[action.payload.message.id] = {
        ...action.payload.message
      }
      if (action.payload.message.vote) {
        state.voteAnswers.byId[action.payload.message.id] = action.payload.message.vote.answers
      }
      state.messages.allIds = [...allIds]
      return { ...state }
    }
    case MessagesActions.ModifyMessageSuccess: {
      const message = state.messages.byId[action.payload.message.id]
      state.messages.byId[action.payload.message.id] = {
        ...message,
        message: action.payload.message.message,
        html: action.payload.message.html
      }
      return { ...state }
    }
    case MessagesActions.UpdateIine: {
      const message = state.messages.byId[action.payload.message]
      state.messages.byId[action.payload.message] = {
        ...message,
        iine: action.payload.iine
      }

      return state
    }
    case MessagesActions.SetVoteAnswers: {
      state.voteAnswers.byId[action.payload.messageId] = action.payload.answers
      return { ...state }
    }
    case MessagesActions.SendVoteAnswer: {
      const answers = (state.voteAnswers.byId[action.payload.messageId][action.payload.vote.index] ?? []).filter((e) => { return e.userId !== action.payload.userId })
      answers.push(action.payload.vote)
      state.voteAnswers.byId[action.payload.messageId][action.payload.vote.index] = answers
      return state
    }
    case MessagesActions.RemoveVoteAnswer: {
      const answers = state.voteAnswers.byId[action.payload.messageId][action.payload.index].filter((e) => e.userId !== action.payload.userId)
      state.voteAnswers.byId[action.payload.messageId][action.payload.index] = [...answers]
      return state
    }
  }
  return state
}

const convertVoteAnswerByIndex = (answers: ReceiveMessage['vote']['answers']): { [key: number]: VoteAnswer[] } => {
  return answers.reduce((byIndex, answer) => {
    byIndex[answer.index] = byIndex[answer.index] ?? []
    byIndex[answer.index].push(answer)
    return byIndex
  }, {})
}

const convertMessage = async (m: ReceiveMessage): Promise<Message> => {
  const message: Message = { 
    id: m.id,
    userId: m.userId,
    icon: m.icon,
    userAccount: m.userAccount,
    message: m.message,
    iine: m.iine,
    updated: m.updated,
    createdAt: m.createdAt
  }
  message.html = await convertToHtml(m.message)
  if (m.vote) {
    const answers = convertVoteAnswerByIndex(m.vote.answers)
    message.vote = {
      questions: m.vote.questions,
      answers,
      status: m.vote.status
    }
  }
  return message
}

export const addMessages = (messages: ReceiveMessage[]) => {
  return async (dispatch: Dispatch<MessagesAction>) => {
    const promises = messages.map((m) => convertMessage(m))
    const converted = await Promise.all(promises)
    return dispatch({
      type: MessagesActions.AddMessages,
      payload: { messages: converted }
    })
  }
}

export const addMessage = (message: ReceiveMessage) => {
  return async (dispatch: Dispatch<MessagesAction>) => {
    const converted = await convertMessage(message)
    return dispatch({
      type: MessagesActions.AddMessage,
      payload: { message: converted }
    })
  }
}

export const modifyMessage = (message: ReceiveMessage) => {
  return async (dispatch: Dispatch<MessagesAction>) => {
    const converted = await convertMessage(message)
    return dispatch({
      type: MessagesActions.ModifyMessageSuccess,
      payload: {
        message: converted
      }
    })
  }
}

export const updateIine = (messageId: string, iine: number): MessagesAction => {
  return {
    type: MessagesActions.UpdateIine,
    payload: {
      message: messageId,
      iine
    }
  }
}

export const setVoteAnswers = (messageId: string, answers: VoteAnswer[]) => {
  return async (dispatch: Dispatch<MessagesAction>) => {
    // @todo 数秒間queueに詰めて最後の結果だけ入れる
    return dispatch({
      type: MessagesActions.SetVoteAnswers,
      payload: {
        messageId,
        answers: convertVoteAnswerByIndex(answers)
      }
    })
  }
}

export const sendVoteAnswer = (
  messageId: string,
  index: number,
  answer: number
) => {
  return async (dispatch: Dispatch<MessagesAction>, getState: () => State) => {
    const user = getState().user.me
    dispatch({
      type: MessagesActions.SendVoteAnswer,
      payload: {
        messageId: messageId,
        userId: getState().user.me.id,
        vote: {
          userId: user.id,
          userAccount: user.account,
          icon: user.iconUrl,
          index: index,
          answer: answer
        }
      }
    })
    sendSocket(getState().socket.socket, {
      cmd: SendSocketCmd.VOTE_ANSWER_SEND,
      messageId: messageId,
      index: index,
      answer: answer
    })
  }
}

export const removeVoteAnswer = (messageId: string, index: number) => {
  return async (dispatch: Dispatch<MessagesAction>, getState: () => State) => {
    dispatch({
      type: MessagesActions.RemoveVoteAnswer,
      payload: {
        messageId: messageId,
        userId: getState().user.me.id,
        index: index
      }
    })
    sendSocket(getState().socket.socket, {
      cmd: SendSocketCmd.VOTE_ANSWER_REMOVE,
      messageId: messageId,
      index: index
    })
  }
}

