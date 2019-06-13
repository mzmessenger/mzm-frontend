import React from 'react'
import dayjs from 'dayjs'
import styled from 'styled-components'

const MessageWrap = styled.div`
  padding: 10px 15px 10px;
  border-radius: 1px;
  background-color: hsl(0, 0%, 14%);
  color: #dcddde;
  display: grid;
  grid-template-columns: auto 1fr;
  grid-template-areas:
    'icon message-header'
    'icon message-body';
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

const Icon = styled.img`
  grid-area: icon;
  margin: 5px 10px 0 0;
  width: 25px;
  height: 25px;
  border-radius: 2px;
`

type Props = {
  message: string
  userId: string
  userAccount: string
  icon: string
  createdAt: string
}

export default function Message({
  message,
  userId,
  userAccount,
  icon,
  createdAt
}: Props) {
  const date = dayjs(new Date(createdAt)).format('YYYY/MM/DD HH:mm:ss')
  const account = userAccount ? userAccount : userId
  return (
    <MessageWrap>
      <Icon src={icon} />
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
