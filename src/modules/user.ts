import { Dispatch } from 'redux'
import { UserState, UserAction, UserActionEnum } from './user.types'
import { createIconUrl } from '../lib/util'

export const initState: UserState = {
  signup: false,
  signupAccount: '',
  login: false,
  me: null
}

export function reducer(
  state: UserState = initState,
  action: UserAction
): UserState {
  switch (action.type) {
    case UserActionEnum.Signup: {
      return {
        ...initState,
        signup: true,
        signupAccount: action.payload.account
      }
    }
    case UserActionEnum.Logout:
    case UserActionEnum.Remove:
      return { ...initState, login: false }
    case UserActionEnum.SetMe:
      return { ...state, login: true, me: action.payload }
    default:
      return state
  }
}

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
