import React from 'react'
import { useSelector } from 'react-redux'
import styled from 'styled-components'
import { State } from '../modules/index'

const Wrap = styled.div`
  height: 100%;
  display: grid;
  grid-template-rows: var(--header-height) 1fr;
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
