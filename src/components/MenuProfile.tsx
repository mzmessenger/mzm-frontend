import React, { useCallback } from 'react'
import { useDispatch } from 'react-redux'
import styled from 'styled-components'
import Popover, { PopoverProps } from '@material-ui/core/Popover'
import ClickAwayListener from '@material-ui/core/ClickAwayListener'
import MenuList from '@material-ui/core/MenuList'
import MenuItem from '@material-ui/core/MenuItem'
import { removeUser } from '../modules/index.action'

const Wrap = styled.div`
  background-color: var(--color-surface);
  color: var(--color-on-surface);
  a {
    color: var(--color-on-surface);
  }
  .delete {
    background-color: var(--color-warning);
    color: var(--color-on-warning);
    font-weight: 800;
    :hover {
      background-color: var(--color-warning);
      color: var(--color-on-warning);
    }
  }
`

type Props = {
  open: boolean
  handleClose: () => void
} & PopoverProps

function ModalUser({ open, anchorEl, handleClose }: Props) {
  const dispatch = useDispatch()

  const onDelete = useCallback(() => {
    if (window.confirm('本当にアカウントを削除しますか？')) {
      removeUser()(dispatch)
    }
  }, [dispatch])

  return (
    <Popover
      open={open}
      anchorEl={anchorEl}
      anchorOrigin={{
        vertical: 'bottom',
        horizontal: 'left'
      }}
      transformOrigin={{
        vertical: 'top',
        horizontal: 'center'
      }}
    >
      <Wrap>
        <ClickAwayListener onClickAway={handleClose}>
          <MenuList>
            <a href="/auth/logout">
              <MenuItem>Logout</MenuItem>
            </a>
            <MenuItem className="delete" onClick={onDelete}>
              アカウントの削除
            </MenuItem>
          </MenuList>
        </ClickAwayListener>
      </Wrap>
    </Popover>
  )
}

export default ModalUser
