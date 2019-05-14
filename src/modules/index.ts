import { State, Actions, SendMessage, ReceiveMessage } from './index.types'

const splited = location.pathname.split('/')
const initCurrentRoomName = splited[1] === 'rooms' ? splited[2] : ''

const initState: State = {
  socket: null,
  messages: [],
  rooms: [],
  currentRoom: '',
  currentRoomName: initCurrentRoomName,
  me: null
}

function getMessages(socket: WebSocket, currentRoom: string) {
  const send: SendMessage = {
    cmd: 'messages:room',
    room: currentRoom
  }
  socket.send(JSON.stringify(send))
}

export function reducer(state: State = initState, action: Actions) {
  switch (action.type) {
    case 'websocket:init': {
      state.socket = action.payload
      return state
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
    case 'message:receive:ping': {
      state.socket.send('pong')
      return state
    }
    case 'message:receive': {
      state.messages = [...state.messages, action.payload]
      return { ...state }
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
    case 'rooms:set:current': {
      const currentRoom = action.payload
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
        currentRoom,
        currentRoomName: state.currentRoomName
      }
    }
    case 'messages:room': {
      state.messages = action.payload
      return { ...state }
    }
    case 'me:set': {
      state.me = action.payload
      return { ...state }
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
  if (e.data === 'ping') {
    return { type: 'message:receive:ping' }
  }

  try {
    const parsed: ReceiveMessage = JSON.parse(e.data)
    if (parsed.cmd === 'rooms') {
      return { type: 'rooms:receive', payload: parsed.rooms }
    } else if (parsed.cmd === 'message:receive') {
      return { type: 'message:receive', payload: parsed.message }
    } else if (parsed.cmd === 'messages:room') {
      return { type: 'messages:room', payload: parsed.messages }
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
      const payload = await res.json()
      const setMe: Actions = { type: 'me:set', payload }
      dispatch(setMe)
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
