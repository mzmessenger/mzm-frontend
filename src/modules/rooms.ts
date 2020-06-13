import { Dispatch } from 'redux'
import {
  sendSocket,
  SendSocketMessage,
  SendSocketCmd,
  isReplied
} from '../lib/util'
import { State } from './index'
import { sortRoom } from './socket'
import {
  RoomsActions,
  RoomsAction,
  ReceiveRoom,
  RoomsState,
  Room
} from './rooms.types'
import { closeMenu } from './ui'

const splited = location.pathname.split('/')
const initCurrentRoomName = splited[1] === 'rooms' ? splited[2] : ''

export const initState: RoomsState = {
  rooms: { byId: {}, allIds: [], order: [] },
  users: { byId: {}, allIds: [] },
  currentRoomId: '',
  currentRoomName: initCurrentRoomName,
  currentRoomIcon: null,
  scrollTargetIndex: 'bottom',
  openRoomSetting: false
}

export const reducer = (
  state: RoomsState = initState,
  action: RoomsAction
): RoomsState => {
  switch (action.type) {
    case RoomsActions.SetRooms: {
      const { rooms, roomOrder } = action.payload
      const allIds = []
      for (const r of rooms) {
        if (!allIds.includes(r.id)) {
          allIds.push(r.id)

          const room: Room = {
            id: r.id,
            name: r.name,
            iconUrl: r.iconUrl,
            unread: r.unread,
            replied: r.replied,
            messages: [],
            loading: false,
            receivedMessages: false,
            existHistory: false,
            status: r.status
          }
          state.rooms.byId[r.id] = room
        }
      }
      allIds.sort((a, b) => roomOrder.indexOf(a) - roomOrder.indexOf(b))
      state.rooms.allIds = allIds
      state.rooms.order = roomOrder
      return { ...state }
    }
    case RoomsActions.SetRoomOrder: {
      state.rooms.order = [...action.payload.roomOrder]
      state.rooms.allIds = [...action.payload.allIds]
      return { ...state }
    }
    case RoomsActions.CreateRoom: {
      return {
        ...state,
        currentRoomId: action.payload.id,
        currentRoomName: action.payload.name,
        currentRoomIcon: ''
      }
    }
    case RoomsActions.GetMessages: {
      const room = state.rooms.byId[action.payload.id]
      if (room) {
        state.rooms.byId[action.payload.id] = { ...room, loading: true }
      }
      return { ...state }
    }
    case RoomsActions.ChangeRoom: {
      return {
        ...state,
        currentRoomId: action.payload.id,
        currentRoomName: state.rooms.byId[action.payload.id].name,
        currentRoomIcon: state.rooms.byId[action.payload.id].iconUrl,
        scrollTargetIndex: 'bottom',
        openRoomSetting: false
      }
    }
    case RoomsActions.EnterRoomSuccess: {
      const room = state.rooms.byId[action.payload.id]
      if (room) {
        state.rooms.byId[action.payload.id] = {
          ...state.rooms.byId[action.payload.id],
          loading: action.payload.loading
        }
      }

      return {
        ...state,
        currentRoomId: action.payload.id,
        currentRoomName: action.payload.name,
        currentRoomIcon: action.payload.iconUrl
      }
    }
    case RoomsActions.ExitRoom: {
      return {
        ...state,
        currentRoomId: '',
        currentRoomName: '',
        currentRoomIcon: ''
      }
    }
    case RoomsActions.ReceiveMessage: {
      const isCurrent = action.payload.room === state.currentRoomId
      const room = state.rooms.byId[action.payload.room]
      const replied = isReplied(action.payload.account, action.payload.message)

      state.rooms.byId[action.payload.room] = {
        ...room,
        messages: [...room.messages, action.payload.messageId],
        loading: false,
        unread: isCurrent ? room.unread : room.unread + 1,
        replied: replied ? room.replied + 1 : room.replied
      }
      state.rooms.allIds = [...state.rooms.allIds]

      return {
        ...state,
        scrollTargetIndex:
          action.payload.room === state.currentRoomId
            ? 'bottom'
            : state.scrollTargetIndex
      }
    }
    case RoomsActions.ReceiveMessages: {
      const roomId = action.payload.room
      // uniq
      const arr = [
        ...action.payload.messages,
        ...state.rooms.byId[roomId].messages
      ]
      const messages = [...new Set(arr)]

      const scrollTargetIndex =
        action.payload.room === state.currentRoomId &&
        !state.rooms.byId[roomId].receivedMessages
          ? action.payload.messages.length
          : state.scrollTargetIndex

      const room = {
        ...state.rooms.byId[roomId],
        messages,
        loading: false,
        receivedMessages: true,
        existHistory: action.payload.existHistory
      }
      state.rooms.byId[roomId] = room

      return {
        ...state,
        scrollTargetIndex
      }
    }
    case RoomsActions.AlreadyRead: {
      state.rooms.byId[action.payload.room] = {
        ...state.rooms.byId[action.payload.room],
        unread: 0,
        replied: 0
      }
      state.rooms.allIds = [...state.rooms.allIds]
      return { ...state }
    }
    case RoomsActions.ReloadMessages: {
      state.rooms.byId[action.payload.room].messages = [
        ...state.rooms.byId[action.payload.room].messages
      ]
      return { ...state }
    }
    case RoomsActions.ToggleSetting:
      return { ...state, openRoomSetting: !state.openRoomSetting }
    case RoomsActions.SetRoomUsers: {
      state.users.byId[action.payload.room] = {
        users: action.payload.users,
        count: action.payload.count
      }
      if (!state.users.allIds.includes(action.payload.room)) {
        state.users.allIds = [...state.users.allIds, action.payload.room]
      }
      return { ...state }
    }
    case RoomsActions.SetNextRoomUsers: {
      const users = state.users.byId[action.payload.room]
      state.users.byId[action.payload.room] = {
        ...users,
        users: [...users.users, ...action.payload.users]
      }
      return { ...state }
    }
    case RoomsActions.SetRoomStatus: {
      const room = state.rooms.byId[action.payload.id]
      state.rooms.byId[action.payload.id] = {
        ...room,
        status: action.payload.status
      }
      return { ...state }
    }
    default:
      return state
  }
}

