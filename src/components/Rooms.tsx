import React from 'react'
import styled from 'styled-components'
import { useSelector, useDispatch } from 'react-redux'
import { useHistory } from 'react-router-dom'
import { State, store } from '../modules/index'
import { readMessages, changeRoom } from '../modules/rooms'
import { Room } from '../modules/rooms.types'
import RoomElem from './atoms/RoomElem'

const RoomContainer = ({
  room,
  currentRoomId
}: {
  room: Room
  currentRoomId: string
}) => {
  const history = useHistory()
  const dispatch = useDispatch()

  const onClick = (e: React.MouseEvent) => {
    e.preventDefault()
    history.push(`/rooms/${room.name}`)
    changeRoom(room.id)(dispatch, store.getState)
    readMessages(room.id)(dispatch, store.getState)
  }

  return (
    <div className="link" onClick={(e) => onClick(e)}>
      <RoomElem
        name={room.name}
        unread={room.unread}
        iconUrl={room.iconUrl}
        current={room.id === currentRoomId}
      />
    </div>
  )
}

export default function Rooms() {
  const roomIds = useSelector((state: State) => state.rooms.rooms.allIds)
  const currentRoomId = useSelector((state: State) => state.rooms.currentRoomId)
  const rooms = useSelector((state: State) => state.rooms.rooms.byId)

  return (
    <Wrap style={{ padding: '5px 0' }}>
      {roomIds.map((r) => (
        <RoomContainer key={r} room={rooms[r]} currentRoomId={currentRoomId} />
      ))}
    </Wrap>
  )
}
const Wrap = styled.div`
  padding: 5px 0;
  cursor: pointer;
`
