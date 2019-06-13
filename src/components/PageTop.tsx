import React, { useCallback } from 'react'
import { connect } from 'react-redux'
import { Body, Right } from '../styles'
import Rooms from './Rooms'
import RoomNavi from './RoomNavi'
import MyInfo from './MyInfo'
import { removeUser } from '../modules/index.action'
import Button from './atoms/Button'

type Props = ReturnType<typeof mapDispatchToProps>

const Index: React.FC<Props> = ({ removeUser }) => {
  const onClick = useCallback(() => {
    if (window.confirm('本当にアカウントを削除しますか？')) {
      removeUser()
    }
  }, [])

  return (
    <>
      <Body>
        <div>
          <a href="/auth/logout">logout</a>
          <Button onClick={onClick}>アカウントの削除</Button>
        </div>
      </Body>
      <Right>
        <MyInfo />
        <RoomNavi />
        <Rooms />
      </Right>
    </>
  )
}

function mapDispatchToProps(dispatch) {
  return {
    removeUser: () => removeUser()(dispatch)
  }
}

export default connect(
  () => ({}),
  mapDispatchToProps
)(Index)
