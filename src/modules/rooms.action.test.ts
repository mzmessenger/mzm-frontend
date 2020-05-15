jest.mock('../lib/markdown', () => ({
  convertToHtml: jest.fn()
}))

import { SendSocketCmd } from '../lib/util'
import * as action from './rooms'
import { RoomsActions } from './rooms.types'
import { UIActions } from './ui.types'

test('changeRoom', async () => {
  const socket = {
    send: jest.fn(),
    readyState: WebSocket.OPEN
  }
  const dispatch = jest.fn()
  const getState = () => ({
    socket: {
      socket
    },
    rooms: {
      rooms: {
        byId: {
          '001': {
            id: '001',
            name: 'test',
            messages: [],
            loading: false,
            receivedMessages: false,
            existHistory: false,
            unread: 0
          }
        },
        allIds: ['001']
      }
    }
  })

  action.changeRoom('001')(dispatch, getState as any)

  expect(dispatch.mock.calls.length).toBe(3)

  expect(socket.send.mock.calls.length).toBe(1)
  const [arg] = socket.send.mock.calls[0]
  expect(JSON.parse(arg).cmd).toStrictEqual(SendSocketCmd.MESSAGES_ROOM)

  const [
    [getMessagesArg],
    [chaneRoomArgs],
    [menuCloseArgs]
  ] = dispatch.mock.calls
  expect(getMessagesArg.type).toStrictEqual(RoomsActions.GetMessages)
  expect(chaneRoomArgs.type).toStrictEqual(RoomsActions.ChangeRoom)
  expect(chaneRoomArgs.payload.id).toStrictEqual('001')

  expect(menuCloseArgs.type).toStrictEqual(UIActions.CloseMenu)
})

test('changeRoom not enter', async () => {
  const socket = {
    send: jest.fn(),
    readyState: WebSocket.OPEN
  }
  const dispatch = jest.fn()
  const getState = () => ({
    socket: {
      socket
    },
    rooms: {
      rooms: {
        byId: {
          '001': {
            id: '001',
            name: 'test',
            messages: [],
            loading: false,
            receivedMessages: false,
            existHistory: false,
            unread: 0
          }
        },
        allIds: ['001']
      }
    }
  })

  action.changeRoom('aaa')(dispatch, getState as any)

  expect(dispatch.mock.calls.length).toBe(0)
})

test('enterRoom already entered', async () => {
  const socket = {
    send: jest.fn(),
    readyState: WebSocket.OPEN
  }
  const dispatch = jest.fn()
  const getState = () => ({
    socket: {
      socket
    },
    rooms: {
      rooms: {
        byId: {
          '001': {
            id: '001',
            name: 'test',
            messages: [],
            loading: false,
            receivedMessages: false,
            existHistory: false,
            unread: 0
          }
        },
        allIds: ['001']
      }
    }
  })

  action.enterRoom('test')(dispatch, getState as any)

  expect(dispatch.mock.calls.length).toBe(3)

  expect(socket.send.mock.calls.length).toBe(1)
  const [arg] = socket.send.mock.calls[0]
  expect(JSON.parse(arg).cmd).toStrictEqual(SendSocketCmd.MESSAGES_ROOM)

  const [
    [getMessagesArg],
    [chaneRoomArgs],
    [menuCloseArgs]
  ] = dispatch.mock.calls
  expect(getMessagesArg.type).toStrictEqual(RoomsActions.GetMessages)
  expect(chaneRoomArgs.type).toStrictEqual(RoomsActions.ChangeRoom)
  expect(chaneRoomArgs.payload.id).toStrictEqual('001')

  expect(menuCloseArgs.type).toStrictEqual(UIActions.CloseMenu)
})

test('enterRoom does not enter', async () => {
  const socket = {
    send: jest.fn(),
    readyState: WebSocket.OPEN
  }

  const dispatch = jest.fn()
  const getState = () => ({
    socket: {
      socket
    },
    rooms: {
      rooms: {
        byId: {},
        allIds: []
      }
    }
  })

  action.enterRoom('test')(dispatch, getState as any)

  expect(socket.send.mock.calls.length).toBe(1)
  const [arg] = socket.send.mock.calls[0]
  expect(arg).toBe(
    JSON.stringify({
      cmd: SendSocketCmd.ROOMS_ENTER,
      name: 'test'
    })
  )

  const [args] = dispatch.mock.calls[0]
  expect(args.type).toStrictEqual(UIActions.CloseMenu)
})

test('receiveMessage', async () => {
  const room = 'roomid'

  const dispatch = jest.fn()
  const socket = {
    send: jest.fn(),
    readyState: WebSocket.OPEN
  }
  const getState = () => ({
    rooms: {
      currentRoomId: room
    },
    socket: {
      socket
    }
  })

  const message = {
    id: 'id',
    userId: 'userid',
    userAccount: 'account',
    message: 'message',
    updated: false,
    createdAt: new Date().toString()
  }

  await action.receiveMessage(message.id, room)(dispatch, getState as any)

  // 同じ部屋なら既読処理が呼ばれる
  expect(socket.send.mock.calls.length).toBe(1)
  const [arg] = socket.send.mock.calls[0]
  expect(JSON.parse(arg).cmd).toStrictEqual(SendSocketCmd.ROOMS_READ)
})
