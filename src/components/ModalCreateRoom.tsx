import React, { useState } from 'react'
import { connect } from 'react-redux'
import styled from 'styled-components'
import Modal from '@material-ui/core/Modal'
import * as actions from '../modules/index'

const ModalInner = styled.form`
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translateY(-50%) translateX(-50%);
  margin: auto;
  width: 440px;
  border-radius: 5px;
  color: #fff;
  background: #3c4250;
  box-shadow: 0px 3px 5px -1px rgba(0, 0, 0, 0.2),
    0px 5px 8px 0px rgba(0, 0, 0, 0.14), 0px 1px 14px 0px rgba(0, 0, 0, 0.12);
  outline: none;
`

const Header = styled.h4`
  margin: 0;
  padding: 20px;
`

const Body = styled.div`
  padding: 0 20px 20px;
`

const InputTextWrap = styled.div`
  flex: 1;
  border-radius: 5px;
  background-color: #546780;
  display: flex;
  height: 40px;

  input {
    color: #dcddde;
    background-color: transparent;
    resize: none;
    border: none;
    appearance: none;
    font-size: 16px;
    padding: 10px;
    flex: 1;
  }
`

const Buttons = styled.div`
  padding: 20px;
  display: flex;
  justify-content: flex-end;
  background: #2f3136;
  button {
    cursor: pointer;
    height: 40px;
    width: 100px;
  }
`

const SendButton = styled.button`
  background-color: #5ca3ff;
  border-color: #6486b3;
  color: #ffffff;
  border-radius: 3px;
`

const CancelButton = styled.button`
  color: #ffffff;
  border-color: transparent;
  background-color: transparent;
`

function RoomNavi({
  open,
  onClose,
  createRoom
}: {
  open: boolean
  onClose: () => void
  createRoom: ReturnType<typeof actions.createRoom>
}) {
  const [txt, setTxt] = useState('')
  const [error, setErrorTxt] = useState('')

  const handleSubmit = evt => {
    evt.preventDefault()
    // @todo エラー時の処理
    createRoom(txt)
      .then(data => {
        if (data.status === 200) {
          onClose()
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
        <Header>部屋を作成</Header>
        <Body>
          <p style={{ margin: '0 0 3px 0', fontSize: '15px' }}>部屋名</p>
          <InputTextWrap>
            <input
              type="text"
              value={txt}
              onChange={e => setTxt(e.target.value)}
            />
          </InputTextWrap>
          <p style={{ display: error ? 'block' : 'none' }}>{error}</p>
        </Body>
        <Buttons>
          <CancelButton onClick={onClose} style={{ marginRight: '5px' }}>
            キャンセル
          </CancelButton>
          <SendButton type="submit">送信</SendButton>
        </Buttons>
      </ModalInner>
    </Modal>
  )
}
export default connect(
  () => ({}),
  dispatch => {
    return {
      createRoom: actions.createRoom(dispatch)
    }
  }
)(RoomNavi)
