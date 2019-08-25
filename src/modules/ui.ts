import { UIState, UIAction } from './ui.types'
import { WIDTH_MOBILE } from '../lib/constants'
import { createIconUrl } from '../lib/util'

export const initState: UIState = {
  device: 'pc',
  menuStatus: 'close',
  overlay: false,
  inputMode: 'normal',
  txt: '',
  editTxt: '',
  editId: null,
  openSettings: false,
  openUserDetail: false,
  userDetail: null
}

export function reducer(state: UIState = initState, action: UIAction): UIState {
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
    case 'input:txt':
      return { ...state, txt: action.payload.txt }
    case 'edit:start':
      return {
        ...state,
        inputMode: 'edit',
        editTxt: action.payload.txt,
        editId: action.payload.id
      }
    case 'edit:end':
      return { ...state, inputMode: 'normal', editTxt: '', editId: null }
    case 'modify:txt':
      return { ...state, editTxt: action.payload.txt }
    case 'open:settings':
      return { ...state, openSettings: true }
    case 'close:settings':
      return { ...state, openSettings: false }
    case 'open:userdetail':
      return {
        ...state,
        openUserDetail: true,
        userDetail: {
          id: action.payload.id,
          account: action.payload.account,
          icon: createIconUrl(action.payload.account)
        }
      }
    case 'close:userdetail':
      return { ...state, openUserDetail: false, userDetail: null }
    default:
      return state
  }
}
