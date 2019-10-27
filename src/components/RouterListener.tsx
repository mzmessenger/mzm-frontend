import React, { useEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { useHistory } from 'react-router-dom'
import { State, store } from '../modules/index'
import { getMyInfo } from '../modules/user'
import { enterRoom } from '../modules/rooms'

export default function RouterListener() {
  const history = useHistory()
  const currentRoomName = useSelector(
    (state: State) => state.rooms.currentRoomName
  )
  const login = useSelector((state: State) => state.user.login)
  const signup = useSelector((state: State) => state.user.signup)
  const dispatch = useDispatch()

  useEffect(() => {
    if (login && currentRoomName === '') {
      history.push('/')
    }
  }, [login, currentRoomName])

  useEffect(() => {
    const room = history.location.pathname.match(/\/rooms\/(.+)/) && RegExp.$1
    if (!login && (history.location.pathname === '/' || room)) {
      getMyInfo()(dispatch)
    }

    if (login && room) {
      enterRoom(history.location.pathname.split('/')[2])(
        dispatch,
        store.getState
      )
    }

    if (room) {
      document.title = `MZM (${room})`
    } else {
      document.title = `MZM`
    }
  }, [login, history.location.pathname])

  useEffect(() => {
    if (signup) {
      history.push('/signup')
    }
  }, [signup])

  return <></>
}
