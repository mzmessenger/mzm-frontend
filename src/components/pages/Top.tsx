import React from 'react'
import { useSelector } from 'react-redux'
import { State } from '../../modules/index'
import PageWrapper from '../PageWrapper'
import TopContent from '../TopContent'
import Settings from '../Settings'

export default function Index() {
  const settings = useSelector<State, unknown>(state => state.user.openSettings)

  return <PageWrapper>{settings ? <Settings /> : <TopContent />}</PageWrapper>
}
