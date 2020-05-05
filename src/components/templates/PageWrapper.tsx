import React from 'react'
import { useSelector } from 'react-redux'
import styled from 'styled-components'
import { State } from '../../modules/index'
import Body from '../atoms/Body'
import Header from '../atoms/Header'

const PageWrapper = ({ children }: { children?: React.ReactNode }) => {
  const overlay = useSelector((state: State) => state.ui.overlay)

  return (
    <Wrap>
      <Header />
      <Body>{children}</Body>
      {overlay && <div className="overlay" />}
    </Wrap>
  )
}
export default PageWrapper

const Wrap = styled.div`
  height: 100vh;
  width: 100vw;
  display: flex;
  flex-direction: column;

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
