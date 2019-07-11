import React from 'react'
import ListIcon from '@material-ui/icons/List'
import styled from 'styled-components'

const Wrap = styled.header`
  padding: 10px;
  cursor: pointer;
`

export default function MobileMenuIcon({
  className,
  onClick
}: {
  className?: string
  onClick
}) {
  return (
    <Wrap className={className} onClick={onClick}>
      <ListIcon />
    </Wrap>
  )
}
