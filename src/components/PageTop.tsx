import React from 'react'
import { Body, Right } from '../styles'
import Rooms from './Rooms'
import RoomNavi from './RoomNavi'
import MyInfo from './MyInfo'

export default function Index() {
  return (
    <>
      <Body>
        <a href="/auth/logout">logout</a>
      </Body>
      <Right>
        <MyInfo />
        <RoomNavi />
        <Rooms />
      </Right>
    </>
  )
}
