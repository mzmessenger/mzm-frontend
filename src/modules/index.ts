import { Dispatch } from 'redux'
import { State, Action, SendMessage, ReceiveMessage } from './index.types'
import identicon from '../lib/identicon'

const splited = location.pathname.split('/')
const initCurrentRoomName = splited[1] === 'rooms' ? splited[2] : ''

const initState: State = {
  login: false,
  socket: null,
  messages: [],
  existHistory: false,
  rooms: [],
  currentRoom: '',
  currentRoomName: initCurrentRoomName,
  me: null,
  icon: null
}

const icons = new Map<string, string>()

function send(socket: WebSocket, message: SendMessage) {
  socket.send(JSON.stringify(message))
}

function getMessages(socket: WebSocket, currentRoom: string) {
  const message: SendMessage = {
    cmd: 'messages:room',
    room: currentRoom
  }
  send(socket, message)
}

export function reducer(state: State = initState, action: Action) {
  switch (action.type) {
    case 'logout': {
      return { ...initState }
    }
    case 'websocket:init': {
      const socket = action.payload
      state.socket = socket
      const splited = location.pathname.split('/')
      const name = splited[1] === 'rooms' ? splited[2] : ''
      send(socket, { cmd: 'rooms:enter', name })

      return {
        ...state,
        socket: action.payload,
        messages: initState.messages,
        rooms: initState.rooms,
        existHistory: initState.existHistory
      }
    }
    case 'message:send': {
      if (!state.currentRoom) {
        return state
      }
      const message: SendMessage = {
        cmd: 'message:send',
        message: action.payload,
        room: state.currentRoom
      }
      send(state.socket, message)
      return state
    }
    case 'rooms:receive': {
      // historyで初期値が設定された時用の処理
      /*
      let id = null
      let name = null
      action.payload.forEach(e => {
        const current =
          state.currentRoom === e.id || state.currentRoomName === e.name
        if (current) {
          id = e.id
          name = e.name
        }
        return { ...e, current }
      })
      */
      if (state.currentRoom) {
        getMessages(state.socket, state.currentRoom)
      }
      return {
        ...state,
        rooms: [...action.payload]
        // currentRoom: id ? id : state.currentRoom,
        // currentRoomName: name ? name : state.currentRoomName
      }
    }
    case 'messages:get:room:history': {
      const message: SendMessage = {
        cmd: 'messages:room',
        room: state.currentRoom,
        id: action.payload
      }
      send(state.socket, message)
      return state
    }
    case 'rooms:set:current': {
      const id = action.payload.id
      getMessages(state.socket, id)
      let name = action.payload.name
      state.rooms.forEach(room => {
        room.current = room.id === id
        if (!name && room.id === id) {
          name = room.name
        }
      })
      return {
        ...state,
        rooms: [...state.rooms],
        messages: [],
        currentRoom: id,
        currentRoomName: name
      }
    }
    case 'message:receive': {
      if (icons.has(action.payload.id)) {
        action.payload.icon = icons.get(action.payload.id)
      } else {
        identicon(action.payload.userId, 100, (err, data) => {
          if (!err) {
            action.payload.icon = data
          }
        })
      }
      state.messages = [...state.messages, action.payload]
      return { ...state }
    }
    case 'messages:room': {
      for (const message of action.payload.messages) {
        if (icons.has(message.userAccount)) {
          message.icon = icons.get(message.userAccount)
        } else {
          identicon(message.userAccount, 100, (err, data) => {
            if (!err) {
              message.icon = data
            }
          })
        }
      }
      const messages = [...action.payload.messages, ...state.messages]
      return { ...state, existHistory: action.payload.existHistory, messages }
    }
    case 'me:set': {
      return { ...state, login: true, me: action.payload }
    }
    case 'me:set:icon': {
      return { ...state, icon: action.payload }
    }
    case 'rooms:get': {
      send(state.socket, { cmd: 'rooms:get' })
      return state
    }
    default:
      return state
  }
}

export function initSocket(socket: WebSocket): Action {
  return { type: 'websocket:init', payload: socket }
}

export function sendMessage(message: string): Action {
  return { type: 'message:send', payload: message }
}

export function onMessage(e: MessageEvent): Action {
  try {
    const parsed: ReceiveMessage = JSON.parse(e.data)
    if (parsed.cmd === 'rooms') {
      return { type: 'rooms:receive', payload: parsed.rooms }
    } else if (parsed.cmd === 'message:receive') {
      return { type: 'message:receive', payload: parsed.message }
    } else if (parsed.cmd === 'messages:room') {
      return {
        type: 'messages:room',
        payload: {
          room: parsed.room,
          existHistory: parsed.existHistory,
          messages: parsed.messages
        }
      }
    } else if (parsed.cmd === 'rooms:enter:success') {
      return {
        type: 'rooms:set:current',
        payload: {
          id: parsed.id,
          name: parsed.name
        }
      }
    }
  } catch (e) {
    console.error(e)
  }
}

export function setCurrentRooms(roomId: string): Action {
  return { type: 'rooms:set:current', payload: { id: roomId } }
}

export function getMyInfo() {
  return async function(dispatch: Dispatch<Action>) {
    const res = await fetch('/api/user/@me')
    if (res.status === 200) {
      const payload: { account: string; id: string } = await res.json()
      dispatch({ type: 'me:set', payload })

      if (!icons.get(payload.account)) {
        identicon(payload.account, 100, (err, data) => {
          if (!err) {
            dispatch({ type: 'me:set:icon', payload: data })
          }
        })
      }
    } else {
      dispatch({ type: 'logout' })
    }
  }
}

export function createRoom(name: string) {
  return async function(dispatch: Dispatch<Action>) {
    const res = await fetch('/api/rooms', {
      method: 'POST',
      mode: 'cors',
      headers: {
        'Content-Type': 'application/json; charset=utf-8'
      },
      body: JSON.stringify({ name })
    })
    if (res.status === 200) {
      const room: { id: string; name: string } = await res.json()
      dispatch({ type: 'rooms:get' })
      dispatch({
        type: 'rooms:set:current',
        payload: { id: room.id, name: room.name }
      })
    }
    return res
  }
}

export function exitRoom(roomId: string) {
  return async function(dispatch: Dispatch<Action>) {
    const res = await fetch('/api/rooms/enter', {
      method: 'DELETE',
      mode: 'cors',
      headers: {
        'Content-Type': 'application/json; charset=utf-8'
      },
      body: JSON.stringify({ room: roomId })
    })
    if (res.status === 200) {
      dispatch({ type: 'rooms:get' })
      // todo: clear current
    }
    return res
  }
}

export function getHistory(id: string) {
  return { type: 'messages:get:room:history', payload: id }
}

export function logout() {
  return { type: 'logout' }
}
