import React from 'react'
import styled from 'styled-components'
import { useSelector } from 'react-redux'
import { withRouter, RouteComponentProps } from 'react-router-dom'
import Home from '@material-ui/icons/Home'
import { State } from '../modules/index'
import { Room } from '../modules/rooms.types'
import Link from './atoms/Link'

const RoomWrap = styled.div`
  padding: 0 4px;
  display: flex;
  align-items: center;
  color: var(--color-on-surface);
  height: 34px;
  .room-name {
    font-size: 16px;
    line-height: 20px;
  }
  &.current {
    background: hsla(0, 100%, 100%, 0.1);
  }
`

const RoomElem: React.FC<{ name: string; current: boolean }> = ({
  name,
  current
}) => {
  const className = current ? 'current' : ''
  return (
    <RoomWrap className={className}>
      <Home style={{ margin: '0 5px 0 0' }} />
      <div className="room-name">{name}</div>
    </RoomWrap>
  )
}

function Rooms({ history }: RouteComponentProps) {
  const rooms = useSelector((state: State) => state.rooms.rooms)
  const currentRoomName = useSelector(
    (state: State) => state.rooms.currentRoomName
  )

  function onClick(e: React.MouseEvent, room: Room) {
    e.preventDefault()
    history.push(`/rooms/${room.name}`)
  }

  return (
    <div style={{ padding: '5px 0' }}>
      {rooms.map(r => (
        <Link to={`/rooms/${r.name}`} key={r.id} onClick={e => onClick(e, r)}>
          <div style={{ padding: '4px' }}>
            <RoomElem name={r.name} current={r.name === currentRoomName} />
          </div>
        </Link>
      ))}
    </div>
  )
}

export default withRouter(Rooms)
