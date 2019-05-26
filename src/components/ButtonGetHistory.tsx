import React, { useCallback } from 'react'
import { bindActionCreators } from 'redux'
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
} & ReturnType<typeof mapDispatchToProps>

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

function mapDispatchToProps(dispatch) {
  return bindActionCreators({ getHistory: actions.getHistory }, dispatch)
}

export default connect(
  () => ({}),
  mapDispatchToProps
)(ButtonGetHistory)
