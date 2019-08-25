import { UserState, UserAction } from './user.types'

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
    case 'signup': {
      return {
        ...initState,
        signup: true,
        signupAccount: action.payload.account
      }
    }
    case 'logout':
    case 'remove:user':
      return { ...initState, login: false }
    case 'me:set':
      return { ...state, login: true, me: action.payload }
    default:
      return state
  }
}
