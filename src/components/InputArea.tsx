import React, { useState } from 'react'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import styled from 'styled-components'
import { sendMessage } from '../modules/index.action'

const Wrap = styled.div`
  padding: 0 15px;
  .form-wrap {
    padding: 20px 0;
    border-top: 1px solid rgba(255, 255, 255, 0.3);
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

const SendButton = styled.button`
  height: 40px;
  width: 100px;
  background-color: #5ca3ff;
  border-color: #6486b3;
  color: #ffffff;
  border-radius: 3px;
`

type Props = ReturnType<typeof mapDispatchToProps>

const InputArea: React.FC<Props> = ({ sendMessage }) => {
  const [txt, setTxt] = useState('')

  const handleSubmit = evt => {
    evt.preventDefault()
    sendMessage(txt)
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

function mapDispatchToProps(dispatch) {
  return bindActionCreators({ sendMessage }, dispatch)
}

export default connect(
  () => ({}),
  mapDispatchToProps
)(InputArea)
