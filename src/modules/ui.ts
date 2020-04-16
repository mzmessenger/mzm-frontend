import { UIState, UIAction, UIActions } from './ui.types'
import { WIDTH_MOBILE } from '../lib/constants'

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

export const reducer = (
  state: UIState = initState,
  action: UIAction
): UIState => {
  switch (action.type) {
    case UIActions.Onresize:
      return {
        ...state,
        device: action.payload.innerWidth <= WIDTH_MOBILE ? 'mobile' : 'pc'
      }
    case UIActions.OpenMenu:
      return { ...state, menuStatus: 'open', overlay: true }
    case UIActions.CloseMenu:
      return { ...state, menuStatus: 'close', overlay: false }
    case UIActions.InputText:
      return { ...state, txt: action.payload.txt }
    case UIActions.StartEditing:
      return {
        ...state,
        inputMode: 'edit',
        editTxt: action.payload.txt,
        editId: action.payload.id
      }
    case UIActions.EndEditing:
      return { ...state, inputMode: 'normal', editTxt: '', editId: null }
    case UIActions.ModifyText:
      return { ...state, editTxt: action.payload.txt }
    case UIActions.OpenSettings:
      return { ...state, openSettings: true }
    case UIActions.CloseSettings:
      return { ...state, openSettings: false }
    case UIActions.OpenUserDetail:
      return {
        ...state,
        openUserDetail: true,
        userDetail: {
          id: action.payload.id,
          account: action.payload.account,
          icon: action.payload.icon
        }
      }
    case UIActions.CloseUserDetail:
      return { ...state, openUserDetail: false, userDetail: null }
    default:
      return state
  }
}

export const onResize = (innerWidth: number, innerHeight: number): UIAction => {
  return { type: UIActions.Onresize, payload: { innerWidth, innerHeight } }
}

export const openMenu = (): UIAction => {
  return { type: UIActions.OpenMenu }
}

export const closeMenu = (): UIAction => {
  return { type: UIActions.CloseMenu }
}

export const startToEdit = (messageId: string, txt: string): UIAction => {
  return { type: UIActions.StartEditing, payload: { id: messageId, txt } }
}

export const endToEdit = (): UIAction => {
  return { type: UIActions.EndEditing }
}

export const modifyMessage = (txt: string): UIAction => {
  return { type: UIActions.ModifyText, payload: { txt } }
}

export const inputMessage = (txt: string): UIAction => {
  return { type: UIActions.InputText, payload: { txt } }
}

export const openSettings = (): UIAction => {
  return { type: UIActions.OpenSettings }
}

export const closeSettings = (): UIAction => {
  return { type: UIActions.CloseSettings }
}

export const openUserDetail = (
  id: string,
  account: string,
  icon: string
): UIAction => {
  return { type: UIActions.OpenUserDetail, payload: { id, account, icon } }
}

export const closeUserDetail = (): UIAction => {
  return { type: UIActions.CloseUserDetail }
}
