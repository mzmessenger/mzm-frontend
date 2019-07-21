import React, { useRef, useEffect } from 'react'
import { useSelector } from 'react-redux'
import styled from 'styled-components'
import { State } from '../modules/index'
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
  const existHistory = useSelector(
    (state: State) => state.rooms.currentRoomExistHistory
  )
  const messages = useSelector(
    (state: State) => state.rooms.currentRoomMessages
  )
  const scrollBottomMessage = useSelector(
    (state: State) => state.rooms.scrollBottomMessage
  )
  const bottomRef = useRef(null)

  const logFlg = messages.length > 0 && existHistory

  const messageElements = messages.map(m => {
    const iconUrl = m.iconUrl ? m.iconUrl : null
    return (
      <div className="message" key={m.id}>
        <Message
          userId={m.userId}
          userAccount={m.userAccount}
          iconUrl={iconUrl}
          message={m.message}
          html={m.html}
          createdAt={m.createdAt}
        />
      </div>
    )
  })

  useEffect(() => {
    if (scrollBottomMessage) {
      bottomRef.current.scrollIntoView()
    }
  }, [messages])

  return (
    <Wrap>
      {logFlg && <GetHistoryButton oldestId={messages[0].id} />}
      {messageElements}
      <div ref={bottomRef} style={{ visibility: 'hidden' }} />
    </Wrap>
  )
}
