import React, { useState, useEffect } from 'react'
import styled from 'styled-components'
import { useDispatch, useSelector } from 'react-redux'
import { State, store } from '../../modules/index'
import { sendVoteAnswer, removeVoteAnswer } from '../../modules/messages'
import VoteAnswer from './VoteAnswer'
import { VoteAnswerTypeEnum, Message } from '../../type'

const RadioButton = ({ name, value, checked, onClick }: { name: string; value: 0 | 1 | 2, checked: number, onClick: (e) => void }) => {
  const checkedFlg = checked === value
  const type =
    value === 0
      ? VoteAnswerTypeEnum.ok
      : value === 1
      ? VoteAnswerTypeEnum.ng
      : value === 2
      ? VoteAnswerTypeEnum.na : ''

  return (
    <label>
      <input
        type="radio"
        value={value}
        name={name}
        defaultChecked={checkedFlg}
        onClick={onClick}
      />
      <span className={checkedFlg ? 'checked' : ''}>{type}</span>
    </label>
  )
}

const VoteAnswerBar = ({ className, numerator, denominator }: { className?: string, numerator: number, denominator: number }) => {
  return (
    <li
      className={`vote-answer-bar ${className}`}
      style={{ width: `${(numerator/ denominator) * 100 || 0}%` }}
    ></li>
  )
}

const Question = ({
  messageId,
  text,
  index
}: {
  messageId: string
  text: string
  index: number
}) => {
  const dispatch = useDispatch()
  const myId = useSelector((state: State) => state.user.me.id)
  const answers = useSelector((state: State) => state.messages.voteAnswers.byId[messageId][index] ?? [])
  const [checked, setChecked] = useState<number>(null)
  const name = `${text}-${index}`

  const ok = answers.filter((e) => e.answer === 0)
  const ng = answers.filter((e) => e.answer === 1)
  const na = answers.filter((e) => e.answer === 2)

  useEffect(() => {
    setChecked(answers.find((e) => e.userId === myId)?.answer)
  }, [myId, answers])

  const onClickRadio = (e: React.MouseEvent<HTMLInputElement>) => {
    const answer = parseInt((e.target as HTMLInputElement).value, 10)
    if (answer === checked) {
      removeVoteAnswer(messageId, index)(dispatch, store.getState)
      setChecked(null)
    } else {
      const answer = parseInt((e.target as HTMLInputElement).value, 10)
      sendVoteAnswer(messageId, index, answer)(dispatch, store.getState)
      setChecked(answer)
    }
  }

  return (
    <div className="question">
      <form className="question-form">
        <div>
          <p>{text}</p>
        </div>
        <ul className="vote-answer-bar-wrap">
          <VoteAnswerBar
            className="ok"
            numerator={ok.length}
            denominator={answers.length}
          />
          <VoteAnswerBar
            className="ng"
            numerator={ng.length}
            denominator={answers.length}
          />
          <VoteAnswerBar
            className="na"
            numerator={na.length}
            denominator={answers.length}
          />
        </ul>
        <div className="radio-group">
          <RadioButton
            name={name}
            value={0}
            checked={checked}
            onClick={onClickRadio}
          />
          <RadioButton
            name={name}
            value={1}
            checked={checked}
            onClick={onClickRadio}
          />
          <RadioButton
            name={name}
            value={2}
            checked={checked}
            onClick={onClickRadio}
          />
        </div>
      </form>
      <ul className="answers">
        <VoteAnswer type={VoteAnswerTypeEnum.ok} answers={ok} />
        <VoteAnswer type={VoteAnswerTypeEnum.ng} answers={ng} />
        <VoteAnswer type={VoteAnswerTypeEnum.na} answers={na} />
      </ul>
    </div>
  )
}

type Props = {
  className?: string
  messageId: string
  vote?: Message['vote']
}

const MessageVote = ({ messageId, className, vote }: Props) => {
  return (
    <div className={className}>
      {vote.questions.map((q, i) => (
        <Question
          messageId={messageId}
          key={i}
          text={q.text}
          index={i}
        />
      ))}
    </div>
  )
}

export default styled(MessageVote)`
  display: flex;
  min-width: 200px;

  .question {
    min-width: 100px;
    border: 1px solid var(--color-border);
    padding: 0 1em;
    margin: 1em 2em 0 0;
  }

  .question-form {
    display: flex;
    flex-direction: column;
    align-items: center;
  }

  .vote-answer-bar-wrap {
    height: 2px;
    width: 180px;
    background: #e6eaef;
    list-style-type: none;
    position: relative;
    margin: 0;
    padding: 0;
  }

  .vote-answer-bar {
    display: inline-block;
    height: 2px;
    vertical-align: top;
  }

  .vote-answer-bar.ok {
    background: var(--color-vote-ok);
  }
  .vote-answer-bar.ng {
    background: var(--color-vote-ng);
  }
  .vote-answer-bar.na {
    background: var(--color-vote-na);
  }

  .answers {
    list-style: none;
    padding: 0;
    max-width: 240px;
  }

  .radio-group {
    display: inline-flex;
    justify-content: space-between;
    margin: 1rem 0 0 0;
    height: 100%;

    label {
      display: flex;
      align-items: center;
      width: 32px;
      height: 32px;
      margin: 0 1em 0 0;
    }
    label:last-child {
      margin: 0;
    }
    input[type='radio'] {
      display: none;
    }
    span.checked {
      background: #b54a4a;
      text-shadow: 0 0 1px rgba(0, 0, 0, 0.7);
    }
    span {
      cursor: pointer;
      flex: 1;
      display: flex;
      justify-content: center;
      align-items: center;
      border-radius: 3px;
      background: var(--color-background-secondary);
      color: var(--color-on-background-secondary);
      width: 100%;
      height: 100%;
    }
  }
`
