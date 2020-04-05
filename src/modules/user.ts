import { Dispatch } from 'redux'
import { UserState, UserAction, UserActionEnum } from './user.types'

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
    case UserActionEnum.SetIcon: {
      const iconUrl = `/api/icon/user/${state.me.account}/${action.payload.version}`
      return { ...state, me: { ...state.me, iconUrl } }
    }
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
  return async function (dispatch: Dispatch<UserAction>) {
    const res = await fetch('/api/user/@me', { credentials: 'include' })
    if (res.status === 200) {
      const payload: {
        account: string
        id: string
        icon: string
      } = await res.json()
      dispatch({
        type: UserActionEnum.SetMe,
        payload: { ...payload, iconUrl: payload.icon }
      })
    } else if (res.status === 403) {
      dispatch({ type: UserActionEnum.Logout })
    }
    return res
  }
}

export function removeUser() {
  return async function (dispatch: Dispatch<UserAction>) {
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

export const uploadIcon = (blob: Blob) => {
  return async (dispatch: Dispatch<UserAction>) => {
    const formData = new FormData()
    formData.append('icon', blob)
    const res = await fetch('/api/icon/user', {
      method: 'POST',
      body: formData,
      credentials: 'include'
    })

    if (res.ok) {
      const { version } = await res.json()
      dispatch({ type: UserActionEnum.SetIcon, payload: { version } })
    }

    return res
  }
}
