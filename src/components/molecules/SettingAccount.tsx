import React, { useState, useEffect, useCallback } from 'react'
import styled from 'styled-components'
import { useDispatch, useSelector } from 'react-redux'
import ImageIcon from '@material-ui/icons/Image'
import { removeUser } from '../../modules/user'
import { State } from '../../modules/index'
import Button from '../atoms/Button'
import ModalIconCanvas from './ModalIconCanvas'

function ShowAccount({
  icon,
  id,
  account
}: {
  icon: string
  id: string
  account: string
}) {
  const [open, setOpen] = useState(false)
  const [image, setImage] = useState('')
  const [edit, setEdit] = useState(false)

  // ターゲット以外の場所にdropしてしまった時にブラウザで画像を開かないように
  useEffect(() => {
    const _onDragOver = e => e.preventDefault()
    const _onDrop = e => e.preventDefault()
    document.addEventListener('dragover', _onDragOver, false)
    document.addEventListener('drop', _onDrop, false)

    return () => {
      document.removeEventListener('dragover', _onDragOver)
      document.removeEventListener('drop', _onDrop)
    }
  }, [])

  const onModalSave = useCallback(() => {
    onSave()
    setOpen(false)
  }, [])

  const onModalCancel = useCallback(() => {
    onSave()
    setOpen(false)
  }, [])

  const onEdit = () => {
    setEdit(true)
  }

  const onSave = () => {
    setEdit(false)
  }

  const onCancel = () => {
    setEdit(false)
  }

  const onDragOver = e => {
    if (
      e.dataTransfer.types &&
      Array.from(e.dataTransfer.types).includes('Files')
    ) {
      e.dataTransfer.dropEffect = 'copy'
      e.preventDefault()
    }
  }

  const onDrop = e => {
    e.preventDefault()
    const data = e.dataTransfer
    const [file] = Array.from(data.files).filter(
      (f: any) => f.type.includes('image/jpeg') || f.type.includes('image/png')
    ) as Blob[]
    const reader = new FileReader()
    reader.onload = () => {
      setImage(reader.result.toString())
      setOpen(true)
    }
    reader.readAsDataURL(file)
  }

  return (
    <>
      <div className="icon">
        {edit && (
          <div className="drop" onDrop={onDrop} onDragOver={onDragOver}>
            <div className="drop-inner">
              <ImageIcon />
              <span>Drop</span>
            </div>
          </div>
        )}
        {!edit && <img src={icon} />}
      </div>
      <ul className="info">
        <li>
          <h4>ユーザーID</h4>
          <span>{id}</span>
        </li>
        <li>
          <h4>ユーザー名</h4>
          <span>{account}</span>
        </li>
      </ul>
      <div className="button">
        {edit && (
          <>
            <Button className="cancel" onClick={onCancel}>
              キャンセル
            </Button>
            <Button onClick={onSave}>保存</Button>
          </>
        )}
        {!edit && (
          <Button className="edit" onClick={onEdit}>
            編集
          </Button>
        )}
      </div>
      <ModalIconCanvas
        image={image}
        open={open}
        onSave={onModalSave}
        onCancel={onModalCancel}
      />
    </>
  )
}

export default function SettingAccount() {
  const dispatch = useDispatch()
  const id = useSelector((state: State) => state.user.me.id)
  const account = useSelector((state: State) => state.user.me.account)
  const icon = useSelector((state: State) => state.user.me.iconUrl)

  const onDelete = () => {
    if (window.confirm('本当にアカウントを削除しますか？')) {
      removeUser()(dispatch)
    }
  }

  return (
    <Wrap>
      <div className="account">
        <ShowAccount id={id} account={account} icon={icon} />
      </div>
      <div className="delete">
        <Button onClick={onDelete}>アカウントの削除</Button>
      </div>
    </Wrap>
  )
}
const Wrap = styled.div`
  .account {
    display: flex;

    .button {
      button {
        width: 100px;
        height: 32px;
      }
      .cancel {
        background: none;
      }
    }
    .info {
      list-style-type: none;
      margin: 0;
      padding: 0;
      > li {
        padding: 0.5em 1em 0;
      }
      flex: 1;
      span {
        font-size: 16px;
      }
    }
    .icon {
      .drop,
      img {
        padding: 1em;
        width: 100px;
        height: 100px;
      }
      .drop {
        border: dashed 2px var(--color-border);
        border-radius: 8px;
        display: flex;
        justify-content: center;
        align-items: center;
        .drop-inner {
          display: flex;
          span {
            margin-left: 4px;
            line-height: 27px;
          }
        }
      }
    }
  }

  .delete {
    margin-top: 24px;
    button {
      height: 32px;
      padding: 0 16px;
      color: var(--color-warning);
      border: 1px solid var(--color-warning);
      background: none;
    }
  }
`
