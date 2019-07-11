import React from 'react'
import Body from '../atoms/Body'
import Menu from '../molecules/Menu'
import PageWrapper from '../PageWrapper'
import Header from '../Header'

export default function Index() {
  return (
    <PageWrapper>
      <Header style={{ gridArea: 'header' }} />
      <Body></Body>
      <Menu />
    </PageWrapper>
  )
}
