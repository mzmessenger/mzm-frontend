import React from 'react'
import { useSelector } from 'react-redux'
import styled from 'styled-components'
import { WIDTH_MOBILE } from '../lib/constants'
import { State } from '../modules/index'

const Wrap = styled.div`
  height: 100%;
  display: grid;
  grid-template-columns: 1fr var(--menu-width);
  grid-template-rows: var(--header-height) 1fr;
  grid-template-areas:
    'header header'
    'body menu';

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
    grid-template-columns: 100vw 0;
    grid-template-areas:
      'header'
      'body';
  }
`

export default function PageWrapper({ children }) {
  const overlay = useSelector((state: State) => state.user.overlay)

  return (
    <Wrap>
      {children}
      {overlay && <div className="overlay" />}
    </Wrap>
  )
}
