import React, { useState } from 'react'
import styled from 'styled-components'
import { useSelector } from 'react-redux'
import { State } from '../modules/index'
import { sendMessage } from '../modules/socket.action'
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

  .button-area {
    display: flex;
    flex-direction: column;
    justify-content: flex-end;
  }
`

const TextAreaWrap = styled.div`
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
`

const SendButton = styled(Button)`
  height: 33px;
  width: 80px;
`

export default function InputArea() {
  const [txt, setTxt] = useState('')
  const [rows, setRows] = useState(1)
  const currentRoomId = useSelector((state: State) => state.rooms.currentRoomId)
  const socket = useSelector((state: State) => state.socket.socket)

  const handleSubmit = evt => {
    evt.preventDefault()
    sendMessage(txt, currentRoomId, socket)
    setTxt('')
  }

  const onChange = e => {
    const value = e.target.value
    setTxt(value)
    setRows(value.split('\n').length)
  }

  return (
    <Wrap>
      <div className="form-wrap">
        <form onSubmit={handleSubmit}>
          <TextAreaWrap>
            <textarea rows={rows} value={txt} onChange={onChange} />
          </TextAreaWrap>
          <div className="button-area">
            <div style={{ flex: '1' }}></div>
            <SendButton type="submit">投稿</SendButton>
          </div>
        </form>
      </div>
    </Wrap>
  )
}
