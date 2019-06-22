import React, { useEffect } from 'react'
import { withRouter, RouteComponentProps } from 'react-router-dom'
import { useSelector } from 'react-redux'
import { State } from '../modules/index.types'

function RouterListener({ history }: RouteComponentProps) {
  const currentRoomName = useSelector((state: State) => state.currentRoomName)
  const login = useSelector((state: State) => state.login)
  const signup = useSelector((state: State) => state.signup)

  useEffect(() => {
    if (login && currentRoomName === '') {
      history.push('/')
    }
  }, [login, currentRoomName])

  useEffect(() => {
    if (signup) {
      history.push('/signup')
    }
  }, [signup])

  return <></>
}

export default withRouter(RouterListener)
