import { SocketState, SocketAction } from './socket.types'

export const initState: SocketState = {
  socket: null
}

export function reducer(
  state: SocketState = initState,
  action: SocketAction
): SocketState {
  switch (action.type) {
    case 'websocket:init': {
      const socket = action.payload
      return {
        ...state,
        socket: socket
      }
    }
    default:
      return state
  }
}
