import React, { useRef, useEffect } from 'react'
import { useSelector } from 'react-redux'
import styled from 'styled-components'
import { State } from '../modules/index'
import Message from './Message'
import GetHistoryButton from './ButtonGetHistory'

const Messages = ({ className }) => {
  const currentRoomId = useSelector((state: State) => state.rooms.currentRoomId)
  const currentRoom = useSelector(
    (state: State) => state.rooms.rooms.byId[currentRoomId]
  )
  const scrollTargetIndex = useSelector(
    (state: State) => state.rooms.scrollTargetIndex
  )
  const wrapRef = useRef(null)
  const bottomRef = useRef(null)

  const messages = currentRoom ? currentRoom.messages : []

  const logFlg = messages.length > 0 && currentRoom.existHistory

  const messageElements = messages.map((m) => {
    return (
      <div className="message" key={m}>
        <Message id={m} />
      </div>
    )
  })

  useEffect(() => {
    if (!scrollTargetIndex) {
      return
    }
    if (scrollTargetIndex === 'bottom') {
      bottomRef.current.scrollIntoView()
    } else if (typeof scrollTargetIndex === 'number') {
      const target = logFlg ? scrollTargetIndex + 1 : scrollTargetIndex
      const dom = wrapRef.current.querySelector(`.message:nth-child(${target})`)
      if (dom) {
        dom.scrollIntoView()
      }
    }
  }, [messages.length, scrollTargetIndex])

  return (
    <Wrap ref={wrapRef} className={className}>
      {logFlg && <GetHistoryButton oldestId={currentRoom.messages[0]} />}
      {messageElements}
      <div ref={bottomRef} style={{ visibility: 'hidden' }} />
    </Wrap>
  )
}
export default Messages

const Wrap = styled.div`
  .message {
    background: var(--color-background);
    margin: 4px;
    :first-child {
      margin-top: 0;
    }
    :last-child {
      margin-bottom: 0;
    }
  }
`
