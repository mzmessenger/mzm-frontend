import React from 'react'
import styled from 'styled-components'
import { useSelector } from 'react-redux'
import { State } from '../modules/index.types'
import Link from './atoms/Link'

const Wrap = styled.div`
  padding: 8px;
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
  font-size: 18px;
  line-height: 25px;
`

export default function MyInfo() {
  const me = useSelector((state: State) => state.me)
  const icon = useSelector((state: State) => state.icon)

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
