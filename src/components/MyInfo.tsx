import React, { useState, useCallback } from 'react'
import { useSelector } from 'react-redux'
import styled from 'styled-components'
import MoreVertIcon from '@material-ui/icons/MoreVert'
import { State } from '../modules/index.types'
import Menu from './MenuProfile'

const Wrap = styled.div`
  padding: 8px;
  min-width: 140px;
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
`

export default function MyInfo() {
  const me = useSelector((state: State) => state.me)
  const icon = useSelector((state: State) => state.icon)
  const [anchorEl, setAnchorEl] = useState(null)

  const handleOpen = event => {
    setAnchorEl(event.currentTarget)
  }

  const handleClose = useCallback(() => {
    setAnchorEl(null)
  }, [anchorEl])

  const open = Boolean(anchorEl)
  const m = me ? me.account : ''

  return (
    <Wrap>
      <div className="profile-wrap">
        <img className="icon-img" src={icon} width="20" height="20" />
        <div className="profile">{m}</div>
        <MoreVertIcon className="more-ver-icon" onClick={handleOpen} />
      </div>
      <Menu open={open} anchorEl={anchorEl} handleClose={handleClose} />
    </Wrap>
  )
}
