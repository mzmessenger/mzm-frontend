import React from 'react'
import { connect } from 'react-redux'
import styled from 'styled-components'
import { State } from '../modules/index.types'
import Message from './Message'
import GetHistoryButton from './ButtonGetHistory'

type Props = ReturnType<typeof mapStateToProps>

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

const Messages: React.FC<Props> = ({ existHistory, messages }) => {
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

function mapStateToProps(state: State) {
  return {
    existHistory: state.existHistory,
    messages: state.messages
  }
}

export default connect(mapStateToProps)(Messages)
