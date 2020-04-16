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

export const UIActions = {
  Onresize: 'UIAction:Onresize',
  OpenMenu: 'UIAction:OpenMenu',
  CloseMenu: 'UIAction:CloseMenu',
  InputText: 'UIAction:InputText',
  StartEditing: 'UIAction:StartEditing',
  EndEditing: 'UIAction:EndEditing',
  ModifyText: 'UIAction:ModifyText',
  OpenSettings: 'UIAction:OpenSettings',
  CloseSettings: 'UIAction:CloseSettings',
  OpenUserDetail: 'UIAction:OpenUserDetail',
  CloseUserDetail: 'UIAction:CloseUserDetail'
} as const

export type UIAction =
  | {
      type: typeof UIActions.Onresize
      payload: { innerHeight: number; innerWidth: number }
    }
  | {
      type: typeof UIActions.OpenMenu
    }
  | {
      type: typeof UIActions.CloseMenu
    }
  | {
      type: typeof UIActions.InputText
      payload: { txt: string }
    }
  | {
      type: typeof UIActions.StartEditing
      payload: { id: string; txt: string }
    }
  | {
      type: typeof UIActions.EndEditing
    }
  | {
      type: typeof UIActions.ModifyText
      payload: { txt: string }
    }
  | {
      type: typeof UIActions.OpenSettings
    }
  | {
      type: typeof UIActions.CloseSettings
    }
  | {
      type: typeof UIActions.OpenUserDetail
      payload: { id: string; account: string; icon: string }
    }
  | {
      type: typeof UIActions.CloseUserDetail
    }