export const getMessages = (roomId: string, socket: WebSocket): RoomsAction => {
  sendSocket(socket, {
    cmd: SendSocketCmd.MESSAGES_ROOM,
    room: roomId
  })
  return { type: RoomsActions.GetMessages, payload: { id: roomId } }
}

export const createRoom = (name: string) => {
  return async (dispatch: Dispatch<RoomsAction>, getState: () => State) => {
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
      sendSocket(getState().socket.socket, { cmd: SendSocketCmd.ROOMS_GET })
      dispatch({
        type: RoomsActions.CreateRoom,
        payload: { id: room.id, name: room.name }
      })
    }
    return res
  }
}

export const changeRoom = (roomId: string) => {
  return async (dispatch: Dispatch, getState: () => State) => {
    const room = getState().rooms.rooms.byId[roomId]
    if (room) {
      if (!room.receivedMessages && !room.loading) {
        dispatch(getMessages(room.id, getState().socket.socket))
      }
      dispatch({
        type: RoomsActions.ChangeRoom,
        payload: {
          id: room.id
        }
      })
      dispatch(closeMenu())
      return
    }
  }
}

export const enterRoom = (roomName: string) => {
  return async (dispatch: Dispatch, getState: () => State) => {
    const room = Object.values(getState().rooms.rooms.byId).find(
      (r) => r.name === roomName
    )
    if (room) {
      changeRoom(room.id)(dispatch, getState)
      return
    }
    sendSocket(getState().socket.socket, {
      cmd: SendSocketCmd.ROOMS_ENTER,
      name: encodeURIComponent(roomName)
    })
    dispatch(closeMenu())
  }
}

export const exitRoom = (roomId: string) => {
  return async (dispatch: Dispatch<RoomsAction>, getState: () => State) => {
    const res = await fetch('/api/rooms/enter', {
      method: 'DELETE',
      mode: 'cors',
      headers: {
        'Content-Type': 'application/json; charset=utf-8'
      },
      body: JSON.stringify({ room: roomId })
    })
    if (res.status === 200) {
      sendSocket(getState().socket.socket, { cmd: SendSocketCmd.ROOMS_GET })
      dispatch({ type: RoomsActions.ExitRoom })
    }
    return res
  }
}

export const getHistory = (id: string, roomId: string, socket: WebSocket) => {
  const message: SendSocketMessage = {
    cmd: SendSocketCmd.MESSAGES_ROOM,
    room: roomId,
    id: id
  }
  sendSocket(socket, message)
}

export const receiveRooms = (
  rooms: ReceiveRoom[],
  roomOrder: string[],
  currentRoomId: string
) => {
  return async (dispatch: Dispatch<RoomsAction>, getState: () => State) => {
    if (currentRoomId) {
      dispatch(getMessages(currentRoomId, getState().socket.socket))
    }

    dispatch({
      type: RoomsActions.SetRooms,
      payload: {
        rooms: rooms,
        roomOrder: roomOrder
      }
    })
  }
}

const sortRoomIds = (roomIds: string[], roomOrder: string[]) => {
  return [...roomIds].sort(
    (a, b) => roomOrder.indexOf(a) - roomOrder.indexOf(b)
  )
}

export const setRoomOrder = (roomOrder: string[]) => {
  return async (dispatch: Dispatch<RoomsAction>, getState: () => State) => {
    const newOrder = sortRoomIds(getState().rooms.rooms.allIds, roomOrder)
    dispatch({
      type: RoomsActions.SetRoomOrder,
      payload: { roomOrder, allIds: newOrder }
    })
  }
}

