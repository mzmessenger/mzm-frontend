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

export enum UserActionEnum {
  Signup = 'UserAction:Signup',
  Logout = 'UserAction:Logout',
  SetMe = 'UserAction:SetMe',
  SetIcon = 'UserAction:SetIcon',
  Remove = 'UserAction:Remove'
}

export type UserAction =
  | {
      type: UserActionEnum.Signup
      payload: { account?: string }
    }
  | {
      type: UserActionEnum.Logout
    }
  | {
      type: UserActionEnum.SetMe
      payload: MyInfo
    }
  | {
      type: UserActionEnum.SetIcon
      payload: {
        version: string
      }
    }
  | {
      type: UserActionEnum.Remove
    }
