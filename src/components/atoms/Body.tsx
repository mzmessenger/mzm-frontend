import React from 'react'
import { useSelector } from 'react-redux'
import styled from 'styled-components'
import { State } from '../../modules/index'

const Wrap = styled.div`
  grid-area: body;
  background-color: var(--color-background);
  height: calc(var(--vh, 1vh) * 100 - var(--header-height));
  width: 100%;
  display: flex;
`

export default function Body({
  children,
  className
}: {
  children?: any
  className?: string
}) {
  const menuStatus = useSelector((state: State) => state.ui.menuStatus)
  const classNames = menuStatus === 'open' ? ['open'] : ['']
  if (className) {
    classNames.push(className)
  }

  return <Wrap className={classNames.join(' ')}>{children}</Wrap>
}
