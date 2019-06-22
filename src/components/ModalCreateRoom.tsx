import React, { useState } from 'react'
import { useDispatch } from 'react-redux'
import { withRouter, RouteComponentProps } from 'react-router-dom'
import styled from 'styled-components'
import { createRoom } from '../modules/index.action'
import Button from './atoms/Button'
import Modal, { ModalProps } from './atoms/Modal'

const ModalInner = styled.form`
  width: 440px;
  border-radius: 3px;
  background-color: var(--color-surface);
  color: var(--color-on-background);
  h4 {
    margin: 0;
    padding: 20px;
  }
  .body {
    padding: 0 20px 20px;
  }
`

const InputTextWrap = styled.div`
  flex: 1;
  display: flex;
  height: 40px;

  input {
    border-radius: 3px;
    background-color: var(--color-input-background);
    resize: none;
    border: none;
    appearance: none;
    font-size: 16px;
    padding: 10px;
    flex: 1;
  }
`

const Buttons = styled.div`
  padding: 14px 20px;
  display: flex;
  justify-content: flex-end;
  background: var(--color-guide);
  button {
    height: 40px;
    width: 100px;
  }
  button.cancel {
    color: var(--color-on-background);
    border-color: transparent;
    background-color: transparent;
  }
`

type Props = ModalProps & RouteComponentProps

function ModalCraeteRoom({ history, open, onClose }: Props) {
  const [txt, setTxt] = useState('')
  const [error, setErrorTxt] = useState('')
  const dispatch = useDispatch()

  const handleSubmit = evt => {
    evt.preventDefault()
    // @todo エラー時の処理
    createRoom(txt)(dispatch)
      .then(data => {
        if (data.status === 200) {
          onClose()
          history.push(`/rooms/${txt}`)
          setTxt('')
          setErrorTxt('')
        } else {
          setErrorTxt('なにかエラーが発生しました')
        }
      })
      .catch(() => {
        setErrorTxt('なにかエラーが発生しました')
      })
  }

  return (
    <Modal open={open} onClose={onClose}>
      <ModalInner onSubmit={handleSubmit}>
        <h4>部屋を作成</h4>
        <div className="body">
          <p style={{ margin: '0 0 3px 0', fontSize: '15px' }}>部屋名</p>
          <InputTextWrap>
            <input
              type="text"
              value={txt}
              onChange={e => setTxt(e.target.value)}
            />
          </InputTextWrap>
          <p style={{ display: error ? 'block' : 'none' }}>{error}</p>
        </div>
        <Buttons>
          <Button
            className="cancel"
            onClick={onClose}
            style={{ marginRight: '5px' }}
          >
            キャンセル
          </Button>
          <Button type="submit">送信</Button>
        </Buttons>
      </ModalInner>
    </Modal>
  )
}

export default withRouter(ModalCraeteRoom)
