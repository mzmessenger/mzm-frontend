import { Dispatch } from 'redux'
import {
  MessagesState,
  MessagesAction,
  MessagesActions,
  Message
} from './messages.type'
import { convertToHtml } from '../lib/markdown'

export const initState: MessagesState = {
  messages: {
    byId: {},
    allIds: []
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
      }
      state.messages.allIds = allIds
      return { ...state }
    }
    case MessagesActions.AddMessage: {
      const allIds = [...state.messages.allIds, action.payload.message.id]
      state.messages.byId[action.payload.message.id] = {
        ...action.payload.message
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
  }
  return state
}

export const addMessages = (messages: Message[]) => {
  return async (dispatch: Dispatch<MessagesAction>) => {
    const promises = messages.map((m) => convertToHtml(m.message))
    const html = await Promise.all(promises)
    const converted = messages.map((m, i) => {
      return { ...m, html: html[i] }
    })
    return dispatch({
      type: MessagesActions.AddMessages,
      payload: { messages: converted }
    })
  }
}

export const addMessage = (message: Message) => {
  return async (dispatch: Dispatch<MessagesAction>) => {
    const html = await convertToHtml(message.message)
    const converted = { ...message, html }
    return dispatch({
      type: MessagesActions.AddMessage,
      payload: { message: converted }
    })
  }
}

export const modifyMessage = (message: Message) => {
  return async (dispatch: Dispatch<MessagesAction>) => {
    const html = await convertToHtml(message.message)
    return dispatch({
      type: MessagesActions.ModifyMessageSuccess,
      payload: {
        message: { ...message, html: html }
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
