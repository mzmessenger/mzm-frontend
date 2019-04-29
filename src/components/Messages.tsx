import React from 'react'
import { connect } from 'react-redux'
import styled from 'styled-components'
import { State } from '../modules/index.types'

const Wrap = styled.div`
  padding: 0 10px 20px 0;
`

const MessageWrap = styled.div`
  padding: 20px 15px 0;
  color: #dcddde;
  display: grid;
  grid-template-areas:
    'message-header'
    'message-body';
`

const Time = styled.time`
  font-size: 0.75rem;
  letter-spacing: 0;
`

function Message({
  message,
  userId,
  userAccount,
  createdAt
}: {
  message: string
  userId: string
  userAccount: string
  createdAt: string
}) {
  const date = new Date(createdAt)
  const d = [date.getFullYear(), date.getMonth() + 1, date.getDate()].join('/')
  const t = `${date.getHours()}:${date.getMinutes()}:${date.getSeconds()}`
  const dateStr = `${d} ${t}`
  const account = userAccount ? userAccount : userId
  return (
    <MessageWrap>
      <header style={{ gridArea: 'message-header', display: 'flex' }}>
        <div style={{ flex: 1 }}>{account}</div>
        <Time>{dateStr}</Time>
      </header>
      <div style={{ gridArea: 'message-body', padding: '5px 0 0 0' }}>
        {message}
      </div>
    </MessageWrap>
  )
}

function Messages({ messages }: { messages: State['messages'] }) {
  return (
    <Wrap>
      {messages.map(m => {
        return (
          <Message
            key={m.id}
            userId={m.userId}
            userAccount={m.userAccount}
            message={m.message}
            createdAt={m.createdAt}
          />
        )
      })}
    </Wrap>
  )
}

export default connect(
  (state: State) => ({ messages: state.messages }),
  {}
)(Messages)
