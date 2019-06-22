import React, { useState, useCallback } from 'react'
import styled from 'styled-components'
import Add from '@material-ui/icons/Add'
import CreateRoom from './ModalCreateRoom'

const Wrap = styled.div`
  display: flex;
  align-items: center;
  padding: 0 10px;
  height: var(--navi-height);
  align-items: center;
  background-color: hsl(0, 0%, 18.5%);
  color: #8e9297;
  cursor: pointer;
`

export default function RoomNavi() {
  const [modal, setModal] = useState(false)

  const onClose = useCallback(() => {
    setModal(false)
  }, [])

  return (
    <Wrap>
      <div style={{ display: 'flex' }} onClick={() => setModal(true)}>
        <Add style={{ fontSize: '20px', marginRight: '3px' }} />
        <div style={{ fontSize: '16px', lineHeight: '20px' }}>部屋追加</div>
      </div>
      <CreateRoom open={modal} onClose={onClose} />
    </Wrap>
  )
}
