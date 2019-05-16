import React, { useMemo } from 'react'
import { Link } from 'react-router-dom'
import styled from 'styled-components'
import { connect } from 'react-redux'
import Person from '@material-ui/icons/Person'
import * as actions from '../modules/index'
import { State } from '../modules/index.types'

const Wrap = styled.div`
  padding: 20px 10px 20px;
`
const LinkWrap = styled(Link)`
  display: flex;
  text-decoration: none;
  color: #8e9297;
  :visited {
    color: #8e9297;
  }
`

const Profile = styled.div`
  font-size: 22px;
  line-height: 25px;
`

const MyInfo: React.FC<{
  me: State['me']
  getMyInfo: ReturnType<typeof actions.getMyInfo>
}> = ({ me, getMyInfo }) => {
  const m = me ? me.account : ''
  useMemo(() => {
    getMyInfo()
  }, [])
  return (
    <Wrap>
      <LinkWrap to="/">
        <Person style={{ margin: '0 5px 0 0' }} />
        <Profile>{m}</Profile>
      </LinkWrap>
    </Wrap>
  )
}

export default connect(
  (state: State) => ({
    me: state.me
  }),
  dispatch => {
    return {
      getMyInfo: actions.getMyInfo(dispatch)
    }
  }
)(MyInfo)
