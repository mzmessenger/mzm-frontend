import React, { useState } from 'react'
import styled from 'styled-components'
import { useDispatch } from 'react-redux'
import { sendMessage } from '../modules/index.action'
import Button from './atoms/Button'

const Wrap = styled.div`
  padding: 0 15px;
  .form-wrap {
    padding: 20px 0;
  }
`
const Form = styled.form`
  display: flex;
  justify-content: center;
  align-items: center;
`

const TextAreaWrap = styled.div`
  flex: 1;
  border-radius: 5px;
  background-color: #546780;
  display: flex;
  margin-right: 10px;
  textarea {
    padding: 10px;
    color: #dcddde;
    background-color: transparent;
    resize: none;
    border: none;
    appearance: none;
    flex: 1;
  }
`

const SendButton = styled(Button)`
  height: 40px;
  width: 100px;
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
        <Form onSubmit={handleSubmit}>
          <TextAreaWrap>
            <textarea value={txt} onChange={e => setTxt(e.target.value)} />
          </TextAreaWrap>
          <SendButton type="submit">投稿</SendButton>
        </Form>
      </div>
    </Wrap>
  )
}
