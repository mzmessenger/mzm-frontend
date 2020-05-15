import React, { useMemo } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { useHistory } from 'react-router-dom'
import { store, State } from '../modules/index'
import { connect } from '../modules/socket'

type Props = {
  url: string
}

const Socket = ({ url }: Props) => {
  const history = useHistory()
  const login = useSelector((state: State) => state.user.login)
  const dispatch = useDispatch()

  useMemo(() => {
    if (login) {
      connect(url, history)(dispatch, store.getState)
    }
  }, [url, login])

  return <></>
}
export default Socket
