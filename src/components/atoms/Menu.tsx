import React, { useState } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import styled from 'styled-components'
import Settings from '@material-ui/icons/Settings'
import { WIDTH_MOBILE } from '../../lib/constants'
import { State } from '../../modules/index'
import { closeMenu, openSettings } from '../../modules/ui'
import ResizerX from '../atoms/ResizerX'
import MenuIcon from './MobileMenuIcon'
import Rooms from '../Rooms'
import RoomNavi from '../RoomNavi'
import SearchInput from '../SearchInput'
import SearchResult from '../SearchResults'

const WIDTH_KEY = 'mzm:menu:width'
const MIN_WIDTH = 240

const Menu = () => {
  const dispatch = useDispatch()
  const menuStatus = useSelector((state: State) => state.ui.menuStatus)
  const device = useSelector((state: State) => state.ui.device)
  const query = useSelector((state: State) => state.search.query)
  const className = menuStatus === 'open' ? 'menu open' : 'menu'
  const [width, _setWidth] = useState(
    localStorage.getItem(WIDTH_KEY)
      ? parseInt(localStorage.getItem(WIDTH_KEY), 10)
      : MIN_WIDTH
  )

  const setWidth = (w: number) => {
    if (w < MIN_WIDTH) {
      w = MIN_WIDTH
    }
    _setWidth(w)
    localStorage.setItem(WIDTH_KEY, `${w}`)
  }
  const isMobile = device === 'mobile'
  const onClickMenu = () => dispatch(closeMenu())
  const clickSettings = () => dispatch(openSettings())

  return (
    <Wrap className={className} style={{ width: isMobile ? MIN_WIDTH : width }}>
      <ResizerX
        style={{ display: isMobile ? 'none' : '' }}
        width={width}
        setWidth={setWidth}
      />
      <div className="wrapper">
        <header className="header">
          <MenuIcon onClick={onClickMenu} />
          <div className="space"></div>
          <Settings className="settings" onClick={clickSettings} />
        </header>
        <SearchInput />
        <div className="contents">
          {query && <SearchResult />}
          {!query && (
            <>
              <RoomNavi />
              <Rooms />
            </>
          )}
        </div>
      </div>
    </Wrap>
  )
}
export default Menu

const Wrap = styled.div`
  max-width: 50%;
  min-width: 300px;
  height: 100%;
  display: flex;

  > .wrapper {
    flex: 1;
    color: var(--color-on-surface);
    width: 100%;
    height: 100%;
    display: flex;
    flex-direction: column;
  }

  .header {
    height: var(--header-height);
    display: flex;
    justify-content: flex-end;
    align-items: center;
    display: none;
  }

  .contents {
    flex: 1;
    display: flex;
    flex-direction: column;
    overflow: hidden;
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
      display: flex;
      border-bottom: 1px solid var(--color-border);
      .space {
        flex: 1;
      }
      .settings {
        padding: 8px;
      }
    }
  }
`
