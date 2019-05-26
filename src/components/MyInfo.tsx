import React from 'react'
import { Link } from 'react-router-dom'
import styled from 'styled-components'
import { connect } from 'react-redux'
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

const Icon = styled.img`
  margin: 0 5px 0 0;
  width: 25px;
  height: 25px;
  border-radius: 2px;
`

const Profile = styled.div`
  font-size: 22px;
  line-height: 25px;
`

type Props = ReturnType<typeof mapStateToProps>

const MyInfo: React.FC<Props> = ({ me, icon }) => {
  const m = me ? me.account : ''
  return (
    <Wrap>
      <LinkWrap to="/">
        <Icon src={icon} width="20" height="20" />
        <Profile>{m}</Profile>
      </LinkWrap>
    </Wrap>
  )
}

function mapStateToProps(state: State) {
  return {
    me: state.me,
    icon: state.icon
  }
}

export default connect(mapStateToProps)(MyInfo)
