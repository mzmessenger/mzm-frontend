import React from 'react'
import styled from 'styled-components'
import Clear from '@material-ui/icons/Clear'
import { useSelector, useDispatch } from 'react-redux'
import { State } from '../modules/index'
import { closeUserDetail } from '../modules/ui'

const UserDetail = () => {
  const userDetail = useSelector((state: State) => state.ui.userDetail)
  const dispatch = useDispatch()

  const close = () => {
    dispatch(closeUserDetail())
  }

  return (
    <Wrap>
      <header>
        <Clear onClick={close} />
      </header>
      <div className="icon">
        <img src={userDetail.icon} />
      </div>
      <div className="account">
        <div>{userDetail.account}</div>
      </div>
    </Wrap>
  )
}
export default UserDetail

const Wrap = styled.div`
  background-color: var(--color-surface);
  color: var(--color-on-surface);
  border-top: 1px solid var(--color-border);
  border-right: 1px solid var(--color-border);
  border-left: 1px solid var(--color-border);
  padding: 0 8px;
  display: flex;
  flex-direction: column;

  header {
    margin-top: 4px;
    display: flex;
    justify-content: flex-end;
  }

  .icon {
    margin-top: 8px;
    display: flex;
    justify-content: center;
    img {
      width: 128px;
      height: 128px;
    }
  }

  .account {
    margin-top: 8px;
    div {
      font-size: 1.7em;
    }
  }
`
