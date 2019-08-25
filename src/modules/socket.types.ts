export type SocketState = {
  socket: WebSocket
}

export enum SocketActionEnum {
  Init = 'SocketAction:Init'
}

export type SocketAction = {
  type: SocketActionEnum.Init
  payload: WebSocket
}
