import React from 'react'
import styled from 'styled-components'
import Link from './Link'

const Header = styled.header`
  width: 100vw;
  height: 3em;
  color: var(--color-on-background);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 24px;
  font-weight: 500;
  a {
    color: var(--color-on-background);
  }
`

function Login() {
  return (
    <Header>
      <Link to="/">MZM (β)</Link>
    </Header>
  )
}

export default Login
