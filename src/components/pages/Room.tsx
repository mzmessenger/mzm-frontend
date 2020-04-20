import React from 'react'
import { useSelector } from 'react-redux'
import { State } from '../../modules/index'
import Menu from '../molecules/Menu'
import RoomContent from '../molecules/RoomContent'
import PageWrapper from '../templates/PageWrapper'
import Settings from '../Settings'
import UserDetail from '../UserDetail'

export default function PageRoom() {
  const settings = useSelector((state: State) => state.ui.openSettings)
  const openUserDetail = useSelector((state: State) => state.ui.openUserDetail)

  return (
    <PageWrapper>
      {settings ? (
        <Settings />
      ) : (
        <>
          <RoomContent />
          <Menu />
        </>
      )}
      {openUserDetail && <UserDetail />}
    </PageWrapper>
  )
}
