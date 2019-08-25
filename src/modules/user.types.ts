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

export enum UserActionEnum {
  Signup = 'UserAction:Signup',
  Logout = 'UserAction:Logout',
  SetMe = 'UserAction:SetMe',
  Remove = 'UserAction:Remove'
}

export type UserAction =
  | {
      type: UserActionEnum.Signup
      payload: { account?: string }
    }
  | {
      type: UserActionEnum.SetMe
      payload: MyInfo
    }
  | {
      type: UserActionEnum.Logout
    }
  | {
      type: UserActionEnum.Remove
    }
