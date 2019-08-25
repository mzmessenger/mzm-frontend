import React from 'react'
import { useDispatch } from 'react-redux'
import styled from 'styled-components'
import { removeUser } from '../modules/user.action'
import { closeSettings } from '../modules/ui.action'
import Button from './atoms/Button'

const Wrap = styled.div`
  flex: 1;
  padding: 8px 32px;
  color: var(--color-on-background);
  font-size: 1em;

  button {
    height: 40px;
  }

  .user {
    padding: 16px 0 32px;
    border-bottom: 1px solid hsla(0, 100%, 100%, 0.9);
  }

  .logout {
    padding: 0 8px;
  }

  .delete {
    margin-top: 32px;
    button {
      color: var(--color-on-warning);
      background-color: var(--color-warning);
      border-color: transparent;
    }
  }

  .cancel {
    margin-top: 16px;
    button {
      background-color: transparent;
      border-color: transparent;
    }
  }
`

export default function Settings() {
  const dispatch = useDispatch()

  const onDelete = () => {
    if (window.confirm('本当にアカウントを削除しますか？')) {
      removeUser()(dispatch)
    }
  }

  const onClose = () => {
    dispatch(closeSettings())
  }

  return (
    <Wrap>
      <h2>設定</h2>
      <div className="user">
        <div className="logout">
          <a href="/auth/logout">Logout</a>
        </div>
        <div className="delete">
          <Button onClick={onDelete}>アカウントの削除</Button>
        </div>
      </div>
      <div className="cancel">
        <Button onClick={onClose}>キャンセル</Button>
      </div>
    </Wrap>
  )
}
