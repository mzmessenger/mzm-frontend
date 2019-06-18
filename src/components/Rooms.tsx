import React from 'react'
import styled from 'styled-components'
import { useSelector, useDispatch } from 'react-redux'
import Home from '@material-ui/icons/Home'
import { State } from '../modules/index.types'
import { setCurrentRooms } from '../modules/index.action'
import Link from './atoms/Link'

const RoomWrap = styled.div`
  display: flex;
  flex-direction: center;
  color: #aaaaaa;
  height: 34px;
  padding: 3px 8px 0;
  .room-name {
    font-size: 16px;
    line-height: 20px;
  }
`

const Room: React.FC<{ name: string }> = ({ name }) => {
  return (
    <RoomWrap>
      <Home style={{ margin: '0 5px 0 0' }} />
      <div className="room-name">{name}</div>
    </RoomWrap>
  )
}

export default function Rooms() {
  const rooms = useSelector((state: State) => state.rooms)
  const dispatch = useDispatch()

  return (
    <div style={{ padding: '5px 0' }}>
      {rooms.map(r => (
        <Link
          to={`/rooms/${r.name}`}
          key={r.id}
          onClick={() => dispatch(setCurrentRooms(r.id))}
        >
          <Room name={r.name} />
        </Link>
      ))}
    </div>
  )
}
