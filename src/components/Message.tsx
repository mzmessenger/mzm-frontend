import React from 'react'
import { useDispatch } from 'react-redux'
import dayjs from 'dayjs'
import styled from 'styled-components'
import CreateIcon from '@material-ui/icons/Create'
import sanitize from '../lib/sanitize'
import { startEdit } from '../modules/user.action'
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
    .actions {
      .icon {
        cursor: pointer;
        svg {
          font-size: 1rem;
        }
      }
    }
    time {
      margin-left: 16px;
      letter-spacing: 0;
    }
  }

  .body {
    grid-area: message-body;
  }

  .user-icon {
    grid-area: icon;
    margin: 5px 10px 0 0;
    width: 25px;
    height: 25px;
    border-radius: 2px;
  }
`

type Props = {
  id: string
  message: string
  html: string
  userId: string
  userAccount: string
  iconUrl: string
  createdAt: string
}

function Message({
  id,
  message,
  html,
  userId,
  userAccount,
  iconUrl,
  createdAt
}: Props) {
  const date = dayjs(new Date(createdAt)).format('YYYY/MM/DD HH:mm:ss')
  const account = userAccount ? userAccount : userId
  const dispatch = useDispatch()

  return (
    <MessageWrap>
      <img className="user-icon" src={iconUrl} />
      <div className="header">
        <div style={{ flex: 1 }}>{account}</div>
        <div className="actions">
          <div className="icon">
            <CreateIcon onClick={() => dispatch(startEdit(id, message))} />
          </div>
        </div>
        <time>{date}</time>
      </div>
      <MessageBody className="body" message={message} html={sanitize(html)} />
    </MessageWrap>
  )
}
export default Message
