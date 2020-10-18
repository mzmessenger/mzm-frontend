import React, { useState } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import styled from 'styled-components'
import Add from '@material-ui/icons/Add'
import Clear from '@material-ui/icons/Clear'
import { State, store } from '../modules/index'
import { sendMessage } from '../modules/socket'
import TextArea from './atoms/TextArea'
import InputText from './atoms/InputText'
import Button from './atoms/Button'
import TransparentButton from './atoms/TransparentButton'

const Question = ({
  value,
  showClearButton,
  onChange,
  onClear
}: {
  value: string
  showClearButton: boolean
  onChange: (e) => void
  onClear: (e) => void
}) => {
  return (
    <QuestionWrap>
      <InputText
        style={{ margin: '0 8px 0 0' }}
        value={value}
        onChange={onChange}
      />
      {showClearButton && (
        <button className="clear-button" onClick={onClear}>
          <Clear />
        </button>
      )}
    </QuestionWrap>
  )
}

const QuestionWrap = styled.div`
  display: flex;
  align-items: center;
  margin: 0 0 4px 0;

  .clear-button {
    display: flex;
    justify-content: center;
    align-items: center;
    background-color: transparent;
    border: none;
    color: var(--color-on-primary);
  }
`

const VoteMessageBox = ({
  onSave,
  onCancel
}: {
  onSave: (e: React.MouseEvent) => void
  onCancel: (e: React.MouseEvent) => void
}) => {
  const dispatch = useDispatch()
  const currentRoomId = useSelector((state: State) => state.rooms.currentRoomId)
  const [text, setText] = useState('候補日')
  const [questions, setQuestions] = useState<string[]>(['4/1', '4/2', '4/3'])

  const onChange = (e) => {
    setText(e.target.value)
  }

  const onQuestionChange = (e, i: number) => {
    questions[i] = e.target.value
    setQuestions([...questions])
  }

  const onQuestionClear = (e, i: number) => {
    if (questions.length <= 1) {
      return
    }
    questions.splice(i, 1)
    setQuestions([...questions])
  }

  const addQuestion = () => setQuestions([...questions, ''])

  const post = async (e) => {
    const q = questions
      .filter((e) => e.trim())
      .map((e) => {
        return {
          text: e
        }
      })
    const vote = { questions: q }
    await sendMessage(text, currentRoomId, vote)(dispatch, store.getState)
    onSave(e)
  }

  return (
    <VoteWrap>
      <h4>アンケート</h4>
      <p>本文</p>
      <TextArea value={text} onChange={onChange} rows={4} />
      <p>選択肢</p>
      {questions.map((q, i) => {
        return (
          <Question
            key={i}
            value={q}
            onChange={(e) => onQuestionChange(e, i)}
            onClear={(e) => onQuestionClear(e, i)}
            showClearButton={questions.length > 1}
          />
        )
      })}
      {questions.length <= 10 && (
        <button onClick={addQuestion} className="add-button">
          <Add />
          追加
        </button>
      )}
      <div className="buttons">
        <TransparentButton className="cancel-button" onClick={onCancel}>
          キャンセル
        </TransparentButton>
        <Button style={{ height: '40px', minWidth: '100px' }} onClick={post}>
          投稿
        </Button>
      </div>
    </VoteWrap>
  )
}
export default VoteMessageBox

const VoteWrap = styled.div`
  position: absolute;
  width: 400px;
  bottom: calc(100% + 8px);
  background: var(--color-background);
  margin: 4px;
  padding: 16px;
  border: solid 1px var(--color-base);
  border-radius: 3px;
  box-shadow: 0 0 0 1px rgba(4, 4, 5, 0.15);

  h4 {
    margin: 0;
    padding: 10px 0;
  }

  .add-button {
    display: flex;
    justify-content: center;
    align-items: center;
    background-color: transparent;
    border: 1px solid var(--color-on-primary);
    border-radius: 2px;
    color: var(--color-on-primary);
    padding: 2px 8px 2px 4px;
    margin: 8px 0;
  }

  .buttons {
    padding: 16px 0 0 0;
    display: flex;
    justify-content: flex-end;
    border-top: 1px solid var(--color-border);
  }

  .cancel-button {
    margin-right: 8px;
  }
`
