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

export enum UIActionEnum {
  Onresize = 'UIAction:Onresize',
  OpenMenu = 'UIAction:OpenMenu',
  CloseMenu = 'UIAction:CloseMenu',
  InputText = 'UIAction:InputText',
  StartEditing = 'UIAction:StartEditing',
  EndEditing = 'UIAction:EndEditing',
  ModifyText = 'UIAction:ModifyText',
  OpenSettings = 'UIAction:OpenSettings',
  CloseSettings = 'UIAction:CloseSettings',
  OpenUserDetail = 'UIAction:OpenUserDetail',
  CloseUserDetail = 'UIAction:CloseUserDetail'
}

export type UIAction =
  | {
      type: UIActionEnum.Onresize
      payload: { innerHeight: number; innerWidth: number }
    }
  | {
      type: UIActionEnum.OpenMenu
    }
  | {
      type: UIActionEnum.CloseMenu
    }
  | {
      type: UIActionEnum.InputText
      payload: { txt: string }
    }
  | {
      type: UIActionEnum.StartEditing
      payload: { id: string; txt: string }
    }
  | {
      type: UIActionEnum.EndEditing
    }
  | {
      type: UIActionEnum.ModifyText
      payload: { txt: string }
    }
  | {
      type: UIActionEnum.OpenSettings
    }
  | {
      type: UIActionEnum.CloseSettings
    }
  | {
      type: UIActionEnum.OpenUserDetail
      payload: { id: string; account: string }
    }
  | {
      type: UIActionEnum.CloseUserDetail
    }
