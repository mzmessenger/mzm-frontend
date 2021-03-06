import React, { useState, useRef } from 'react'
import styled from 'styled-components'

const ResizerY = ({
  height,
  setHeight
}: {
  height: number
  setHeight: (h: number) => void
}) => {
  const timerRef = useRef(0)
  const [defaultHeight, setDefault] = useState(height)
  const [diff, setDiff] = useState(0)
  const [startY, setStartY] = useState(0)

  const onDragStart = (e: React.DragEvent) => setStartY(e.pageY)

  const onDrag = (e: React.DragEvent) => {
    if (e.clientY !== 0) {
      const currentDiff = startY - e.pageY
      if (diff !== currentDiff) {
        setDiff(currentDiff)
        clearTimeout(timerRef.current)
        timerRef.current = setTimeout(() => {
          setHeight(defaultHeight + currentDiff)
        }, 5)
      }
    }
  }
  const onDragEnd = () => {
    const current = defaultHeight + diff
    setDefault(current)
    setHeight(current)
  }

  return (
    <Wrap
      draggable={true}
      onDragStart={onDragStart}
      onDrag={onDrag}
      onDragEnd={onDragEnd}
    ></Wrap>
  )
}
export default ResizerY

const Wrap = styled.div`
  width: 100%;
  height: 8px;
  cursor: row-resize;
  content: '';
  background: 0 0;
  opacity: 0;
`
