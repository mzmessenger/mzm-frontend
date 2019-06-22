import React, { useCallback } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import styled from 'styled-components'
import Home from '@material-ui/icons/Home'
import DirectionsRun from '@material-ui/icons/DirectionsRun'
import { State } from '../modules/index.types'
import { exitRoom } from '../modules/index.action'

const Wrap = styled.div`
  display: flex;
  height: var(--navi-height);
  padding: 0 15px;
  align-items: center;
  background-color: var(--color-guide);
  .room-name {
    color: var(--color-on-guide);
    flex: 1;
    font-size: 18px;
    line-height: 30px;
  }
  .icon {
    color: var(--color-on-guide);
    margin: 0 15px 0 0;
  }
`

export default function RoomInfo() {
  const id = useSelector((state: State) => state.currentRoom)
  const name = useSelector((state: State) => state.currentRoomName) || ''

  const dispatch = useDispatch()

  // @todo create modal
  const onClick = useCallback(() => {
    exitRoom(id)(dispatch)
  }, [id, dispatch])

  return (
    <Wrap>
      <Home className="icon" fontSize="small" />
      <span style={{ flex: 1 }} className="room-name">
        {name}
      </span>
      <DirectionsRun
        style={{ cursor: 'pointer' }}
        className="icon"
        onClick={onClick}
      />
    </Wrap>
  )
}
