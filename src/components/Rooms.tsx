import React from 'react'
import styled from 'styled-components'
import { useSelector } from 'react-redux'
import { withRouter, RouteComponentProps } from 'react-router-dom'
import Home from '@material-ui/icons/Home'
import { State } from '../modules/index'
import { Room } from '../modules/rooms.types'
import Link from './atoms/Link'

const RoomWrap = styled.div`
  display: flex;
  align-items: center;
  color: var(--color-on-surface);
  height: 34px;
  padding: 3px 8px 0;
  .room-name {
    font-size: 16px;
    line-height: 20px;
  }
`

const RoomElem: React.FC<{ name: string }> = ({ name }) => {
  return (
    <RoomWrap>
      <Home style={{ margin: '0 5px 0 0' }} />
      <div className="room-name">{name}</div>
    </RoomWrap>
  )
}

function Rooms({ history }: RouteComponentProps) {
  const rooms = useSelector((state: State) => state.rooms.rooms)

  function onClick(e: React.MouseEvent, room: Room) {
    e.preventDefault()
    history.push(`/rooms/${room.name}`)
  }

  return (
    <div style={{ padding: '5px 0' }}>
      {rooms.map(r => (
        <Link to={`/rooms/${r.name}`} key={r.id} onClick={e => onClick(e, r)}>
          <RoomElem name={r.name} />
        </Link>
      ))}
    </div>
  )
}

export default withRouter(Rooms)
