import React, { useState, useEffect, useCallback } from 'react'
import styled from 'styled-components'
import { useSelector } from 'react-redux'
import ImageIcon from '@material-ui/icons/Image'
import { State } from '../../modules/index'
import Button from '../atoms/Button'
import SocialAccounts from '../atoms/SocialAccounts'
import ModalIconCanvas from './ModalIconCanvas'

export default function ShowAccount() {
  const id = useSelector((state: State) => state.user.me.id)
  const account = useSelector((state: State) => state.user.me.account)
  const icon = useSelector((state: State) => state.user.me.iconUrl)
  const [open, setOpen] = useState(false)
  const [image, setImage] = useState('')
  const [edit, setEdit] = useState(false)

  // ターゲット以外の場所にdropしてしまった時にブラウザで画像を開かないように
  useEffect(() => {
    const _onDragOver = (e) => e.preventDefault()
    const _onDrop = (e) => e.preventDefault()
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

  const onDragOver = (e) => {
    if (
      e.dataTransfer.types &&
      Array.from(e.dataTransfer.types).includes('Files')
    ) {
      e.dataTransfer.dropEffect = 'copy'
      e.preventDefault()
    }
  }

  const onDrop = (e) => {
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
    <Wrap>
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
        <li>
          <SocialAccounts />
        </li>
      </ul>
      <div className="button">
        {edit && (
          <>
            <Button className="cancel" onClick={onCancel}>
              キャンセル
            </Button>
            <Button className="save" onClick={onSave}>
              保存
            </Button>
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
    </Wrap>
  )
}

const Wrap = styled.div`
  display: flex;

  .button {
    display: flex;
    flex-direction: column;

    button {
      width: 100px;
      height: 32px;
    }
    .cancel {
      background: none;
    }
    .save {
      margin: 1em 0 0 0;
    }
  }

  .info {
    list-style-type: none;
    margin: 0;
    padding: 0;
    > li {
      padding: 1em 1em 0;
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
`