export const changeRoomOrder = (roomOrder: string[]) => {
  return async (dispatch: Dispatch<RoomsAction>, getState: () => State) => {
    const newOrder = sortRoomIds(getState().rooms.rooms.allIds, roomOrder)
    dispatch({
      type: RoomsActions.SetRoomOrder,
      payload: { roomOrder, allIds: newOrder }
    })
    sortRoom(newOrder)(dispatch, getState)
  }
}

export const receiveMessage = (
  messageId: string,
  message: string,
  room: string
) => {
  return async (dispatch: Dispatch<RoomsAction>, getState: () => State) => {
    // 現在みている部屋だったら既読フラグを返す
    if (room === getState().rooms.currentRoomId) {
      readMessages(room)(dispatch, getState)
    }
    return dispatch({
      type: RoomsActions.ReceiveMessage,
      payload: {
        messageId: messageId,
        message: message,
        room: room,
        account: getState().user.me.account
      }
    })
  }
}

export const receiveMessages = ({
  messageIds,
  room,
  existHistory
}: {
  messageIds: string[]
  room: string
  existHistory: boolean
}) => {
  return async (dispatch: Dispatch<RoomsAction>) => {
    return dispatch({
      type: RoomsActions.ReceiveMessages,
      payload: {
        room: room,
        existHistory: existHistory,
        messages: messageIds
      }
    })
  }
}

export const enterSuccess = (id: string, name: string, iconUrl: string) => {
  return async (dispatch: Dispatch<RoomsAction>, getState: () => State) => {
    const room = getState().rooms.rooms.byId[id]
    // すでに入っている部屋だったら部屋の再取得をしない
    if (!room) {
      sendSocket(getState().socket.socket, { cmd: SendSocketCmd.ROOMS_GET })
    }
    let loading = false
    if (room && !room.receivedMessages && !loading) {
      dispatch(getMessages(id, getState().socket.socket))
      loading = true
    }
    dispatch({
      type: RoomsActions.EnterRoomSuccess,
      payload: { id: id, name: name, iconUrl, loading }
    })
  }
}

export const getUsers = (roomId: string) => {
  return async (dispatch: Dispatch<RoomsAction>) => {
    if (!roomId) {
      return
    }
    const res = await fetch(`/api/rooms/${roomId}/users`, {
      method: 'GET',
      mode: 'cors',
      headers: {
        'Content-Type': 'application/json; charset=utf-8'
      }
    })

    if (res.status === 200) {
      res.json().then((body) => {
        dispatch({
          type: RoomsActions.SetRoomUsers,
          payload: { room: roomId, users: body.users, count: body.count }
        })
      })
    }

    return res
  }
}

export const getNextUsers = (roomId: string) => {
  return async (dispatch: Dispatch<RoomsAction>, getState: () => State) => {
    if (!roomId) {
      return
    }
    const { users, count } = getState().rooms.users.byId[roomId]
    if (users.length >= count) {
      return
    }
    const lastId = users[users.length - 1].enterId
    const query = new URLSearchParams([['threshold', lastId]])
    const res = await fetch(`/api/rooms/${roomId}/users?${query.toString()}`, {
      method: 'GET',
      mode: 'cors',
      headers: {
        'Content-Type': 'application/json; charset=utf-8'
      }
    })

    if (res.status === 200) {
      res.json().then((body) => {
        dispatch({
          type: RoomsActions.SetNextRoomUsers,
          payload: { room: roomId, users: body.users }
        })
      })
    }

    return res
  }
}

export const readMessages = (roomId: string) => {
  return async (_dispatch: Dispatch<RoomsAction>, getState: () => State) => {
    sendSocket(getState().socket.socket, {
      cmd: SendSocketCmd.ROOMS_READ,
      room: roomId
    })
  }
}

export const alreadyRead = (roomId: string): RoomsAction => {
  return { type: RoomsActions.AlreadyRead, payload: { room: roomId } }
}

export const reloadMessage = (roomId: string): RoomsAction => {
  return {
    type: RoomsActions.ReloadMessages,
    payload: { room: roomId }
  }
}

export const toggleRoomSetting = (): RoomsAction => {
  return { type: RoomsActions.ToggleSetting }
}

export const closeRoomSetting = (): RoomsAction => {
  return { type: RoomsActions.CloseSetting }
}

export const uploadIcon = (name: string, blob: Blob) => {
  return async (dispatch: Dispatch<RoomsAction>) => {
    const formData = new FormData()
    formData.append('icon', blob)
    const res = await fetch(`/api/icon/rooms/${name}`, {
      method: 'POST',
      body: formData,
      credentials: 'include'
    })

    if (res.ok) {
      const { id, version } = await res.json()
      dispatch({ type: RoomsActions.SetIcon, payload: { id, version } })
    }

    return res
  }
}

export const setRoomStatus = (
  id: string,
  status: 'open' | 'close'
): RoomsAction => {
  return { type: RoomsActions.SetRoomStatus, payload: { id, status } }
}
