import React from 'react'
import styled from 'styled-components'
import Body from '../atoms/Body'
import Menu from '../molecules/Menu'
import PageWrapper from '../PageWrapper'
import InputArea from '../InputArea'
import Messages from '../Messages'
import RoomInfo from '../RoomInfo'
import Header from '../Header'

const Content = styled.div`
  flex: 1;
  height: 100%;
  display: flex;
  flex-direction: column;

  .messages {
    display: flex;
    flex-direction: column;
    justify-content: flex-end;
    height: 100%;
    .messages-inner {
      max-height: 100%;
      overflow: auto;
    }
  }
`
export default function PageRoom() {
  return (
    <PageWrapper>
      <Header style={{ gridArea: 'header' }} />
      <Body>
        <Content>
          <RoomInfo />
          <div className="messages">
            <Messages className="messages-inner" />
          </div>
          <InputArea />
        </Content>
        <Menu />
      </Body>
    </PageWrapper>
  )
}
