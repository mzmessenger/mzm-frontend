import { isReplied } from './util'

test.each([
  ['koh110', '@koh110'],
  ['koh110', '@koh110 '],
  ['koh110', ' @koh110'],
  ['koh110', ' @koh110 ']
])('isReply (%s, %s)', (account, message) => {
  expect(isReplied(account, message)).toStrictEqual(true)
})

test.each([
  ['koh110', ' @koh110test'],
  ['koh110', 'test@koh110.com']
])('isReplied: is not reply (%s, %s)', (account, message) => {
  expect(isReplied(account, message)).toStrictEqual(false)
})
