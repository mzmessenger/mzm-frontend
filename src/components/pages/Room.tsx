import React, { lazy } from 'react'
import { useSelector } from 'react-redux'
import { State } from '../../modules/index'
import Menu from '../atoms/Menu'
import RoomContent from '../RoomContent'
import PageWrapper from '../templates/PageWrapper'
import UserDetail from '../UserDetail'

const PageRoom = () => {
  const settings = useSelector((state: State) => state.ui.openSettings)
  const openUserDetail = useSelector((state: State) => state.ui.openUserDetail)

  const Settings = lazy(() => import('../Settings'))

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

export default PageRoom
