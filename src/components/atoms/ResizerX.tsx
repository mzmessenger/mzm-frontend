import React, { useState, useRef } from 'react'
import styled from 'styled-components'

const ResizerX = ({
  width,
  setWidth
}: {
  width: number
  setWidth: (w: number) => void
}) => {
  const timerRef = useRef(0)
  const [defaultWidth, setDefault] = useState(width)
  const [diff, setDiff] = useState(0)
  const [startX, setStartX] = useState(0)

  const onDragStart = (e: React.DragEvent) => setStartX(e.pageX)

  const onDrag = (e: React.DragEvent) => {
    if (e.clientX !== 0) {
      const currentDiff = startX - e.pageX
      if (diff !== currentDiff) {
        setDiff(currentDiff)
        clearTimeout(timerRef.current)
        timerRef.current = setTimeout(() => {
          setWidth(defaultWidth + currentDiff)
        }, 5)
      }
    }
  }
  const onDragEnd = () => {
    const current = defaultWidth + diff
    setDefault(current)
    setWidth(current)
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
export default ResizerX

const Wrap = styled.div`
  width: 8px;
  height: 100%;
  cursor: col-resize;
  content: '';
  background: 0 0;
  opacity: 0;
`
