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
`

const RoomName = styled.div`
  font-size: 16px;
  line-height: 20px;
`

const Room = ({ name }: { name: string }) => {
  return (
    <RoomWrap>
      <Home style={{ margin: '0 5px 0 0' }} />
      <RoomName>{name}</RoomName>
    </RoomWrap>
  )
}

const Wrap = styled.div`
  padding: 5px 0;
`

function Rooms({
  rooms,
  setCurrentRooms
}: {
  rooms: State['rooms']
  setCurrentRooms: typeof actions.setCurrentRooms
}) {
  return (
    <Wrap>
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
    </Wrap>
  )
}

export default connect(
  (state: State) => ({ rooms: state.rooms }),
  {
    setCurrentRooms: actions.setCurrentRooms
  }
)(Rooms)
