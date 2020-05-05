import React, { useEffect, useState } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import styled from 'styled-components'
import Home from '@material-ui/icons/Home'
import Person from '@material-ui/icons/Person'
import ExpandMore from '@material-ui/icons/ExpandMore'
import { State } from '../modules/index'
import { openUserDetail } from '../modules/ui'
import { toggleRoomSetting } from '../modules/rooms'
import { WIDTH_MOBILE } from '../lib/constants'

const getUsers = async (roomId: string) => {
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

const RoomIcon = ({ iconUrl }: { iconUrl: string }) => {
  return iconUrl ? <img src={iconUrl} /> : <Home fontSize="small" />
}

const RoomInfo = () => {
  const id = useSelector((state: State) => state.rooms.currentRoomId)
  const _name = useSelector((state: State) => state.rooms.currentRoomName)
  const iconUrl = useSelector((state: State) => state.rooms.currentRoomIcon)
  const expand = useSelector((state: State) => state.rooms.openRoomSetting)
  const [count, setCount] = useState(0)
  const [users, setUsers] = useState([])
  const dispatch = useDispatch()

  const name = _name || ''

  useEffect(() => {
    if (id) {
      getUsers(id).then((res) => {
        if (res.status === 200) {
          res.json().then((body) => {
            setCount(body.count)
            setUsers(body.users)
          })
        }
      })
    }
  }, [id])

  const clickUser = (user) => {
    dispatch(openUserDetail(user.id, user.account, user.icon))
  }

  const userIcons = users
    .slice(0, 10)
    .map((u, i) => <img key={i} src={u.icon} onClick={() => clickUser(u)} />)

  const expandClassName = ['expand-icon']
  if (expand) {
    expandClassName.push('expand')
  }

  const onExpandClick = () => {
    dispatch(toggleRoomSetting())
  }

  return (
    <Wrap>
      <div className="room-icon">
        <RoomIcon iconUrl={iconUrl} />
      </div>
      <span className="room-name">{name}</span>
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
export default RoomInfo

const Wrap = styled.div`
  display: flex;
  min-height: var(--navi-height);
  padding: 0 16px;
  align-items: center;
  color: var(--color-on-guide);
  border-bottom: 1px solid var(--color-border);

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

    .icon {
      cursor: pointer;
      color: var(--color-on-guide);
      margin: 0 8px 0;
    }
  }

  .room-icon {
    cursor: pointer;
    color: var(--color-on-guide);
    margin: 0 8px 0;
    img {
      width: 20px;
      height: 20px;
    }
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
