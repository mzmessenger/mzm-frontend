import React, { useCallback } from 'react'
import { useDispatch } from 'react-redux'
import { Body, Right } from '../styles'
import Rooms from './Rooms'
import RoomNavi from './RoomNavi'
import Header from './Header'
import { removeUser } from '../modules/index.action'
import Button from './atoms/Button'

export default function Index() {
  const dispatch = useDispatch()

  const onClick = useCallback(() => {
    if (window.confirm('本当にアカウントを削除しますか？')) {
      removeUser()(dispatch)
    }
  }, [dispatch])

  return (
    <>
      <div style={{ gridArea: 'header' }}>
        <Header />
      </div>
      <Body>
        <div>
          <a href="/auth/logout">logout</a>
          <Button onClick={onClick}>アカウントの削除</Button>
        </div>
      </Body>
      <Right>
        <RoomNavi />
        <Rooms />
      </Right>
    </>
  )
}
