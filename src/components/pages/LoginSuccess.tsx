import React, { useEffect } from 'react'
import { useDispatch } from 'react-redux'
import { getMyInfo, signup } from '../../modules/user.action'

function LoginSuccess() {
  const dispatch = useDispatch()

  useEffect(() => {
    getMyInfo()(dispatch).then(res => {
      if (res.status === 404) {
        return res.json().then((body: { id: string; twitter: string }) => {
          dispatch(signup(body.twitter))
        })
      }
    })
  }, [dispatch])

  return <></>
}

export default LoginSuccess
