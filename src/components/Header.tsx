import React from 'react'
import styled from 'styled-components'
import { useSelector, useDispatch } from 'react-redux'
import { State } from '../modules/index'
import { openMenu } from '../modules/user.action'
import Link from './atoms/Link'
import MenuIcon from './atoms/MobileMenuIcon'
import MyInfo from './MyInfo'

const Wrap = styled.header`
  background-color: var(--color-surface);
  max-width: 100vw;
  display: flex;
  align-items: center;
  color: var(--color-on-surface);
  .logo {
    display: flex;
    align-items: center;
    padding: 0 16px;
    font-size: 16px;
    font-weight: 500;
  }
`

const LinkWrap = styled(Link)`
  display: flex;
  text-decoration: none;
  color: var(--color-on-surface);
`

export default function Header({ style }: { style?: any }) {
  const device = useSelector((state: State) => state.user.device)

  const dispatch = useDispatch()

  const onClick = () => dispatch(openMenu())

  return (
    <Wrap style={style}>
      <LinkWrap className="logo" to="/">
        <div>MZM</div>
      </LinkWrap>
      <div style={{ flex: 1 }}></div>
      {device === 'pc' ? <MyInfo /> : <MenuIcon onClick={onClick} />}
    </Wrap>
  )
}
