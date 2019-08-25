import React from 'react'
import { useSelector } from 'react-redux'
import styled from 'styled-components'
import { WIDTH_MOBILE } from '../../lib/constants'
import { State } from '../../modules/index'
import Body from '../atoms/Body'
import Header from '../Header'

const Wrap = styled.div`
  height: 100%;
  display: grid;
  grid-template-areas:
    'header'
    'body';

  .overlay {
    position: fixed;
    right: 0px;
    bottom: 0px;
    top: 0px;
    left: 0px;
    background-color: hsl(0, 0%, 7%);
    opacity: 0.5;
    z-index: var(--z-index-overlay);
  }

  @media (max-width: ${WIDTH_MOBILE}px) {
    display: flex;
    flex-direction: column;
  }
`

export default function PageWrapper({ children }) {
  const overlay = useSelector((state: State) => state.ui.overlay)

  return (
    <Wrap>
      <Header style={{ gridArea: 'header' }} />
      <Body>{children}</Body>
      {overlay && <div className="overlay" />}
    </Wrap>
  )
}
