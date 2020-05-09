import React, { useRef, useEffect } from 'react'
import { useSelector } from 'react-redux'
import styled from 'styled-components'
import { State } from '../modules/index'
import { getHistory } from '../modules/rooms'
import Message from './Message'

const Messages = ({ className }) => {
  const currentRoomId = useSelector((state: State) => state.rooms.currentRoomId)
  const currentRoom = useSelector(
    (state: State) => state.rooms.rooms.byId[currentRoomId]
  )
  const scrollTargetIndex = useSelector(
    (state: State) => state.rooms.scrollTargetIndex
  )
  const socket = useSelector((state: State) => state.socket.socket)
  const wrapRef = useRef<HTMLDivElement>(null)
  const bottomRef = useRef<HTMLDivElement>(null)
  const topRef = useRef<HTMLDivElement>(null)
  const timerRef = useRef(0)

  const messages = currentRoom?.messages || []

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

  const onScroll = () => {
    if (!logFlg) {
      return
    }
    clearTimeout(timerRef.current)
    timerRef.current = setTimeout(() => {
      const wrapRect = wrapRef.current.getBoundingClientRect()
      const topRect = topRef.current.getBoundingClientRect()
      const margin = 10
      if (wrapRect.top - topRect.bottom <= margin) {
        const oldestId = currentRoom.messages[0]
        getHistory(oldestId, currentRoomId, socket)
      }
    }, 300)
  }

  return (
    <Wrap ref={wrapRef} className={className} onScroll={onScroll}>
      <div ref={topRef} style={{ visibility: 'hidden' }} />
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
