import React from 'react'
import dayjs from 'dayjs'
import styled from 'styled-components'

const MessageWrap = styled.div`
  padding: 20px 15px 0;
  color: #dcddde;
  display: grid;
  grid-template-areas:
    'message-header'
    'message-body';
`

const MessageHeader = styled.div`
  grid-area: message-header;
  display: flex;
  time {
    letter-spacing: 0;
  }
`

const MessageBody = styled.div`
  grid-area: message-body;
  padding: 5px 0 0 0;
  p {
    font-size: 14px;
    line-height: 20px;
    margin: 0;
    white-space: pre-wrap;
  }
`

type Props = {
  message: string
  userId: string
  userAccount: string
  createdAt: string
}

export default function Message({
  message,
  userId,
  userAccount,
  createdAt
}: Props) {
  const date = dayjs(new Date(createdAt)).format('YYYY/MM/DD HH:mm:ss')
  const account = userAccount ? userAccount : userId
  return (
    <MessageWrap>
      <MessageHeader>
        <div style={{ flex: 1 }}>{account}</div>
        <time>{date}</time>
      </MessageHeader>
      <MessageBody>
        <p>{message}</p>
      </MessageBody>
    </MessageWrap>
  )
}
