jest.mock('../lib/markdown', () => ({
  convertToHtml: jest.fn()
}))

import * as action from './rooms.action'
import { Room } from './rooms.types'

test('enterRoom already entered', async () => {
  const socket = { send: jest.fn() }
  const rooms: Room[] = [
    {
      id: '001',
      name: 'test',
      messages: [],
      loading: false,
      receivedMessages: false,
      existHistory: false,
      unread: 0
    }
  ]
  const dispatch = jest.fn()
  const getState = () => ({
    socket: {
      socket
    }
  })

  action.enterRoom('test', rooms)(dispatch, getState as any)

  expect(dispatch.mock.calls.length).toBe(3)

  expect(socket.send.mock.calls.length).toBe(1)
  const [arg] = socket.send.mock.calls[0]
  expect(JSON.parse(arg).cmd).toStrictEqual('messages:room')

  const [
    [getMessagesArg],
    [chaneRoomArgs],
    [menuCloseArgs]
  ] = dispatch.mock.calls
  expect(getMessagesArg.type).toStrictEqual('get:messages')

  expect(chaneRoomArgs.type).toStrictEqual('change:room')
  expect(chaneRoomArgs.payload.id).toStrictEqual('001')

  expect(menuCloseArgs.type).toStrictEqual('menu:close')
})

test('enterRoom does not enter', async () => {
  const socket = { send: jest.fn() }
  const rooms: Room[] = []

  const dispatch = jest.fn()
  const getState = () => ({
    socket: {
      socket
    }
  })

  action.enterRoom('test', rooms)(dispatch, getState as any)

  expect(socket.send.mock.calls.length).toBe(1)
  const [arg] = socket.send.mock.calls[0]
  expect(arg).toBe(
    JSON.stringify({
      cmd: 'rooms:enter',
      name: 'test'
    })
  )

  const [args0] = dispatch.mock.calls[0]
  expect(args0.type).toStrictEqual('enter:room')

  const [args1] = dispatch.mock.calls[1]
  expect(args1.type).toStrictEqual('menu:close')
})
