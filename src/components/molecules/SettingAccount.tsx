import React, { useState, useCallback } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import styled from 'styled-components'
import { WIDTH_MOBILE } from '../../lib/constants'
import { State } from '../../modules/index'
import { uploadIcon } from '../../modules/user'
import Button from '../atoms/Button'
import SocialAccounts from '../atoms/SocialAccounts'
import DropImage from '../atoms/DropImage'
import ModalIcon from './ModalIcon'

export default function SettingAccount() {
  const dispatch = useDispatch()
  const id = useSelector((state: State) => state.user.me.id)
  const account = useSelector((state: State) => state.user.me.account)
  const icon = useSelector((state: State) => state.user.me.iconUrl)
  const [open, setOpen] = useState(false)
  const [image, setImage] = useState('')
  const [edit, setEdit] = useState(false)

  const onModalSave = useCallback((image: Blob) => {
    uploadIcon(image)(dispatch).then((res) => {
      if (res.ok) {
        onSave()
        setOpen(false)
      } else {
        res.text().then((text) => {
          alert(`アップロードにエラーが発生しました(${text})`)
        })
      }
    })
  }, [])

  const onModalCancel = useCallback(() => {
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

  const onloadFile = (file: string) => {
    setImage(file)
    setOpen(true)
  }

  return (
    <Wrap>
      <div className="icon">
        {edit && <DropImage onloadFile={onloadFile} />}
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
      <ModalIcon
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
    padding: 1em 0;
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
      cursor: pointer;
      .drop-inner {
        display: flex;
        span {
          margin-left: 4px;
          line-height: 27px;
        }
        input {
          display: none;
        }
      }
    }
  }

  @media (max-width: ${WIDTH_MOBILE}px) {
    flex-direction: column;
  }
`
