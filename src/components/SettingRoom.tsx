import React from 'react'
import { useSelector, useDispatch } from 'react-redux'
import styled from 'styled-components'
import DirectionsRun from '@material-ui/icons/DirectionsRun'
import { State, store } from '../modules/index'
import { exitRoom } from '../modules/rooms'

export default function RoomSetting() {
  const dispatch = useDispatch()
  const id = useSelector((state: State) => state.rooms.currentRoomId)
  const name = useSelector((state: State) => state.rooms.currentRoomName) || ''

  const onClick = () => {
    exitRoom(id)(dispatch, store.getState)
  }

  return (
    <Wrap>
      <h2>部屋設定</h2>
      {name !== 'general' && (
        <div className="exit" onClick={onClick}>
          <DirectionsRun className="icon" />
          退室する
        </div>
      )}
    </Wrap>
  )
}

const Wrap = styled.div`
  padding: 8px 32px;
  color: var(--color-on-background);

  .icon {
    color: var(--color-on-guide);
  }

  .exit {
    cursor: pointer;
    display: flex;
    align-items: center;
    .icon {
      margin-right: 8px;
    }
  }
`
