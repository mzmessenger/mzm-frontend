import { UIAction, UIActionEnum } from './ui.types'

export function onResize(innerWidth: number, innerHeight: number): UIAction {
  return { type: UIActionEnum.Onresize, payload: { innerWidth, innerHeight } }
}

export function openMenu(): UIAction {
  return { type: UIActionEnum.OpenMenu }
}

export function closeMenu(): UIAction {
  return { type: UIActionEnum.CloseMenu }
}

export function startEdit(messageId: string, txt: string): UIAction {
  return { type: UIActionEnum.StartEditing, payload: { id: messageId, txt } }
}

export function endEdit(): UIAction {
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
