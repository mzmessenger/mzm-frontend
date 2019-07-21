export type UserState = {
  signup: boolean
  signupAccount: string
  login: boolean
  me: MyInfo
  device: 'pc' | 'mobile'
  menuStatus: 'open' | 'close'
  overlay: boolean
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
