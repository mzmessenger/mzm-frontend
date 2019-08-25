import { Dispatch } from 'redux'
import { createIconUrl } from '../lib/util'
import { UserAction, UserActionEnum } from './user.types'

export function signup(account: string) {
  return {
    type: UserActionEnum.Signup,
    payload: { account }
  }
}

export function getMyInfo() {
  return async function(dispatch: Dispatch<UserAction>) {
    const res = await fetch('/api/user/@me')
    if (res.status === 200) {
      const payload: { account: string; id: string } = await res.json()
      const iconUrl = payload.account ? createIconUrl(payload.account) : null
      dispatch({ type: UserActionEnum.SetMe, payload: { ...payload, iconUrl } })
    } else {
      dispatch({ type: UserActionEnum.Logout })
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
      dispatch({ type: UserActionEnum.Remove })
    }
    return res
  }
}

export function logout(): UserAction {
  return { type: UserActionEnum.Logout }
}
