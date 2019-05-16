import React from 'react'
import styled from 'styled-components'
import { Body, Right } from '../styles'
import InputArea from './InputArea'
import Messages from './Messages'
import Rooms from './Rooms'
import RoomNavi from './RoomNavi'
import RoomInfo from './RoomInfo'
import MyInfo from './MyInfo'

const MessageBody = styled(Body)`
  grid-template-areas:
    'room-info'
    'messages'
    'input';

  .messages {
    grid-area: messages;
    overflow: auto;
  }
`
export default function SelectedRoom() {
  return (
    <>
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
        <MyInfo />
        <RoomNavi />
        <Rooms />
      </Right>
    </>
  )
}
