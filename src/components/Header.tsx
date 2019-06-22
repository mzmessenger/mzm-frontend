import React from 'react'
import styled from 'styled-components'
import Link from './atoms/Link'
import MyInfo from './MyInfo'

const Wrap = styled.header`
  background-color: var(--color-surface);
  display: flex;
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
  return (
    <Wrap style={style}>
      <LinkWrap className="logo" to="/">
        <div>MZM</div>
      </LinkWrap>
      <div style={{ flex: 1 }}></div>
      <MyInfo />
    </Wrap>
  )
}
