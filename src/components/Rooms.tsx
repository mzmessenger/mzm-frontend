import React from 'react'
import styled from 'styled-components'
import { useSelector, useDispatch } from 'react-redux'
import { useHistory } from 'react-router-dom'
import { State, store } from '../modules/index'
import { readMessages } from '../modules/rooms'
import RoomElem from './atoms/RoomElem'

const Wrap = styled.div`
  padding: 5px 0;
  cursor: pointer;
  .link {
    padding: 4px;
  }
`

function RoomContainer({
  id,
  currentRoomName
}: {
  id: string
  currentRoomName: string
}) {
  const history = useHistory()
  const dispatch = useDispatch()
  const room = useSelector((state: State) => state.rooms.rooms.byId[id])

  function onClick(e: React.MouseEvent) {
    e.preventDefault()
    history.push(`/rooms/${room.name}`)
    readMessages(room.id)(dispatch, store.getState)
  }

  return (
    <div className="link" onClick={e => onClick(e)}>
      <RoomElem
        name={room.name}
        unread={room.unread}
        current={room.name === currentRoomName}
      />
    </div>
  )
}

export default function Rooms() {
  const roomIds = useSelector((state: State) => state.rooms.rooms.allIds)
  const currentRoomName = useSelector(
    (state: State) => state.rooms.currentRoomName
  )

  return (
    <Wrap style={{ padding: '5px 0' }}>
      {roomIds.map(r => (
        <RoomContainer key={r} id={r} currentRoomName={currentRoomName} />
      ))}
    </Wrap>
  )
}
