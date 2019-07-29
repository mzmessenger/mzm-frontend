import React, { useState } from 'react'
import styled from 'styled-components'
import Body from '../atoms/Body'
import Menu from '../molecules/Menu'
import PageWrapper from '../PageWrapper'
import InputArea from '../InputArea'
import Messages from '../Messages'
import RoomInfo from '../RoomInfo'
import Header from '../Header'
import SettingRoom from '../SettingRoom'

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

function ContentMessage() {
  return (
    <>
      <div className="messages">
        <Messages className="messages-inner" />
      </div>
      <InputArea />
    </>
  )
}

export default function PageRoom() {
  const [setting, setSetting] = useState(false)

  const onExpandClick = () => {
    setSetting(!setting)
  }

  return (
    <PageWrapper>
      <Header style={{ gridArea: 'header' }} />
      <Body>
        <Content>
          <RoomInfo onExpandClick={onExpandClick} expand={setting} />
          {setting ? <SettingRoom /> : <ContentMessage />}
        </Content>
        <Menu />
      </Body>
    </PageWrapper>
  )
}
