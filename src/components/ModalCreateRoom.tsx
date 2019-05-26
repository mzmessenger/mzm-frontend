import React, { useState } from 'react'
import { connect } from 'react-redux'
import { withRouter, RouteComponentProps } from 'react-router-dom'
import styled from 'styled-components'
import Modal from '@material-ui/core/Modal'
import { createRoom } from '../modules/index.action'

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
  button.send {
    background-color: #5ca3ff;
    border-color: #6486b3;
    color: #ffffff;
    border-radius: 3px;
  }
  button.cancel {
    color: #ffffff;
    border-color: transparent;
    background-color: transparent;
  }
`

type Props = {
  open: boolean
  onClose: () => void
} & ReturnType<typeof mapDispatchToProps> &
  RouteComponentProps

const ModalCraeteRoom: React.FC<Props> = ({
  history,
  open,
  onClose,
  createRoom
}) => {
  const [txt, setTxt] = useState('')
  const [error, setErrorTxt] = useState('')

  const handleSubmit = evt => {
    evt.preventDefault()
    // @todo エラー時の処理
    createRoom(txt)
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
          <button
            className="cancel"
            onClick={onClose}
            style={{ marginRight: '5px' }}
          >
            キャンセル
          </button>
          <button className="send" type="submit">
            送信
          </button>
        </Buttons>
      </ModalInner>
    </Modal>
  )
}

function mapDispatchToProps(dispatch) {
  return {
    createRoom: (name: string) => createRoom(name)(dispatch)
  }
}

export default withRouter(
  connect(
    () => ({}),
    mapDispatchToProps
  )(ModalCraeteRoom)
)
