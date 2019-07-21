jest.mock('../lib/markdown', () => ({
  convertToHtml: jest.fn()
}))

import * as action from './rooms.action'
import { Room } from './rooms.types'

test('enterRoom already entered', async () => {
  expect.assertions(4)

  const socket = { send: jest.fn() }
  const rooms: Room[] = [
    {
      id: '001',
      name: 'test',
      messages: [],
      loading: false,
      receivedMessages: false,
      existHistory: false
    }
  ]

  const res = action.enterRoom('test', rooms, socket as any)

  expect(socket.send.mock.calls.length).toBe(1)
  const [arg] = socket.send.mock.calls[0]
  expect(arg).toBe(
    JSON.stringify({
      cmd: 'rooms:enter',
      name: 'test'
    })
  )

  expect(res.type).toStrictEqual('change:room')
  if (res.type === 'change:room') {
    expect(res.payload.id).toStrictEqual('001')
  }
})

test('enterRoom does not enter', async () => {
  const socket = { send: jest.fn() }
  const rooms: Room[] = []

  const res = action.enterRoom('test', rooms, socket as any)

  expect(socket.send.mock.calls.length).toBe(1)
  const [arg] = socket.send.mock.calls[0]
  expect(arg).toBe(
    JSON.stringify({
      cmd: 'rooms:enter',
      name: 'test'
    })
  )

  expect(res.type).toStrictEqual('enter:room')
})
