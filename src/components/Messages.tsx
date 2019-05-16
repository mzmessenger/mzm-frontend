import React, { useCallback } from 'react'
import { connect } from 'react-redux'
import * as actions from '../modules/index'
import { State } from '../modules/index.types'
import Message from './Message'

type Props = {
  oldestId: string
  getBeforeMessages: typeof actions.getBeforeMessages
}

const BeforeButton = connect(
  () => ({}),
  {
    getBeforeMessages: actions.getBeforeMessages
  }
)(function({ oldestId, getBeforeMessages }: Props) {
  const onClick = useCallback(() => {
    getBeforeMessages(oldestId)
  }, [])
  return <button onClick={onClick}>before</button>
})

function Messages({ messages }: { messages: State['messages'] }) {
  return (
    <div style={{ padding: '0 10px 20px 0' }}>
      {messages.length >= 20 && <BeforeButton oldestId={messages[0].id} />}
      {messages.map(m => {
        return (
          <Message
            key={m.id}
            userId={m.userId}
            userAccount={m.userAccount}
            message={m.message}
            createdAt={m.createdAt}
          />
        )
      })}
    </div>
  )
}

export default connect(
  (state: State) => ({ messages: state.messages }),
  {}
)(Messages)
