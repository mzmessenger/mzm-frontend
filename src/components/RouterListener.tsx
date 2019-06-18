import React, { useMemo } from 'react'
import { withRouter, RouteComponentProps } from 'react-router-dom'
import { useSelector } from 'react-redux'
import { State } from '../modules/index.types'

function RouterListener({ history }: RouteComponentProps) {
  const currentRoomName = useSelector((state: State) => state.currentRoomName)

  useMemo(() => {
    if (currentRoomName === '') {
      history.push('/')
    }
  }, [currentRoomName])

  return <></>
}

export default withRouter(RouterListener)
