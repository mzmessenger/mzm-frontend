import React from 'react'
import { useSelector, useDispatch } from 'react-redux'
import styled from 'styled-components'
import Settings from '@material-ui/icons/Settings'
import { State } from '../modules/index'
import { openSettings, closeSettings } from '../modules/ui'

const Wrap = styled.div`
  padding: 8px;
  .profile-wrap {
    display: flex;
  }
  .icon-img {
    margin: 0 10px 0 0;
    width: 25px;
    height: 25px;
    border-radius: 2px;
  }
  .profile {
    margin: 0 8px 0 0;
    font-size: 18px;
    line-height: 25px;
  }
  .more-ver-icon {
    cursor: pointer;
  }
  .setting-icon {
    cursor: pointer;
  }
`

export default function MyInfo() {
  const me = useSelector((state: State) => state.user.me)
  const settings = useSelector((state: State) => state.ui.openSettings)
  const icon = me ? me.iconUrl : null
  const dispatch = useDispatch()

  const clickSettings = () => {
    if (settings) {
      dispatch(closeSettings())
    } else {
      dispatch(openSettings())
    }
  }

  const m = me ? me.account : ''

  return (
    <Wrap>
      <div className="profile-wrap">
        <img className="icon-img" src={icon} width="20" height="20" />
        <div className="profile">{m}</div>
        <Settings className="settings-icon" onClick={clickSettings} />
      </div>
    </Wrap>
  )
}
