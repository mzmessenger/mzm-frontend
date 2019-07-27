import React, { useMemo, useState } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import styled from 'styled-components'
import Home from '@material-ui/icons/Home'
import Person from '@material-ui/icons/Person'
import DirectionsRun from '@material-ui/icons/DirectionsRun'
import { WIDTH_MOBILE } from '../lib/constants'
import { createIconUrl } from '../lib/util'
import { State } from '../modules/index'
import { exitRoom } from '../modules/rooms.action'

const Wrap = styled.div`
  display: flex;
  height: var(--navi-height);
  padding: 0 15px;
  align-items: center;
  background-color: var(--color-guide);
  color: var(--color-on-guide);

  .room-name {
    flex: 1;
    font-size: 18px;
    line-height: 30px;
  }

  .room-users {
    display: flex;
    align-items: center;
    .count {
      padding: 0 0 0 4px;
    }
    .users {
      min-width: 230px;
      padding: 0 8px;
      display: flex;
      img {
        padding-left: 3px;
        width: 20px;
        height: 20px;
      }
    }
  }

  .icon {
    color: var(--color-on-guide);
    margin: 0 8px 0;
  }

  @media (max-width: ${WIDTH_MOBILE}px) {
    .room-users {
      .users {
        display: none;
      }
    }
  }
`

async function getUsers(roomId: string) {
  if (!roomId) {
    return
  }
  const res = await fetch(`/api/rooms/${roomId}/users`, {
    method: 'GET',
    mode: 'cors',
    headers: {
      'Content-Type': 'application/json; charset=utf-8'
    }
  })
  return res
}

export default function RoomInfo() {
  const id = useSelector((state: State) => state.rooms.currentRoomId)
  const name = useSelector((state: State) => state.rooms.currentRoomName) || ''
  const socket = useSelector((state: State) => state.socket.socket)
  const [count, setCount] = useState(0)
  const [users, setUsers] = useState([])

  const dispatch = useDispatch()

  // @todo create modal
  const onClick = () => {
    exitRoom(id)(dispatch, socket)
  }

  useMemo(() => {
    if (id) {
      getUsers(id).then(res => {
        if (res.status === 200) {
          res.json().then(body => {
            setCount(body.count)
            setUsers(body.users)
          })
        }
      })
    }
  }, [id])

  const userIcons = users
    .slice(0, 10)
    .map((u, i) => <img key={i} src={createIconUrl(u.account)} />)

  return (
    <Wrap>
      <Home className="icon" fontSize="small" />
      <span style={{ flex: 1 }} className="room-name">
        {name}
      </span>
      <div className="room-users">
        <Person />
        <div className="count">{count}</div>
        <div className="users">{userIcons}</div>
      </div>
      <DirectionsRun
        style={{ cursor: 'pointer' }}
        className="icon"
        onClick={onClick}
      />
    </Wrap>
  )
}
