import React from 'react'
import { useSelector } from 'react-redux'
import styled from 'styled-components'
import { State } from '../modules/index'
import { getHistory } from '../modules/rooms'

const ButtonGetHistory = ({ oldestId }: { oldestId: string }) => {
  const currentRoomId = useSelector((state: State) => state.rooms.currentRoomId)
  const socket = useSelector((state: State) => state.socket.socket)
  const onClick = () => {
    getHistory(oldestId, currentRoomId, socket)
  }

  return (
    <Wrap>
      <button onClick={onClick}>過去ログを取得</button>
    </Wrap>
  )
}
export default ButtonGetHistory

const Wrap = styled.div`
  width: 100%;
  button {
    width: 100%;
    height: 40px;
    color: var(--color-on-background);
    border-color: transparent;
    background-color: transparent;
    border-bottom: 1px solid var(--color-border);
  }
`
