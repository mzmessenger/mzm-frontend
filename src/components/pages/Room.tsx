import React from 'react'
import styled from 'styled-components'
import Body from '../atoms/Body'
import Menu from '../molecules/Menu'
import PageWrapper from '../PageWrapper'
import InputArea from '../InputArea'
import Messages from '../Messages'
import RoomInfo from '../RoomInfo'
import Header from '../Header'

const MessageBody = styled.div`
  display: grid;
  grid-template-rows: 1fr;

  grid-template-areas:
    'room-info'
    'messages'
    'input';
  height: calc(var(--vh, 1vh) * 100 - var(--header-height));

  .messages {
    grid-area: messages;
    overflow: auto;
  }
`
export default function PageRoom() {
  return (
    <PageWrapper>
      <Header style={{ gridArea: 'header' }} />
      <Body>
        <MessageBody>
          <div style={{ gridArea: 'room-info' }}>
            <RoomInfo />
          </div>
          <div className="messages">
            <Messages />
          </div>
          <div style={{ gridArea: 'input' }}>
            <InputArea />
          </div>
        </MessageBody>
      </Body>
      <Menu />
    </PageWrapper>
  )
}
