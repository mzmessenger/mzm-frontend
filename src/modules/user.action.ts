import { Dispatch } from 'redux'
import { createIconUrl } from '../lib/util'
import { UserAction } from './user.types'

export function getMyInfo() {
  return async function(dispatch: Dispatch<UserAction>) {
    const res = await fetch('/api/user/@me')
    if (res.status === 200) {
      const payload: { account: string; id: string } = await res.json()
      const iconUrl = payload.account ? createIconUrl(payload.account) : null
      dispatch({ type: 'me:set', payload: { ...payload, iconUrl } })
    } else {
      dispatch({ type: 'logout' })
    }
    return res
  }
}

export function removeUser() {
  return async function(dispatch: Dispatch<UserAction>) {
    const res = await fetch('/auth/user', {
      method: 'DELETE',
      mode: 'cors',
      headers: {
        'Content-Type': 'application/json; charset=utf-8'
      }
    })
    if (res.status === 200) {
      dispatch({ type: 'remove:user' })
    }
    return res
  }
}

export function logout() {
  return { type: 'logout' }
}
