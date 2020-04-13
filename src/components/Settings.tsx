import React from 'react'
import { useDispatch } from 'react-redux'
import styled from 'styled-components'
import CancelIcon from '@material-ui/icons/Cancel'
import { closeSettings } from '../modules/ui'
import SettingAccount from './molecules/SettingAccount'

export default function Settings() {
  const dispatch = useDispatch()
  const onClose = () => {
    dispatch(closeSettings())
  }

  return (
    <Wrap>
      <div className="inner">
        <header>
          <h2>設定</h2>
          <div className="setting-close">
            <CancelIcon className="icon" onClick={onClose} />
          </div>
        </header>
        <div className="user">
          <ul className="menu">
            <li>アカウント</li>
            <li>
              <div className="logout">
                <a href="/auth/logout">Logout</a>
              </div>
            </li>
          </ul>
          <div className="body">
            <SettingAccount />
          </div>
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

  .inner > header {
    padding: 0 8px;
    display: flex;
    h2 {
      flex: 1;
    }
  }

  .inner {
    background: var(--color-surface);
    color: var(--color-on-surface);
    padding: 8px 16px;
  }

  .user {
    padding: 32px 0 32px;
    border-top: 1px solid var(--color-border);
    display: flex;
    .menu {
      list-style-type: none;
      padding: 0 8px;
      margin: 0;
      > li {
        padding: 8px 0;
      }
    }

    .menu {
      padding: 0 1em;
      border-right: 1px solid var(--color-border);
    }
    .body {
      padding: 0 16px;
      flex: 1;
    }
  }

  .logout {
    display: flex;
    color: var(--color-warning);
    a {
      flex: 1;
    }
  }

  .setting-close {
    margin-top: 16px;
    .icon {
      width: 32px;
      cursor: pointer;
    }
  }
`
