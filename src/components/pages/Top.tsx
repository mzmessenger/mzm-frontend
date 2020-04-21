import React, { lazy } from 'react'
import { useSelector } from 'react-redux'
import { State } from '../../modules/index'
import Menu from '../molecules/Menu'
import PageWrapper from '../templates/PageWrapper'
import TopContent from '../TopContent'

export default function Top() {
  const settings = useSelector((state: State) => state.ui.openSettings)
  const Settings = lazy(() => import('../Settings'))

  return (
    <PageWrapper>
      {settings ? (
        <Settings />
      ) : (
        <>
          <TopContent />
          <Menu />
        </>
      )}
    </PageWrapper>
  )
}
