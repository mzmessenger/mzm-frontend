import React from 'react'
import styled from 'styled-components'
import { Body, Right } from '../styles'
import InputArea from './InputArea'
import Messages from './Messages'
import Rooms from './Rooms'
import RoomNavi from './RoomNavi'
import RoomInfo from './RoomInfo'
import Header from './Header'

const MessageBody = styled(Body)`
  grid-template-areas:
    'room-info'
    'messages'
    'input';
  height: calc(100vh - var(--header-height));

  .messages {
    grid-area: messages;
    overflow: auto;
  }
`
export default function SelectedRoom() {
  return (
    <>
      <div style={{ gridArea: 'header' }}>
        <Header />
      </div>
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
      <Right>
        <RoomNavi />
        <Rooms />
      </Right>
    </>
  )
}
