import React from 'react'
import { useSelector } from 'react-redux'
import styled from 'styled-components'
import InputArea from '../InputArea'
import Messages from '../Messages'
import RoomInfo from './RoomInfo'
import SettingRoom from './SettingRoom'
import { State } from '../../modules/index'

const ContentMessage = () => {
  return (
    <>
      <div className="messages">
        <Messages className="messages-inner" />
      </div>
      <InputArea />
    </>
  )
}

export default function RoomContent() {
  const expand = useSelector((state: State) => state.rooms.openRoomSetting)

  return (
    <Wrap>
      <RoomInfo />
      {expand ? <SettingRoom /> : <ContentMessage />}
    </Wrap>
  )
}

const Wrap = styled.div`
  flex: 1;
  height: 100%;
  display: flex;
  flex-direction: column;

  .messages {
    display: flex;
    overflow: hidden;
    flex-direction: column;
    justify-content: flex-end;
    height: 100%;
    background: var(--color-base);
    .messages-inner {
      overflow: auto;
    }
  }
`
