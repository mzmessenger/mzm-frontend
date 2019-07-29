import React from 'react'
import { useSelector, useDispatch } from 'react-redux'
import styled from 'styled-components'
import { WIDTH_MOBILE } from '../../lib/constants'
import { State } from '../../modules/index'
import { closeMenu } from '../../modules/user.action'
import MenuIcon from '../atoms/MobileMenuIcon'
import Rooms from '../Rooms'
import RoomNavi from '../RoomNavi'

const Wrap = styled.div`
  background-color: var(--color-surface);
  width: var(--menu-width);
  color: var(--color-on-surface);

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
    width: var(--mobile-menu-width);
    position: absolute;
    top: 0;
    right: 0;
    bottom: 0;
    transform: translate3d(100%, 0, 0);
    z-index: var(--z-index-on-overlay);

    .header {
      display: block;
    }
  }
`

export default function Menu() {
  const menuStatus = useSelector((state: State) => state.user.menuStatus)
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
