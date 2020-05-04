import React from 'react'
import styled from 'styled-components'
import { useSelector, useDispatch } from 'react-redux'
import { useHistory } from 'react-router-dom'
import { State, store } from '../modules/index'
import { readMessages, changeRoom, changeRoomOrder } from '../modules/rooms'
import { Room } from '../modules/rooms.types'
import RoomElem from './atoms/RoomElem'

export default function Rooms() {
  const dispatch = useDispatch()
  const history = useHistory()
  const roomIds = useSelector((state: State) => state.rooms.rooms.allIds)
  const currentRoomId = useSelector((state: State) => state.rooms.currentRoomId)
  const rooms = useSelector((state: State) => state.rooms.rooms.byId)

  const onClick = (e: React.MouseEvent, room: Room) => {
    e.preventDefault()
    history.push(`/rooms/${room.name}`)
    changeRoom(room.id)(dispatch, store.getState)
    readMessages(room.id)(dispatch, store.getState)
  }

  const onDrop = (e: React.DragEvent) => {
    e.preventDefault()

    const moveId = e.dataTransfer.getData('text')
    const roomOrder = [
      ...roomIds.filter((e, i) => i !== roomIds.indexOf(moveId))
    ]
    roomOrder.splice(
      roomIds.indexOf(e.currentTarget.getAttribute('attr-room-id')),
      0,
      moveId
    )

    changeRoomOrder(roomOrder)(dispatch, store.getState)

    e.dataTransfer.clearData()
  }

  const onDragOver = (e: React.DragEvent) => {
    e.dataTransfer.dropEffect = 'move'
    event.preventDefault()
  }

  const onDragStart = (e: React.DragEvent, room: Room) => {
    e.dataTransfer.setData('text/plain', room.id)
  }

  return (
    <Wrap>
      {roomIds.map((r) => (
        <div
          onDrop={onDrop}
          onDragOver={onDragOver}
          className="dropzone"
          key={r}
          draggable="true"
          onDragStart={(e) => onDragStart(e, rooms[r])}
          attr-room-id={r}
        >
          <RoomElem
            name={rooms[r].name}
            unread={rooms[r].unread}
            iconUrl={rooms[r].iconUrl}
            current={rooms[r].id === currentRoomId}
            onClick={(e) => onClick(e, rooms[r])}
          />
        </div>
      ))}
    </Wrap>
  )
}
const Wrap = styled.div`
  padding: 5px 0;
  cursor: pointer;
`
