export type UIState = {
  device: 'pc' | 'mobile'
  menuStatus: 'open' | 'close'
  overlay: boolean
  inputMode: 'normal' | 'edit'
  txt: string
  editTxt: string
  editId: string
  openSettings: boolean
  openUserDetail: boolean
  userDetail: { id: string; account: string; icon: string }
}

export type UIAction =
  | {
      type: 'onresize'
      payload: { innerHeight: number; innerWidth: number }
    }
  | {
      type: 'menu:open'
    }
  | {
      type: 'menu:close'
    }
  | {
      type: 'overlay:show'
    }
  | {
      type: 'overlay:hide'
    }
  | {
      type: 'input:txt'
      payload: { txt: string }
    }
  | {
      type: 'edit:start'
      payload: { id: string; txt: string }
    }
  | {
      type: 'edit:end'
    }
  | {
      type: 'modify:txt'
      payload: { txt: string }
    }
  | {
      type: 'open:settings'
    }
  | {
      type: 'close:settings'
    }
  | {
      type: 'open:userdetail'
      payload: { id: string; account: string }
    }
  | {
      type: 'close:userdetail'
    }
