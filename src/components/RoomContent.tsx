import React from 'react'
import styled from 'styled-components'
import Menu from './molecules/Menu'
import InputArea from './InputArea'
import Messages from './Messages'
import RoomInfo from './RoomInfo'
import SettingRoom from './SettingRoom'

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

export default function RoomContent({
  expand,
  onExpandClick
}: {
  expand: boolean
  onExpandClick: () => void
}) {
  return (
    <>
      <Content>
        <RoomInfo onExpandClick={onExpandClick} expand={expand} />
        {expand ? <SettingRoom /> : <ContentMessage />}
      </Content>
      <Menu />
    </>
  )
}
