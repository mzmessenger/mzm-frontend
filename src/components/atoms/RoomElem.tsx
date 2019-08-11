import React from 'react'
import styled from 'styled-components'
import Home from '@material-ui/icons/Home'

const RoomWrap = styled.div`
  padding: 0 4px;
  display: flex;
  align-items: center;
  color: var(--color-on-surface);
  height: 34px;
  .room-name {
    font-size: 16px;
    line-height: 20px;
    flex: 1;
  }
  &.current {
    background: hsla(0, 100%, 100%, 0.1);
  }
  .unread {
    display: none;
    width: 24px;
    height: 24px;
    line-height: 24px;
    border-radius: 50%;
    background: rgb(255, 0, 0);
    color: hsla(0, 100%, 100%, 1);
    text-align: center;
    font-weight: bold;
    &.show {
      display: inline-block;
    }
  }
`

type Props = {
  name: string
  unread: number
  current: boolean
}

export default function RoomElem({ name, unread, current }: Props) {
  const className = current ? 'current' : ''
  const unreadClass = ['unread']
  if (unread > 0) {
    unreadClass.push('show')
  }

  return (
    <RoomWrap className={className}>
      <Home style={{ margin: '0 5px 0 0' }} />
      <div className="room-name">{name}</div>
      <div className={unreadClass.join(' ')}>{unread}</div>
    </RoomWrap>
  )
}
