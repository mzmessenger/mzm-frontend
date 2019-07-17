import React from 'react'
import dayjs from 'dayjs'
import styled from 'styled-components'
import MessageBody from './MessageBody'

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

  .header {
    grid-area: message-header;
    display: flex;
    time {
      letter-spacing: 0;
    }
  }

  .body {
    grid-area: message-body;
  }

  .icon {
    grid-area: icon;
    margin: 5px 10px 0 0;
    width: 25px;
    height: 25px;
    border-radius: 2px;
  }
`

type Props = {
  message: string
  html: string
  userId: string
  userAccount: string
  iconUrl: string
  createdAt: string
}

function Message({
  message,
  html,
  userId,
  userAccount,
  iconUrl,
  createdAt
}: Props) {
  const date = dayjs(new Date(createdAt)).format('YYYY/MM/DD HH:mm:ss')
  const account = userAccount ? userAccount : userId

  return (
    <MessageWrap>
      <img className="icon" src={iconUrl} />
      <div className="header">
        <div style={{ flex: 1 }}>{account}</div>
        <time>{date}</time>
      </div>
      <MessageBody className="body" message={message} html={html} />
    </MessageWrap>
  )
}
export default Message
