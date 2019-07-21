import React from 'react'
import styled from 'styled-components'
import { useSelector, useDispatch } from 'react-redux'
import Home from '@material-ui/icons/Home'
import { State } from '../modules/index'
import { enterRoom } from '../modules/rooms.action'
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

export default function Rooms() {
  const rooms = useSelector((state: State) => state.rooms.rooms)
  const socket = useSelector((state: State) => state.socket.socket)
  const dispatch = useDispatch()

  function onClick(e: React.MouseEvent, room: Room) {
    e.preventDefault()
    dispatch(enterRoom(room.name, rooms, socket))
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
