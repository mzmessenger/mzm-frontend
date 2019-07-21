import React, { useCallback } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import styled from 'styled-components'
import { State } from '../modules/index'
import { getHistory } from '../modules/rooms.action'

const Wrap = styled.div`
  width: 100%;
  button {
    width: 100%;
    height: 40px;
    color: var(--color-on-background);
    border-color: transparent;
    background-color: transparent;
  }
`

export default function ButtonGetHistory({ oldestId }: { oldestId: string }) {
  const currentRoomId = useSelector((state: State) => state.rooms.currentRoomId)
  const socket = useSelector((state: State) => state.socket.socket)
  const onClick = useCallback(() => {
    dispatch(getHistory(oldestId, currentRoomId, socket))
  }, [])

  const dispatch = useDispatch()

  return (
    <Wrap>
      <button onClick={onClick}>過去ログを取得</button>
    </Wrap>
  )
}
