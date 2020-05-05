import React, { useEffect } from 'react'
import { useDispatch } from 'react-redux'
import { getMyInfo, signup } from '../../modules/user'

const LoginSuccess = () => {
  const dispatch = useDispatch()

  useEffect(() => {
    getMyInfo()(dispatch).then((res) => {
      if (res.status === 404) {
        return res
          .json()
          .then((body: { id: string; twitter?: string; github?: string }) => {
            const account = body.twitter || body.github || ''
            dispatch(signup(account))
          })
      }
    })
  }, [dispatch])

  return <></>
}

export default LoginSuccess
