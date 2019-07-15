import { State, Action, SendMessage } from './index.types'
import { createIconUrl } from '../lib/util'
import { WIDTH_MOBILE } from '../lib/constants'

const splited = location.pathname.split('/')
const initCurrentRoomName = splited[1] === 'rooms' ? splited[2] : ''

const initState: State = {
  signup: false,
  signupAccount: '',
  login: false,
  socket: null,
  scrollBottomMessage: false,
  messages: [],
  existHistory: false,
  rooms: [],
  currentRoom: '',
  currentRoomName: initCurrentRoomName,
  me: null,
  device: 'pc',
  menuStatus: 'close',
  overlay: false
}

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

function setCurrent(
  id: string,
  rooms: State['rooms']
): { id: string; name: string; rooms: State['rooms'] } {
  let name = ''

  const renew = rooms.map(room => {
    room.current = room.id === id
    if (!name && room.id === id) {
      name = room.name
    }
    return room
  })

  return { id, name, rooms: renew }
}

export function reducer(state: State = initState, action: Action): State {
  switch (action.type) {
    case 'onresize':
      return {
        ...state,
        device: action.payload.innerWidth <= WIDTH_MOBILE ? 'mobile' : 'pc'
      }
    case 'menu:open':
      return { ...state, menuStatus: 'open', overlay: true }
    case 'menu:close':
      return { ...state, menuStatus: 'close', overlay: false }
    case 'signup': {
      return {
        ...initState,
        signup: true,
        signupAccount: action.payload.account
      }
    }
    case 'logout':
    case 'remove:user':
      return { ...initState, login: false }
    case 'websocket:init': {
      const socket = action.payload
      if (state.currentRoomName) {
        send(socket, { cmd: 'rooms:enter', name: state.currentRoomName })
      } else {
        send(socket, { cmd: 'rooms:get' })
      }
      return {
        ...state,
        socket: socket,
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
    case 'rooms:exit': {
      send(state.socket, { cmd: 'rooms:get' })
      return { ...state, currentRoom: '', currentRoomName: '' }
    }
    case 'rooms:create': {
      send(state.socket, { cmd: 'rooms:get' })
      const { name, rooms } = setCurrent(action.payload.id, state.rooms)
      return {
        ...state,
        currentRoom: action.payload.id,
        currentRoomName: name,
        rooms
      }
    }
    case 'rooms:receive': {
      if (state.currentRoom) {
        send(state.socket, { cmd: 'messages:room', room: state.currentRoom })
      }
      const rooms = action.payload.map(room => ({
        ...room,
        current: state.currentRoom === room.id
      }))
      return {
        ...state,
        messages: [],
        rooms: rooms
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
      const { id } = action.payload
      let messages = state.messages
      if (id !== state.currentRoom) {
        messages = []
        getMessages(state.socket, id)
      }
      const { name, rooms } = setCurrent(id, state.rooms)
      return {
        ...state,
        rooms: rooms,
        messages: messages,
        currentRoom: id,
        currentRoomName: name,
        menuStatus: 'close',
        overlay: false
      }
    }
    case 'message:receive': {
      if (action.payload.userAccount) {
        action.payload.iconUrl = createIconUrl(action.payload.userAccount)
      }
      return {
        ...state,
        messages: [...state.messages, action.payload],
        scrollBottomMessage: false
      }
    }
    case 'messages:room': {
      for (const message of action.payload.messages) {
        if (message.userAccount) {
          message.iconUrl = createIconUrl(message.userAccount)
        }
      }
      const received = action.payload.messages.map(message => {
        message.iconUrl = message.userAccount
          ? createIconUrl(message.userAccount)
          : null
        return message
      })
      const messages = [...received, ...state.messages]
      return {
        ...state,
        existHistory: action.payload.existHistory,
        messages: messages,
        scrollBottomMessage: state.messages.length === 0 && messages.length > 0
      }
    }
    case 'me:set':
      return { ...state, login: true, me: action.payload }
    case 'rooms:get': {
      send(state.socket, { cmd: 'rooms:get' })
      return state
    }
    case 'rooms:enter:success': {
      send(state.socket, { cmd: 'rooms:get' })
      return {
        ...state,
        currentRoom: action.payload.id,
        currentRoomName: action.payload.name
      }
    }
    default:
      return state
  }
}
