export type UserState = {
  signup: boolean
  signupAccount: string
  login: boolean
  me: MyInfo
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
