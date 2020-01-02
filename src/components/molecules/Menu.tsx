import React from 'react'
import { useSelector, useDispatch } from 'react-redux'
import styled from 'styled-components'
import { WIDTH_MOBILE } from '../../lib/constants'
import { State } from '../../modules/index'
import { closeMenu } from '../../modules/ui'
import MenuIcon from '../atoms/MobileMenuIcon'
import Rooms from '../Rooms'
import RoomNavi from '../RoomNavi'

const Wrap = styled.div`
  width: var(--menu-width);
  color: var(--color-on-surface);
  border-left: 1px solid var(--color-border);

  .header {
    height: var(--header-height);
    display: flex;
    justify-content: flex-end;
    align-items: center;
    display: none;
  }

  &.open {
    transform: translate3d(0, 0, 0);
  }

  @media (max-width: ${WIDTH_MOBILE}px) {
    background: var(--color-background);
    width: var(--mobile-menu-width);
    position: absolute;
    top: 0;
    right: 0;
    bottom: 0;
    transform: translate3d(100%, 0, 0);
    transition-duration: 0.3s;
    z-index: var(--z-index-on-overlay);

    .header {
      display: block;
      border-bottom: 1px solid var(--color-border);
    }
  }
`

export default function Menu() {
  const menuStatus = useSelector((state: State) => state.ui.menuStatus)
  const className = menuStatus === 'open' ? 'open' : ''

  const dispatch = useDispatch()

  const onClick = () => dispatch(closeMenu())

  return (
    <Wrap className={className}>
      <div className="header">
        <MenuIcon onClick={onClick} />
      </div>
      <RoomNavi />
      <Rooms />
    </Wrap>
  )
}
