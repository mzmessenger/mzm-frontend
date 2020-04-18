export type UserState = {
  signup: boolean
  signupAccount: string
  login: boolean
  me: MyInfo
}

type MyInfo = {
  id: string
  account: string
  iconUrl: string
  twitterUserName: string | null
  githubUserName: string | null
}

export const UserActions = {
  Signup: 'UserAction:Signup',
  Logout: 'UserAction:Logout',
  SetMe: 'UserAction:SetMe',
  SetIcon: 'UserAction:SetIcon',
  Remove: 'UserAction:Remove'
} as const

export type UserAction =
  | {
      type: typeof UserActions.Signup
      payload: { account?: string }
    }
  | {
      type: typeof UserActions.Logout
    }
  | {
      type: typeof UserActions.SetMe
      payload: MyInfo
    }
  | {
      type: typeof UserActions.SetIcon
      payload: {
        version: string
      }
    }
  | {
      type: typeof UserActions.Remove
    }
