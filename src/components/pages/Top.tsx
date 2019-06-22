import React from 'react'
import Body from '../atoms/Body'
import Right from '../atoms/Right'
import PageWrapper from '../PageWrapper'
import Rooms from '../Rooms'
import RoomNavi from '../RoomNavi'
import Header from '../Header'

export default function Index() {
  return (
    <PageWrapper>
      <Header style={{ gridArea: 'header' }} />
      <Body></Body>
      <Right>
        <RoomNavi />
        <Rooms />
      </Right>
    </PageWrapper>
  )
}
