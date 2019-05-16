import React from 'react'
import { connect } from 'react-redux'
import styled from 'styled-components'
import { State } from '../modules/index.types'
import Home from '@material-ui/icons/Home'

const Wrap = styled.div`
  display: flex;
  padding: 10px 15px;
  flex-direction: center;
  background: #2f3136;
  .room-name {
    font-size: 22px;
    line-height: 30px;
    color: #ffffff;
  }
`

function RoomInfo({
  currentRoomName
}: {
  currentRoomName: State['currentRoomName']
}) {
  const name = currentRoomName ? currentRoomName : ''
  return (
    <Wrap>
      <Home
        style={{ color: '#ffffff', marginRight: '15px' }}
        fontSize="large"
      />
      <span className="room-name">{name}</span>
    </Wrap>
  )
}

export default connect(
  (state: State) => ({
    currentRoomName: state.currentRoomName
  }),
  {}
)(RoomInfo)
