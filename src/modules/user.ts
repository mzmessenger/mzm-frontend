import { UserState, UserAction } from './user.types'
import { WIDTH_MOBILE } from '../lib/constants'

export const initState: UserState = {
  signup: false,
  signupAccount: '',
  login: false,
  me: null,
  device: 'pc',
  menuStatus: 'close',
  overlay: false
}

export function reducer(
  state: UserState = initState,
  action: UserAction
): UserState {
  switch (action.type) {
    case 'onresize':
      return {
        ...state,
        device: action.payload.innerWidth <= WIDTH_MOBILE ? 'mobile' : 'pc'
      }
    case 'menu:open':
      return { ...state, menuStatus: 'open', overlay: true }
    case 'menu:close':
      return { ...state, menuStatus: 'close', overlay: false }
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
