export type SocketState = {
  socket: WebSocket
  reconnectInterval: number
  reconnectAttempts: number
  reconnectTimer: number
}

export const SocketActions = {
  Init: 'SocketAction:Init',
  Open: 'SocketAction:Open',
  Close: 'SocketAction:Close'
} as const

export type SocketAction =
  | {
      type: typeof SocketActions.Init
      payload: WebSocket
    }
  | { type: typeof SocketActions.Open }
  | { type: typeof SocketActions.Close; payload: { timer: number } }
