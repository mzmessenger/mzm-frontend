import React from 'react'
import styled from 'styled-components'
import { connect } from 'react-redux'
import { Link } from 'react-router-dom'
import Home from '@material-ui/icons/Home'
import { State } from '../modules/index.types'
import * as actions from '../modules/index'

const RoomWrap = styled.div`
  display: flex;
  flex-direction: center;
  color: #8e9297;
  height: 34px;
  padding: 3px 8px 0;
  .room-name {
    font-size: 16px;
    line-height: 20px;
  }
`

const Room: React.FC<{ name: string }> = ({ name }) => {
  return (
    <RoomWrap>
      <Home style={{ margin: '0 5px 0 0' }} />
      <div className="room-name">{name}</div>
    </RoomWrap>
  )
}

const Rooms: React.FC<{
  rooms: State['rooms']
  setCurrentRooms: typeof actions.setCurrentRooms
}> = ({ rooms, setCurrentRooms }) => {
  return (
    <div style={{ padding: '5px 0' }}>
      {rooms.map(r => (
        <Link
          to={`/rooms/${r.name}`}
          key={r.id}
          style={{ textDecoration: 'none' }}
          onClick={() => setCurrentRooms(r.id)}
        >
          <Room name={r.name} />
        </Link>
      ))}
    </div>
  )
}

export default connect(
  (state: State) => ({ rooms: state.rooms }),
  {
    setCurrentRooms: actions.setCurrentRooms
  }
)(Rooms)