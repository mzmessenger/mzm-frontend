import React, { useState } from 'react'
import styled from 'styled-components'
import { useDispatch } from 'react-redux'
import { sendMessage } from '../modules/index.action'
import Button from './atoms/Button'

const Wrap = styled.div`
  padding: 0 15px;
  .form-wrap {
    padding: 10px 0;
  }
  form {
    display: flex;
    justify-content: center;
    align-items: center;
  }
`

const TextAreaWrap = styled.div`
  flex: 1;
  border-radius: 5px;
  background-color: var(--color-input-background);
  display: flex;
  margin-right: 10px;
  textarea {
    color: #dcddde;
    background-color: transparent;
    resize: none;
    border: none;
    appearance: none;
    flex: 1;
  }
`

const SendButton = styled(Button)`
  height: 33px;
  width: 80px;
`

export default function InputArea() {
  const [txt, setTxt] = useState('')
  const dispatch = useDispatch()

  const handleSubmit = evt => {
    evt.preventDefault()
    dispatch(sendMessage(txt))
    setTxt('')
  }

  return (
    <Wrap>
      <div className="form-wrap">
        <form onSubmit={handleSubmit}>
          <TextAreaWrap>
            <textarea value={txt} onChange={e => setTxt(e.target.value)} />
          </TextAreaWrap>
          <SendButton type="submit">投稿</SendButton>
        </form>
      </div>
    </Wrap>
  )
}
