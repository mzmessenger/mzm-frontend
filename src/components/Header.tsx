import React from 'react'
import styled from 'styled-components'
import { useSelector, useDispatch } from 'react-redux'
import { State } from '../modules/index'
import { openMenu } from '../modules/ui'
import { WIDTH_MOBILE } from '../lib/constants'
import Link from './atoms/Link'
import MenuIcon from './atoms/MobileMenuIcon'
import MyInfo from './MyInfo'

const Wrap = styled.header`
  height: var(--header-height);
  padding: 0 16px;
  max-width: 100vw;
  display: flex;
  align-items: center;
  color: var(--color-on-surface);
  border-bottom: 1px solid var(--color-border);
  .logo {
    display: flex;
    align-items: center;
    font-size: 16px;
    font-weight: 500;
  }

  & > a {
    display: flex;
    text-decoration: none;
    color: var(--color-on-surface);
  }

  @media (max-width: ${WIDTH_MOBILE}px) {
    padding: 0 8px 0 16px;
  }
`

export default function Header({ style }: { style?: any }) {
  const device = useSelector((state: State) => state.ui.device)

  const dispatch = useDispatch()

  const onClick = () => dispatch(openMenu())

  return (
    <Wrap style={style}>
      <Link className="logo" to="/">
        <div>MZM</div>
      </Link>
      <div style={{ flex: 1 }}></div>
      <MyInfo />
      {device === 'mobile' && <MenuIcon onClick={onClick} />}
    </Wrap>
  )
}
