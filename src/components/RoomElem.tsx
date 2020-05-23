import React from 'react'
import styled from 'styled-components'
import Home from '@material-ui/icons/Home'

type Props = {
  name: string
  iconUrl: string
  unread: number
  replied: number
  current: boolean
  onClick: (e: React.MouseEvent) => void
}

const RoomElem = ({
  name,
  iconUrl,
  unread,
  replied,
  current,
  onClick
}: Props) => {
  const className = current ? 'current' : ''
  const unreadClass = ['unread']
  if (unread > 0) {
    unreadClass.push('show')
    if (replied > 0) {
      unreadClass.push('replied')
    }
  }

  return (
    <RoomWrap className={className} onClick={onClick}>
      <div className="room-icon">
        {iconUrl ? <img src={iconUrl} /> : <Home />}
      </div>
      <div className="room-name">{name}</div>
      <div className={unreadClass.join(' ')}>{unread}</div>
    </RoomWrap>
  )
}
export default RoomElem

const RoomWrap = styled.div`
  padding: 4px 8px 0;
  &:last-child {
    padding-bottom: 4px;
  }
  display: flex;
  align-items: center;
  color: var(--color-on-surface);
  height: 34px;
  .room-icon {
    width: 32px;
    height: 32px;
    display: flex;
    justify-content: center;
    align-items: center;
    margin: 0 8px 0 0;
    img {
      max-height: 100%;
      max-width: 100%;
    }
  }
  .room-name {
    flex: 1;
  }
  &.current {
    background: var(--color-surface);
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
    &.replied {
      color: var(--color-on-replied);
      background: var(--color-replied);
    }
  }
`
