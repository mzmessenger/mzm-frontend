import React from 'react'
import styled from 'styled-components'
import { useSelector, useDispatch } from 'react-redux'
import { withRouter, RouteComponentProps } from 'react-router-dom'
import { State, store } from '../modules/index'
import { Room } from '../modules/rooms.types'
import { readMessages } from '../modules/rooms.action'
import RoomElem from './atoms/RoomElem'

const Wrap = styled.div`
  padding: 5px 0;
  cursor: pointer;
  .link {
    padding: 4px;
  }
`

function Rooms({ history }: RouteComponentProps) {
  const rooms = useSelector((state: State) => state.rooms.rooms)
  const currentRoomName = useSelector(
    (state: State) => state.rooms.currentRoomName
  )
  const dispatch = useDispatch()

  function onClick(e: React.MouseEvent, room: Room) {
    e.preventDefault()
    history.push(`/rooms/${room.name}`)
    readMessages(room.id)(dispatch, store.getState)
  }

  return (
    <Wrap style={{ padding: '5px 0' }}>
      {rooms.map(r => (
        <div className="link" key={r.id} onClick={e => onClick(e, r)}>
          <RoomElem
            name={r.name}
            unread={r.unread}
            current={r.name === currentRoomName}
          />
        </div>
      ))}
    </Wrap>
  )
}

export default withRouter(Rooms)
