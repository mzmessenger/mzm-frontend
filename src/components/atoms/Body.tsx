import React from 'react'
import { useSelector } from 'react-redux'
import styled from 'styled-components'
import { State } from '../../modules/index.types'

const Wrap = styled.div`
  grid-area: body;
  background-color: var(--color-background);
  height: 100%;
`

export default function Body({ children }: { children?: any }) {
  const menuStatus = useSelector((state: State) => state.menuStatus)
  const className = menuStatus === 'open' ? 'open' : ''

  return <Wrap className={className}>{children}</Wrap>
}
