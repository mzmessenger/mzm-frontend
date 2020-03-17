import React from 'react'
import { useDispatch, useSelector } from 'react-redux'
import styled from 'styled-components'
import { State } from '../modules/index'
import { removeUser } from '../modules/user'
import { closeSettings } from '../modules/ui'
import Button from './atoms/Button'

export default function Settings() {
  const dispatch = useDispatch()
  const id = useSelector((state: State) => state.user.me.id)
  const account = useSelector((state: State) => state.user.me.account)
  const icon = useSelector((state: State) => state.user.me.iconUrl)

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
      <div className="inner">
        <h2>設定</h2>
        <div className="user">
          <div className="menu">
            <ul>
              <li>アカウント</li>
              <li>
                <div className="logout">
                  <a href="/auth/logout">Logout</a>
                </div>
              </li>
            </ul>
          </div>
          <div className="body">
            <div className="account">
              <div className="icon">
                <img src={icon} width="100" height="100" />
              </div>
              <ul>
                <li>
                  <h4>ユーザーID</h4>
                  <span>{id}</span>
                </li>
                <li>
                  <h4>ユーザー名</h4>
                  <span>{account}</span>
                </li>
              </ul>
            </div>
            <div className="delete">
              <Button onClick={onDelete}>アカウントの削除</Button>
            </div>
          </div>
        </div>
        <div className="cancel">
          <Button onClick={onClose}>キャンセル</Button>
        </div>
      </div>
    </Wrap>
  )
}

const Wrap = styled.div`
  flex: 1;
  padding: 8px 32px;
  color: var(--color-on-background);
  font-size: 1em;

  .inner {
    background: var(--color-surface);
    color: var(--color-on-surface);
    padding: 8px 16px;
  }

  button {
    height: 32px;
  }

  .user {
    padding: 32px 0 32px;
    border-top: 1px solid var(--color-border);
    border-bottom: 1px solid var(--color-border);
    display: flex;
    ul {
      list-style-type: none;
      padding: 0 8px;
      margin: 0;
    }
    li {
      padding: 8px 0;
    }

    .menu {
      padding: 0 1em;
      border-right: 1px solid var(--color-border);
    }
    .body {
      padding: 0 16px;
    }
  }

  .account {
    h4 {
      margin: 0;
      padding: 0;
      font-size: 8px;
    }
    ul {
      span {
        font-size: 16px;
      }
    }
    .icon {
      padding: 0 8px;
    }
  }

  .logout {
    color: var(--color-warning);
  }

  .delete {
    margin-top: 24px;
    button {
      padding: 0 16px;
      color: var(--color-warning);
      border: 1px solid var(--color-warning);
      background: none;
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
