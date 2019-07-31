import React, { useState } from 'react'
import { useSelector } from 'react-redux'
import { State } from '../../modules/index'
import RoomContent from '../RoomContent'
import PageWrapper from '../PageWrapper'
import Settings from '../Settings'

export default function PageRoom() {
  const [roomSetting, setRoomSetting] = useState(false)
  const settings = useSelector((state: State) => state.user.openSettings)

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
    </PageWrapper>
  )
}
