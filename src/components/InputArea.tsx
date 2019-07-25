import React, { useState } from 'react'
import styled from 'styled-components'
import { useSelector, useDispatch } from 'react-redux'
import { State } from '../modules/index'
import {
  sendMessage,
  modifyMessage as sendModifyMessage
} from '../modules/socket.action'
import { inputMessage, modifyMessage, endEdit } from '../modules/user.action'
import Button from './atoms/Button'

const Wrap = styled.div`
  padding: 0 15px;
  .form-wrap {
    padding: 10px 0;
  }

  form {
    display: flex;
    justify-content: center;
    align-items: flex-end;
  }

  .form-wrap.edit {
    .text-area-wrap {
      border: 1px solid hsl(46.8, 79.3%, 52.7%);
    }
  }

  .text-area-wrap {
    flex: 1;
    border-radius: 5px;
    background-color: var(--color-input-background);
    display: flex;
    margin-right: 10px;

    textarea {
      min-height: 2em;
      color: var(--color-input);
      background-color: transparent;
      resize: vertical;
      border: none;
      appearance: none;
      font-size: 16px;
      padding: 10px;
      flex: 1;
    }
  }

  .button-area {
    display: flex;
    flex-direction: column;
    justify-content: flex-end;
    width: 100px;
  }
`

const SendButton = styled(Button)`
  height: 40px;
`

const CancelButton = styled(Button)`
  margin-bottom: 8px;
  height: 40px;
  background: var(--color-guide);
`

export default function InputArea() {
  const currentRoomId = useSelector((state: State) => state.rooms.currentRoomId)
  const socket = useSelector((state: State) => state.socket.socket)
  const txt = useSelector((state: State) => state.user.txt)
  const editTxt = useSelector((state: State) => state.user.editTxt)
  const editId = useSelector((state: State) => state.user.editId)
  const inputMode = useSelector((state: State) => state.user.inputMode)
  const dispatch = useDispatch()
  const [rows, setRows] = useState(
    inputMode === 'normal' ? txt.split('\n').length : editTxt.split('\n').length
  )

  const handleSubmit = evt => {
    evt.preventDefault()
    if (inputMode === 'normal') {
      sendMessage(txt, currentRoomId, socket)
    } else if (inputMode === 'edit') {
      sendModifyMessage(editTxt, editId, socket)
      dispatch(endEdit())
    }
    dispatch(inputMessage(''))
  }

  const onChange = e => {
    const value = e.target.value
    if (inputMode === 'normal') {
      dispatch(inputMessage(value))
    } else if (inputMode === 'edit') {
      dispatch(modifyMessage(value))
    }
    setRows(value.split('\n').length)
  }

  const classNames = ['form-wrap']
  if (inputMode === 'edit') {
    classNames.push('edit')
  }

  return (
    <Wrap>
      <div className={classNames.join(' ')}>
        <form onSubmit={handleSubmit}>
          <div className="text-area-wrap">
            <textarea
              rows={rows}
              value={inputMode === 'edit' ? editTxt : txt}
              onChange={onChange}
            />
          </div>
          <div className="button-area">
            <div style={{ flex: '1' }}></div>
            {inputMode === 'edit' && (
              <CancelButton onClick={() => dispatch(endEdit())}>
                キャンセル
              </CancelButton>
            )}
            <SendButton type="submit">投稿</SendButton>
          </div>
        </form>
      </div>
    </Wrap>
  )
}
