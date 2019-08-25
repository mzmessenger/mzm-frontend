import { SocketState, SocketAction, SocketActionEnum } from './socket.types'

export const initState: SocketState = {
  socket: null
}

export function reducer(
  state: SocketState = initState,
  action: SocketAction
): SocketState {
  switch (action.type) {
    case SocketActionEnum.Init: {
      if (state.socket) {
        state.socket.close()
      }
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
