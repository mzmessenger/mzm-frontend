import React from 'react'
import { useSelector } from 'react-redux'
import styled from 'styled-components'
import { State } from '../../modules/index'
import { WIDTH_MOBILE } from '../../lib/constants'

const Body = ({
  children,
  className
}: {
  children?: React.ReactNode
  className?: string
}) => {
  const menuStatus = useSelector((state: State) => state.ui.menuStatus)
  const classNames = menuStatus === 'open' ? ['open'] : ['']
  if (className) {
    classNames.push(className)
  }

  return <Wrap className={classNames.join(' ')}>{children}</Wrap>
}
export default Body

const Wrap = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  overflow: hidden;

  @media (max-width: ${WIDTH_MOBILE}px) {
    overflow: auto;
  }
`
