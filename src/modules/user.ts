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
    default:
      return state
  }
}
