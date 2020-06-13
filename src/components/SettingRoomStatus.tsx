import React from 'react'
import { useSelector, useDispatch } from 'react-redux'
import styled from 'styled-components'
import { State, store } from '../modules/index'
import { setRoomStatus } from '../modules/rooms'
import { openRoom, closeRoom } from '../modules/socket'
import CheckIcon from '@material-ui/icons/Check'

const RoomSettingStatus = () => {
  const dispatch = useDispatch()
  const id = useSelector((state: State) => state.rooms.currentRoomId)
  const room = useSelector((state: State) => state.rooms.rooms.byId[id])

  const status = room?.status

  const clickOpen = () => {
    openRoom(id)(dispatch, store.getState)
    dispatch(setRoomStatus(id, 'open'))
  }

  const clickClose = () => {
    closeRoom(id)(dispatch, store.getState)
    dispatch(setRoomStatus(id, 'close'))
  }

  return (
    <Wrap>
      <h4>公開設定</h4>
      <ul>
        <li>
          <div
            className={status === 'open' ? 'active' : ''}
            onClick={clickOpen}
          >
            <CheckIcon />
            公開
          </div>
        </li>
        <li>
          <div
            className={status === 'close' ? 'active' : ''}
            onClick={clickClose}
          >
            <CheckIcon />
            非公開
          </div>
        </li>
      </ul>
    </Wrap>
  )
}
export default RoomSettingStatus

const Wrap = styled.div`
  margin-top: 16px;

  > ul {
    list-style-type: none;
    margin: 0;
    padding: 0;
    > li {
      > div {
        display: flex;
        align-items: center;
        cursor: pointer;
      }
      padding-left: 0;
      margin: 1em 0;
    }
  }
  svg {
    opacity: 0;
    margin: 0 0.5em 0 0;
    color: #50e9a3;
  }
  .active {
    svg {
      opacity: 1;
    }
  }
`
