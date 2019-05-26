import React, { useCallback } from 'react'
import { connect } from 'react-redux'
import styled from 'styled-components'
import { State } from '../modules/index.types'
import * as actions from '../modules/index'
import Home from '@material-ui/icons/Home'
import DirectionsRun from '@material-ui/icons/DirectionsRun'

const Wrap = styled.div`
  display: flex;
  padding: 10px 15px;
  align-items: center;
  background: #2f3136;
  .room-name {
    font-size: 22px;
    line-height: 30px;
    color: #ffffff;
  }
  .icon {
    color: #ffffff;
  }
`

type Props = ReturnType<typeof mapStateToProps> &
  ReturnType<typeof mapDispatchToProps>

const RoomInfo: React.FC<Props> = ({ id, name, exitRoom }) => {
  name = name ? name : ''
  // @todo create modal
  const onClick = useCallback(() => {
    exitRoom(id)
  }, [id])

  return (
    <Wrap>
      <Home style={{ marginRight: '15px' }} className="icon" fontSize="large" />
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

function mapStateToProps(state: State) {
  return {
    id: state.currentRoom,
    name: state.currentRoomName
  }
}

function mapDispatchToProps(dispatch) {
  return {
    exitRoom: (roomId: string) => actions.exitRoom(roomId)(dispatch)
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(RoomInfo)
