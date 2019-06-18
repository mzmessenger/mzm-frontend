import React from 'react'
import { useSelector } from 'react-redux'
import styled from 'styled-components'
import { State } from '../modules/index.types'
import Message from './Message'
import GetHistoryButton from './ButtonGetHistory'

const Wrap = styled.div`
  .message {
    margin: 2px;
    :first-child {
      margin-top: 0;
    }
    :last-child {
      margin-bottom: 0;
    }
  }
`

export default function Messages() {
  const existHistory = useSelector((state: State) => state.existHistory)
  const messages = useSelector((state: State) => state.messages)

  return (
    <Wrap>
      {messages.length > 0 && existHistory && (
        <GetHistoryButton oldestId={messages[0].id} />
      )}
      {messages.map(m => {
        return (
          <div className="message" key={m.id}>
            <Message
              userId={m.userId}
              userAccount={m.userAccount}
              icon={m.icon}
              message={m.message}
              createdAt={m.createdAt}
            />
          </div>
        )
      })}
    </Wrap>
  )
}
