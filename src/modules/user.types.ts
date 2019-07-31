export type UserState = {
  signup: boolean
  signupAccount: string
  login: boolean
  me: MyInfo
  device: 'pc' | 'mobile'
  menuStatus: 'open' | 'close'
  overlay: boolean
  inputMode: 'normal' | 'edit'
  txt: string
  editTxt: string
  editId: string
  openSettings: boolean
}

type MyInfo = {
  id: string
  account: string
  iconUrl?: string
}

export type UserAction =
  | {
      type: 'signup'
      payload: { account?: string }
    }
  | {
      type: 'me:set'
      payload: MyInfo
    }
  | {
      type: 'logout'
    }
  | {
      type: 'remove:user'
    }
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
      type: 'edit:start'
      payload: { id: string; txt: string }
    }
  | {
      type: 'edit:end'
    }
  | {
      type: 'input:txt'
      payload: { txt: string }
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
