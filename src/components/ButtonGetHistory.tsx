import React, { useCallback } from 'react'
import { connect } from 'react-redux'
import styled from 'styled-components'
import * as actions from '../modules/index'

const Wrap = styled.div`
  width: 100%;
  border-bottom: 1px solid rgba(255, 255, 255, 0.3);
  button {
    width: 100%;
    height: 40px;
    color: #ffffff;
    border-color: transparent;
    background-color: transparent;
  }
`

type Props = {
  oldestId: string
  getHistory: typeof actions.getHistory
}

const ButtonGetHistory: React.FC<Props> = ({ oldestId, getHistory }) => {
  const onClick = useCallback(() => {
    getHistory(oldestId)
  }, [])

  return (
    <Wrap>
      <button onClick={onClick}>過去ログを取得</button>
    </Wrap>
  )
}

export default connect(
  () => ({}),
  {
    getHistory: actions.getHistory
  }
)(ButtonGetHistory)
