import React, { useMemo, useState } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import styled from 'styled-components'
import Home from '@material-ui/icons/Home'
import Person from '@material-ui/icons/Person'
import ExpandMore from '@material-ui/icons/ExpandMore'
import { openUserDetail } from '../modules/ui'
import { WIDTH_MOBILE } from '../lib/constants'
import { createIconUrl } from '../lib/util'
import { State } from '../modules/index'

const Wrap = styled.div`
  display: flex;
  min-height: var(--navi-height);
  padding: 0 16px;
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
        cursor: pointer;
        padding-left: 3px;
        width: 20px;
        height: 20px;
      }
    }
  }

  .expand-icon {
    display: flex;
    justify-content: center;
    align-items: center;
    transition-duration: 0.5s;

    &.expand {
      transform: rotate(180deg);
    }
  }

  .icon {
    cursor: pointer;
    color: var(--color-on-guide);
    margin: 0 8px 0;
  }

  @media (max-width: ${WIDTH_MOBILE}px) {
    padding: 0 8px;
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

export default function RoomInfo({
  onExpandClick,
  expand
}: {
  onExpandClick: () => void
  expand: boolean
}) {
  const id = useSelector((state: State) => state.rooms.currentRoomId)
  const name = useSelector((state: State) => state.rooms.currentRoomName) || ''
  const [count, setCount] = useState(0)
  const [users, setUsers] = useState([])
  const dispatch = useDispatch()

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

  const clickUser = user => {
    dispatch(openUserDetail(user.id, user.account))
  }

  const userIcons = users
    .slice(0, 10)
    .map((u, i) => (
      <img
        key={i}
        src={createIconUrl(u.account)}
        onClick={() => clickUser(u)}
      />
    ))

  const expandClassName = ['expand-icon']
  if (expand) {
    expandClassName.push('expand')
  }

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
      <div className={expandClassName.join(' ')} onClick={onExpandClick}>
        <ExpandMore className="icon" />
      </div>
    </Wrap>
  )
}
