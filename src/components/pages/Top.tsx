import React from 'react'
import { useSelector } from 'react-redux'
import { State } from '../../modules/index'
import Menu from '../molecules/Menu'
import PageWrapper from '../templates/PageWrapper'
import TopContent from '../TopContent'
import Settings from '../Settings'

export default function Index() {
  const settings = useSelector((state: State) => state.ui.openSettings)

  return (
    <PageWrapper>
      {settings ? <Settings /> : <TopContent />}
      <Menu />
    </PageWrapper>
  )
}
