jest.mock('../lib/markdown', () => ({
  convertToHtml: jest.fn()
}))

import { SendSocketCmdEnum } from '../lib/util'
import * as action from './rooms.action'
import { Room, RoomActionEnum } from './rooms.types'
import { UIActionEnum } from './ui.types'

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
  expect(JSON.parse(arg).cmd).toStrictEqual(SendSocketCmdEnum.GetMessages)

  const [
    [getMessagesArg],
    [chaneRoomArgs],
    [menuCloseArgs]
  ] = dispatch.mock.calls
  expect(getMessagesArg.type).toStrictEqual(RoomActionEnum.GetMessages)
  expect(chaneRoomArgs.type).toStrictEqual(RoomActionEnum.ChangeRoom)
  expect(chaneRoomArgs.payload.id).toStrictEqual('001')

  expect(menuCloseArgs.type).toStrictEqual(UIActionEnum.CloseMenu)
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
      cmd: SendSocketCmdEnum.EnterRoom,
      name: 'test'
    })
  )

  const [args] = dispatch.mock.calls[0]
  expect(args.type).toStrictEqual(UIActionEnum.CloseMenu)
})
