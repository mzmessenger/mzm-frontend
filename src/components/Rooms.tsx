import React, { useState, useCallback } from 'react'
import styled from 'styled-components'
import { useSelector, useDispatch } from 'react-redux'
import { useHistory } from 'react-router-dom'
import { State, store } from '../modules/index'
import { readMessages, changeRoom, changeRoomOrder } from '../modules/rooms'
import { Room } from '../modules/rooms.types'
import RoomElem from './RoomElem'

const DropZone = ({
  room,
  currentRoomId,
  onDrop,
  onClick
}: {
  room: Room
  currentRoomId: string
  onDrop: (e: React.DragEvent) => void
  onClick: (e: React.MouseEvent, room: Room) => void
}) => {
  const [isOver, setIsOver] = useState(false)

  const onDropWrap = (e: React.DragEvent) => {
    setIsOver(false)
    onDrop(e)
  }

  const onDragOver = (e: React.DragEvent) => {
    e.dataTransfer.dropEffect = 'move'
    setIsOver(true)
    event.preventDefault()
  }

  const onDragLeave = () => setIsOver(false)

  const onDragStart = (e: React.DragEvent, room: Room) => {
    e.dataTransfer.setData('text/plain', room.id)
  }

  const className = isOver ? 'dropzone over' : 'dropzone'

  return (
    <div
      onDrop={onDropWrap}
      onDragOver={onDragOver}
      onDragLeave={onDragLeave}
      className={className}
      draggable="true"
      onDragStart={(e) => onDragStart(e, room)}
      attr-room-id={room.id}
    >
      <RoomElem
        name={room.name}
        unread={room.unread}
        replied={room.replied}
        iconUrl={room.iconUrl}
        current={room.id === currentRoomId}
        onClick={(e) => onClick(e, room)}
      />
    </div>
  )
}

const Rooms = () => {
  const dispatch = useDispatch()
  const history = useHistory()
  const roomIds = useSelector((state: State) => state.rooms.rooms.allIds)
  const currentRoomId = useSelector((state: State) => state.rooms.currentRoomId)
  const rooms = useSelector((state: State) => state.rooms.rooms.byId)

  const onClick = useCallback((e: React.MouseEvent, room: Room) => {
    e.preventDefault()
    history.push(`/rooms/${room.name}`)
    changeRoom(room.id)(dispatch, store.getState)
    readMessages(room.id)(dispatch, store.getState)
  }, [])

  const onDrop = useCallback(
    (e: React.DragEvent) => {
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
    },
    [roomIds]
  )

  return (
    <Wrap>
      {roomIds.map((r) => (
        <DropZone
          key={r}
          room={rooms[r]}
          currentRoomId={currentRoomId}
          onDrop={onDrop}
          onClick={onClick}
        />
      ))}
    </Wrap>
  )
}
export default Rooms

const Wrap = styled.div`
  padding: 5px 0;
  cursor: pointer;

  .dropzone.over {
    box-shadow: inset 0 2px 2px rgba(255, 100, 100, 0.8);
  }
`
