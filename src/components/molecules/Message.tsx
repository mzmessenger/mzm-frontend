import React from 'react'
import { useSelector, useDispatch } from 'react-redux'
import dayjs from 'dayjs'
import styled from 'styled-components'
import CreateIcon from '@material-ui/icons/Create'
import ThumbUpIcon from '@material-ui/icons/ThumbUp'
import { sanitize } from '../../lib/sanitize'
import { State, store } from '../../modules/index'
import { startEdit } from '../../modules/ui.action'
import { incrementIine } from '../../modules/socket.action'
import MessageBody from '../atoms/MessageBody'

const MessageWrap = styled.div`
  padding: 10px 15px 10px;
  border-radius: 1px;
  background-color: hsl(0, 0%, 14%);
  color: #dcddde;
  display: grid;
  grid-template-columns: 40px;
  grid-template-areas:
    'icon message-header'
    'icon message-body'
    'icon message-footer';

  .header,
  .user-icon {
    margin: 4px 0 0 0;
  }

  .header {
    grid-area: message-header;
    display: flex;
    .iine {
      display: flex;
      margin-left: 16px;
      flex: 1;
      .num {
        margin-left: 4px;
      }
    }
    .actions {
      visibility: hidden;
    }
    .icon {
      cursor: pointer;
      svg {
        font-size: 1rem;
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
    width: 25px;
    height: 25px;
    border-radius: 2px;
  }

  .footer {
    grid-area: message-footer;
    .updated {
      margin-top: 4px;
      font-size: 8px;
      color: hsla(0, 100%, 100%, 0.5);
    }
  }

  &:hover {
    .actions {
      visibility: visible;
    }
  }
`

type Props = {
  id: string
  message: string
  iine: number
  html: string
  userId: string
  userAccount: string
  iconUrl: string
  updated: boolean
  createdAt: string
}

function Message({
  id,
  message,
  iine,
  html,
  userId,
  userAccount,
  iconUrl,
  updated,
  createdAt
}: Props) {
  const day = dayjs(new Date(createdAt))
  const date = day.format(
    day.year() === new Date().getFullYear()
      ? 'MM/DD HH:mm:ss'
      : 'YYYY/MM/DD HH:mm:ss'
  )
  const account = userAccount ? userAccount : userId
  const myAccount = useSelector((state: State) => state.user.me.account)
  const dispatch = useDispatch()

  const iineEvent = () => {
    incrementIine(id)(dispatch, store.getState)
  }

  return (
    <MessageWrap>
      <img className="user-icon" src={iconUrl} />
      <div className="header">
        <div className="account">{account}</div>
        <div className="iine icon" onClick={() => iineEvent()}>
          <ThumbUpIcon />
          {iine !== 0 && <div className="num">{iine}</div>}
        </div>
        <div className="actions">
          <div className="icon">
            {myAccount === account && (
              <CreateIcon onClick={() => dispatch(startEdit(id, message))} />
            )}
          </div>
        </div>
        <time>{date}</time>
      </div>
      <MessageBody className="body" message={message} html={sanitize(html)} />
      <div className="footer">
        {updated && <div className="updated">(編集済み)</div>}
      </div>
    </MessageWrap>
  )
}
export default Message
