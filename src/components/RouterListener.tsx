import React, { useMemo } from 'react'
import { withRouter, RouteComponentProps } from 'react-router-dom'
import { connect } from 'react-redux'
import { State } from '../modules/index.types'

type Props = ReturnType<typeof mapStateToProps> & RouteComponentProps

const RouterListener: React.FC<Props> = ({ history, currentRoomName }) => {
  useMemo(() => {
    if (currentRoomName === '') {
      history.push('/')
    }
  }, [currentRoomName])

  return <></>
}

function mapStateToProps(state: State) {
  return {
    currentRoomName: state.currentRoomName
  }
}

export default withRouter(connect(mapStateToProps)(RouterListener))
