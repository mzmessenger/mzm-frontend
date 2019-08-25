import { UIState, UIAction, UIActionEnum } from './ui.types'
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
    case UIActionEnum.Onresize:
      return {
        ...state,
        device: action.payload.innerWidth <= WIDTH_MOBILE ? 'mobile' : 'pc'
      }
    case UIActionEnum.OpenMenu:
      return { ...state, menuStatus: 'open', overlay: true }
    case UIActionEnum.CloseMenu:
      return { ...state, menuStatus: 'close', overlay: false }
    case UIActionEnum.InputText:
      return { ...state, txt: action.payload.txt }
    case UIActionEnum.StartEditing:
      return {
        ...state,
        inputMode: 'edit',
        editTxt: action.payload.txt,
        editId: action.payload.id
      }
    case UIActionEnum.EndEditing:
      return { ...state, inputMode: 'normal', editTxt: '', editId: null }
    case UIActionEnum.ModifyText:
      return { ...state, editTxt: action.payload.txt }
    case UIActionEnum.OpenSettings:
      return { ...state, openSettings: true }
    case UIActionEnum.CloseSettings:
      return { ...state, openSettings: false }
    case UIActionEnum.OpenUserDetail:
      return {
        ...state,
        openUserDetail: true,
        userDetail: {
          id: action.payload.id,
          account: action.payload.account,
          icon: createIconUrl(action.payload.account)
        }
      }
    case UIActionEnum.CloseUserDetail:
      return { ...state, openUserDetail: false, userDetail: null }
    default:
      return state
  }
}
