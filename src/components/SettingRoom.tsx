import React, { useState, useCallback } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import styled from 'styled-components'
import DirectionsRun from '@material-ui/icons/DirectionsRun'
import { WIDTH_MOBILE } from '../lib/constants'
import { State, store } from '../modules/index'
import { exitRoom, uploadIcon } from '../modules/rooms'
import Home from '@material-ui/icons/Home'
import DropImage from './atoms/DropImage'
import Button from './atoms/Button'
import ModalIcon from './atoms/ModalIcon'
import SettingRoomStatus from './SettingRoomStatus'

const IconImage = ({ iconUrl }: { iconUrl: string }) => {
  return iconUrl ? <img src={iconUrl} /> : <Home />
}

const RoomSetting = () => {
  const dispatch = useDispatch()
  const id = useSelector((state: State) => state.rooms.currentRoomId)
  const _name = useSelector((state: State) => state.rooms.currentRoomName)
  const room = useSelector((state: State) => state.rooms.rooms.byId[id])
  const [image, setImage] = useState('')
  const [open, setOpen] = useState(false)
  const [edit, setEdit] = useState(false)

  const name = _name || ''
  const iconUrl = room?.iconUrl
  const isGeneral = name === 'general'

  const onClick = () => {
    exitRoom(id)(dispatch, store.getState)
  }

  const onloadFile = (file: string) => {
    setImage(file)
    setOpen(true)
  }

  const onModalSave = useCallback((image: Blob) => {
    uploadIcon(
      name,
      image
    )(dispatch).then((res) => {
      if (res.ok) {
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

  const onEdit = () => setEdit(true)

  const onSave = () => {
    setImage('')
    setEdit(false)
  }

  const onCancel = () => {
    setImage('')
    setEdit(false)
  }

  return (
    <Wrap>
      <div className="inner">
        <h2>部屋設定</h2>
        <div className="room-wrap">
          <div className="room-body">
            <div className="room-icon">
              {edit && <DropImage onloadFile={onloadFile} />}
              {!edit && <IconImage iconUrl={iconUrl} />}
            </div>
            <div className="room-info">
              <ul>
                <li>
                  <h4>ID</h4>
                  <span>{id}</span>
                </li>
                <li>
                  <h4>部屋名</h4>
                  <span className="room-name">{name}</span>
                </li>
              </ul>
            </div>
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
          </div>

          {!isGeneral && (
            <div className="room-status">
              <SettingRoomStatus />
            </div>
          )}
          {!isGeneral && (
            <div className="exit" onClick={onClick}>
              <Button>
                <DirectionsRun className="icon" />
                退室する
              </Button>
            </div>
          )}
        </div>
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
export default RoomSetting

const Wrap = styled.div`
  padding: 8px 32px;
  color: var(--color-on-background);

  .inner {
    background: var(--color-surface);
    color: var(--color-on-surface);
    padding: 8px 16px;
  }

  .room-wrap {
    padding: 32px 0 32px;
    border-top: 1px solid var(--color-border);
  }

  .room-body {
    display: flex;
  }

  .room-icon {
    .drop,
    > svg,
    img {
      padding: 4px;
      width: 100px;
      height: 100px;
    }

    > svg,
    img {
      border: 1px solid var(--color-border);
      border-radius: 4px;
    }
  }

  .room-info {
    flex: 1;
    > ul {
      list-style-type: none;
      margin: 0;
      padding: 0;
      > li {
        padding: 1em 1em 0;
      }
    }
    span {
      font-size: 16px;
    }
    .room-name {
      word-break: break-word;
    }
  }

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

  .room-status,
  .exit {
    border-top: 1px solid var(--color-border);
    margin-top: 32px;
  }

  .exit {
    .icon {
      margin-right: 8px;
    }

    button {
      margin-top: 16px;
      padding: 0 16px;
      display: flex;
      justify-content: center;
      align-items: center;
      height: 32px;
      color: var(--color-warning);
      border: 1px solid var(--color-warning);
      background: none;
    }
  }

  @media (max-width: ${WIDTH_MOBILE}px) {
    padding-left: 0;
    padding-right: 0;
  }
`
