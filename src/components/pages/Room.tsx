import React, { useState } from 'react'
import { useSelector } from 'react-redux'
import { State } from '../../modules/index'
import Menu from '../molecules/Menu'
import RoomContent from '../RoomContent'
import PageWrapper from '../templates/PageWrapper'
import Settings from '../Settings'
import UserDetail from '../UserDetail'

export default function PageRoom() {
  const [roomSetting, setRoomSetting] = useState(false)
  const settings = useSelector((state: State) => state.ui.openSettings)
  const openUserDetail = useSelector((state: State) => state.ui.openUserDetail)

  const onExpandClick = () => {
    setRoomSetting(!roomSetting)
  }

  return (
    <PageWrapper>
      {settings ? (
        <Settings />
      ) : (
        <RoomContent expand={roomSetting} onExpandClick={onExpandClick} />
      )}
      {openUserDetail && <UserDetail />}
      <Menu />
    </PageWrapper>
  )
}
