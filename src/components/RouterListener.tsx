import React, { useEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { withRouter, RouteComponentProps } from 'react-router-dom'
import { getMyInfo } from '../modules/index.action'
import { State } from '../modules/index.types'

function RouterListener({ history }: RouteComponentProps) {
  const currentRoomName = useSelector((state: State) => state.currentRoomName)
  const login = useSelector((state: State) => state.login)
  const signup = useSelector((state: State) => state.signup)
  const dispatch = useDispatch()

  useEffect(() => {
    if (login && currentRoomName === '') {
      history.push('/')
    }
  }, [login, currentRoomName])

  useEffect(() => {
    if (
      !login &&
      (history.location.pathname === '/' ||
        /\/(rooms(\/+?))/.test(history.location.pathname))
    ) {
      getMyInfo()(dispatch)
    }
  }, [login, history.location.pathname])

  useEffect(() => {
    if (signup) {
      history.push('/signup')
    }
  }, [signup])

  return <></>
}

export default withRouter(RouterListener)
