import React from 'react'
import { connect } from 'react-redux'
import { State } from '../modules/index.types'
import Message from './Message'
import GetHistoryButton from './ButtonGetHistory'

function Messages({
  existHistory,
  messages
}: {
  existHistory: boolean
  messages: State['messages']
}) {
  return (
    <div style={{ padding: '0 0 20px 0' }}>
      {messages.length > 0 && existHistory && (
        <GetHistoryButton oldestId={messages[0].id} />
      )}
      {messages.map(m => {
        return (
          <Message
            key={m.id}
            userId={m.userId}
            userAccount={m.userAccount}
            icon={m.icon}
            message={m.message}
            createdAt={m.createdAt}
          />
        )
      })}
    </div>
  )
}

export default connect(
  (state: State) => ({
    existHistory: state.existHistory,
    messages: state.messages
  }),
  {}
)(Messages)
