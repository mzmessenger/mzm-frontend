import { Dispatch } from 'redux'
import { State } from './index'
import { UserState, UserAction, UserActions } from './user.types'

export const initState: UserState = {
  signup: false,
  signupAccount: '',
  login: false,
  me: null
}

export const reducer = (
  state: UserState = initState,
  action: UserAction
): UserState => {
  switch (action.type) {
    case UserActions.Signup: {
      return {
        ...initState,
        signup: true,
        signupAccount: action.payload.account
      }
    }
    case UserActions.Logout: {
      location.href = '/auth/logout'
      return { ...state, login: false }
    }
    case UserActions.Remove:
      return { ...initState, login: false }
    case UserActions.SetMe:
      return { ...state, login: true, me: action.payload }
    case UserActions.SetIcon: {
      const iconUrl = `/api/icon/user/${state.me.account}/${action.payload.version}`
      return { ...state, me: { ...state.me, iconUrl } }
    }
    default:
      return state
  }
}

export const signup = (account: string) => {
  return {
    type: UserActions.Signup,
    payload: { account }
  }
}

export const getMyInfo = () => {
  return async (dispatch: Dispatch<UserAction>) => {
    const res = await fetch('/api/user/@me', { credentials: 'include' })
    if (res.status === 200) {
      const payload: {
        account: string
        id: string
        icon: string
        twitterUserName: string | null
        githubUserName: string | null
      } = await res.json()
      dispatch({
        type: UserActions.SetMe,
        payload: { ...payload, iconUrl: payload.icon }
      })
    } else if (res.status === 403) {
      dispatch({ type: UserActions.Logout })
    }
    return res
  }
}

export const removeTwitter = () => {
  return async (dispatch: Dispatch<UserAction>, getState: () => State) => {
    const { twitterUserName, githubUserName } = getState().user.me
    if (!twitterUserName || !githubUserName) {
      return
    }
    const res = await fetch('/auth/twitter', {
      method: 'DELETE',
      mode: 'cors',
      headers: {
        'Content-Type': 'application/json; charset=utf-8'
      }
    })
    if (res.status === 200) {
      getMyInfo()(dispatch)
    }
    return res
  }
}

export const removeGithub = () => {
  return async (dispatch: Dispatch<UserAction>, getState: () => State) => {
    const { twitterUserName, githubUserName } = getState().user.me
    if (!twitterUserName || !githubUserName) {
      return
    }
    const res = await fetch('/auth/github', {
      method: 'DELETE',
      mode: 'cors',
      headers: {
        'Content-Type': 'application/json; charset=utf-8'
      }
    })
    if (res.status === 200) {
      getMyInfo()(dispatch)
    }
    return res
  }
}

export const removeUser = () => {
  return async (dispatch: Dispatch<UserAction>) => {
    const res = await fetch('/auth/user', {
      method: 'DELETE',
      mode: 'cors',
      headers: {
        'Content-Type': 'application/json; charset=utf-8'
      }
    })
    if (res.status === 200) {
      dispatch({ type: UserActions.Remove })
    }
    return res
  }
}

export const logout = (): UserAction => {
  return { type: UserActions.Logout }
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
      dispatch({ type: UserActions.SetIcon, payload: { version } })
    }

    return res
  }
}
