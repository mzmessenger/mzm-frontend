import { UIAction } from './ui.types'

export function onResize(innerWidth: number, innerHeight: number): UIAction {
  return { type: 'onresize', payload: { innerWidth, innerHeight } }
}

export function openMenu(): UIAction {
  return { type: 'menu:open' }
}

export function closeMenu(): UIAction {
  return { type: 'menu:close' }
}

export function startEdit(messageId: string, txt: string): UIAction {
  return { type: 'edit:start', payload: { id: messageId, txt } }
}

export function endEdit(): UIAction {
  return { type: 'edit:end' }
}

export function modifyMessage(txt: string): UIAction {
  return { type: 'modify:txt', payload: { txt } }
}

export function inputMessage(txt: string): UIAction {
  return { type: 'input:txt', payload: { txt } }
}

export function openSettings(): UIAction {
  return { type: 'open:settings' }
}

export function closeSettings(): UIAction {
  return { type: 'close:settings' }
}

export function openUserDetail(id: string, account: string): UIAction {
  return { type: 'open:userdetail', payload: { id, account } }
}

export function closeUserDetail(): UIAction {
  return { type: 'close:userdetail' }
}
