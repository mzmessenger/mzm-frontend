import { reducer as socketReducer } from './socket'
import { SocketState } from './socket.types'
import { reducer as roomsReducer } from './rooms'
import { RoomsState } from './rooms.types'
import { reducer as userReducer } from './user'
import { UserState } from './user.types'

import { combineReducers } from 'redux'

export type State = {
  socket: SocketState
  rooms: RoomsState
  user: UserState
}

export const reducer = combineReducers({
  socket: socketReducer,
  rooms: roomsReducer,
  user: userReducer
})
