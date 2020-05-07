import React, { lazy, useState } from 'react'
import { useSelector } from 'react-redux'
import { State } from '../../modules/index'
import Menu from '../atoms/Menu'
import ResizerX from '../atoms/ResizerX'
import RoomContent from '../RoomContent'
import PageWrapper from '../templates/PageWrapper'
import UserDetail from '../UserDetail'

const WIDTH_KEY = 'mzm:menu:width'
const MIN_WIDTH = 240

const PageRoom = () => {
  const settings = useSelector((state: State) => state.ui.openSettings)
  const openUserDetail = useSelector((state: State) => state.ui.openUserDetail)
  const device = useSelector((state: State) => state.ui.device)
  const [width, _setWidth] = useState(
    localStorage.getItem(WIDTH_KEY)
      ? parseInt(localStorage.getItem(WIDTH_KEY), 10)
      : MIN_WIDTH
  )
  const setWidth = (w: number) => {
    _setWidth(w)
    localStorage.setItem(WIDTH_KEY, `${w}`)
  }
  const Settings = lazy(() => import('../Settings'))
  const isMobile = device === 'mobile'

  return (
    <PageWrapper>
      {settings ? (
        <Settings />
      ) : (
        <>
          <RoomContent />
          <ResizerX
            style={{ display: isMobile ? 'none' : '' }}
            width={width}
            setWidth={setWidth}
          />
          <Menu style={{ minWidth: isMobile ? MIN_WIDTH : width }} />
        </>
      )}
      {openUserDetail && <UserDetail />}
    </PageWrapper>
  )
}

export default PageRoom
