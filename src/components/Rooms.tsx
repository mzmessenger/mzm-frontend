import React from 'react'
import { useSelector } from 'react-redux'
import { withRouter, RouteComponentProps } from 'react-router-dom'
import { State } from '../modules/index'
import { Room } from '../modules/rooms.types'
import Link from './atoms/Link'
import RoomElem from './atoms/RoomElem'

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
            <RoomElem
              name={r.name}
              unread={r.unread}
              current={r.name === currentRoomName}
            />
          </div>
        </Link>
      ))}
    </div>
  )
}

export default withRouter(Rooms)
