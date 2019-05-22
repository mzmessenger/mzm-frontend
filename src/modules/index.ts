import { State, Actions, SendMessage, ReceiveMessage } from './index.types'
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

function getMessages(socket: WebSocket, currentRoom: string) {
  const send: SendMessage = {
    cmd: 'messages:room',
    room: currentRoom
  }
  socket.send(JSON.stringify(send))
}

export function reducer(state: State = initState, action: Actions) {
  switch (action.type) {
    case 'logout': {
      return { ...initState }
    }
    case 'websocket:init': {
      state.socket = action.payload
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
      const send: SendMessage = {
        cmd: 'message:send',
        message: action.payload,
        room: state.currentRoom
      }
      state.socket.send(JSON.stringify(send))
      return state
    }
    case 'rooms:receive': {
      // historyで初期値が設定された時用の処理
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
      if (id) {
        getMessages(state.socket, id)
      }
      return {
        ...state,
        rooms: [...action.payload],
        currentRoom: id ? id : state.currentRoom,
        currentRoomName: name ? name : state.currentRoomName
      }
    }
    case 'messages:get:room:history': {
      const send: SendMessage = {
        cmd: 'messages:room',
        room: state.currentRoom,
        id: action.payload
      }
      state.socket.send(JSON.stringify(send))
      return state
    }
    case 'rooms:set:current': {
      const currentRoom = action.payload
      if (currentRoom === state.currentRoom) {
        return state
      }
      state.rooms.forEach(e => {
        if (e.id === action.payload) {
          state.currentRoomName = e.name
        }
        e.current = e.id === action.payload
      })
      getMessages(state.socket, currentRoom)
      return {
        ...state,
        rooms: [...state.rooms],
        messages: [],
        currentRoom,
        currentRoomName: state.currentRoomName
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
    case 'rooms:create': {
      const send: SendMessage = {
        cmd: 'rooms:get'
      }
      state.socket.send(JSON.stringify(send))
      return state
    }
    default:
      return state
  }
}

export function initSocket(socket: WebSocket): Actions {
  return { type: 'websocket:init', payload: socket }
}

export function sendMessage(message: string): Actions {
  return { type: 'message:send', payload: message }
}

export function onMessage(e: MessageEvent): Actions {
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
    }
  } catch (e) {
    console.error(e)
  }
}

export function setCurrentRooms(roomId: string): Actions {
  return { type: 'rooms:set:current', payload: roomId }
}

export function getMyInfo(dispatch) {
  return async function() {
    const res = await fetch('/api/user/@me')
    if (res.status === 200) {
      const payload: { account: string; id: string } = await res.json()
      const setMe: Actions = { type: 'me:set', payload }
      dispatch(setMe)

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

export function createRoom(dispatch) {
  return async function(name: string) {
    const res = await fetch('/api/rooms', {
      method: 'POST',
      mode: 'cors',
      headers: {
        'Content-Type': 'application/json; charset=utf-8'
      },
      body: JSON.stringify({ name })
    })
    if (res.status === 200) {
      const room = await res.json()
      const create: Actions = { type: 'rooms:create' }
      dispatch(create)
      dispatch({ type: 'rooms:set:current', payload: room.id })
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
