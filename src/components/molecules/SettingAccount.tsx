import React from 'react'
import { useDispatch } from 'react-redux'
import styled from 'styled-components'
import { removeUser } from '../../modules/user'
import Button from '../atoms/Button'
import ShowAccount from './ShowAccount'

export default function SettingAccount() {
  const dispatch = useDispatch()

  const onDelete = () => {
    if (window.confirm('本当にアカウントを削除しますか？')) {
      removeUser()(dispatch)
    }
  }

  return (
    <Wrap>
      <ShowAccount />
      <div className="delete">
        <Button onClick={onDelete}>アカウントの削除</Button>
      </div>
    </Wrap>
  )
}

const Wrap = styled.div`
  .delete {
    margin-top: 32px;
    button {
      height: 32px;
      padding: 0 16px;
      color: var(--color-warning);
      border: 1px solid var(--color-warning);
      background: none;
    }
  }
`
