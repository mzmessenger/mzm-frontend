import React, { useCallback } from 'react'
import { useDispatch } from 'react-redux'
import styled from 'styled-components'
import { getHistory } from '../modules/index.action'

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
  const onClick = useCallback(() => {
    dispatch(getHistory(oldestId))
  }, [])

  const dispatch = useDispatch()

  return (
    <Wrap>
      <button onClick={onClick}>過去ログを取得</button>
    </Wrap>
  )
}
