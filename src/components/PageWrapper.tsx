import React from 'react'
import styled from 'styled-components'

const Wrap = styled.div`
  height: 100%;
  display: grid;
  grid-template-columns: 1fr 240px;
  grid-template-rows: var(--header-height) 1fr;
  grid-template-areas:
    'header header'
    'body right';
`

export default function PageWrapper({ children }) {
  return <Wrap>{children}</Wrap>
}
