import React, { useRef, useState } from 'react'
import styled from 'styled-components'
import { useSelector, useDispatch } from 'react-redux'
import CancelIcon from '@material-ui/icons/Cancel'
import Modal, { ModalProps } from './atoms/Modal'
import { State, store } from '../modules/index'
import { getNextUsers } from '../modules/rooms'

type Props = ModalProps & { roomId: string }

const ModalUsersList = ({ open, onClose, roomId }: Props) => {
  const dispatch = useDispatch()
  const users = useSelector((state: State) => state.rooms.users.byId[roomId])
  const [loading, setLoading] = useState(false)
  const timerRef = useRef(0)
  const listWrapRef = useRef<HTMLUListElement>(null)
  const listBottomRef = useRef<HTMLLIElement>(null)

  const list = (users?.users || []).map((e) => (
    <li key={e.userId}>
      <img src={e.icon} className="icon" />
      {e.account}
    </li>
  ))

  const onScroll = () => {
    if (loading) {
      return
    }
    clearTimeout(timerRef.current)
    timerRef.current = setTimeout(() => {
      const wrapRect = listWrapRef.current.getBoundingClientRect()
      const bottomRect = listBottomRef.current.getBoundingClientRect()
      const margin = 10
      if (bottomRect.top - wrapRect.bottom <= margin) {
        setLoading(true)
        getNextUsers(roomId)(dispatch, store.getState).then(() =>
          setLoading(false)
        )
      }
    }, 300)
  }

  return (
    <Modal open={open} onClose={onClose}>
      <ModalInner>
        <header>
          <h4>入室中ユーザー</h4>
          <CancelIcon className="cancel" onClick={onClose} />
        </header>
        <div className="count">{users?.count || 0}</div>
        <div className="users" onScroll={onScroll}>
          <ul ref={listWrapRef}>
            {list}
            <li className="last" ref={listBottomRef}></li>
          </ul>
        </div>
      </ModalInner>
    </Modal>
  )
}
export default ModalUsersList

const ModalInner = styled.form`
  width: 440px;
  border-radius: 3px;
  background-color: var(--color-background);
  color: var(--color-on-background);
  padding: 20px;

  header {
    display: flex;
    h4 {
      margin: 0;
      flex: 1;
    }
    .cancel {
      cursor: pointer;
    }
  }

  .count {
    display: flex;
    justify-content: flex-end;
    padding: 0.5em 0.2em 0.5em 0;
    border-bottom: 1px solid var(--color-border);
  }

  .users {
    ul {
      list-style-type: none;
      margin: 0;
      padding: 0;
      max-height: 400px;
      overflow: auto;
      > li {
        padding: 1em 0 1em;
        display: flex;
        border-bottom: 1px solid var(--color-border);
      }
      > li.last {
        visibility: hidden;
      }
    }
    .icon {
      padding-left: 3px;
      width: 20px;
      height: 20px;
      margin: 0 1em 0 0;
    }
  }
`
