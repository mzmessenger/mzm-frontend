import React from 'react'
import ListIcon from '@material-ui/icons/List'
import styled from 'styled-components'

const MobileMenuIcon = ({
  className,
  onClick
}: {
  className?: string
  onClick
}) => {
  return (
    <Wrap className={className} onClick={onClick}>
      <ListIcon />
    </Wrap>
  )
}
export default MobileMenuIcon

const Wrap = styled.header`
  padding: 8px;
  cursor: pointer;
`
