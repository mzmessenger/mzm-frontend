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

export function onResize(innerWidth: number, innerHeight: number): UIAction {
  return { type: UIActionEnum.Onresize, payload: { innerWidth, innerHeight } }
}

export function openMenu(): UIAction {
  return { type: UIActionEnum.OpenMenu }
}

export function closeMenu(): UIAction {
  return { type: UIActionEnum.CloseMenu }
}

export function startToEdit(messageId: string, txt: string): UIAction {
  return { type: UIActionEnum.StartEditing, payload: { id: messageId, txt } }
}

export function endToEdit(): UIAction {
  return { type: UIActionEnum.EndEditing }
}

export function modifyMessage(txt: string): UIAction {
  return { type: UIActionEnum.ModifyText, payload: { txt } }
}

export function inputMessage(txt: string): UIAction {
  return { type: UIActionEnum.InputText, payload: { txt } }
}

export function openSettings(): UIAction {
  return { type: UIActionEnum.OpenSettings }
}

export function closeSettings(): UIAction {
  return { type: UIActionEnum.CloseSettings }
}

export function openUserDetail(id: string, account: string): UIAction {
  return { type: UIActionEnum.OpenUserDetail, payload: { id, account } }
}

export function closeUserDetail(): UIAction {
  return { type: UIActionEnum.CloseUserDetail }
}
