import React, { useRef, useState, useEffect, useCallback } from 'react'
import styled from 'styled-components'
import Modal, { ModalProps } from '../atoms/Modal'

type Props = ModalProps & {
  image: string
}

const Drag = {
  MOVE: 'move',
  UPPER_LEFT: 'upper-left',
  UPPER_RIGHT: 'upper-right',
  LOWER_LEFT: 'lower-left',
  LOWER_RIGHT: 'lower-right'
} as const
type Drag = typeof Drag[keyof typeof Drag]

const MIN_LENGTH = 100

export default function ModalIconCanvas({ image, open, onClose }: Props) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const imgRef = useRef<HTMLImageElement>(null)
  const wrapperRef = useRef<HTMLDivElement>(null)
  const clipperRef = useRef<HTMLDivElement>(null)
  const [size, setSize] = useState(0)
  const [height, setHeight] = useState(0)
  const [width, setWidth] = useState(0)
  const [clipLength, setClipLength] = useState(0)
  const [drag, setDrag] = useState(false)
  const [dragType, setDragType] = useState<Drag>(Drag.MOVE)
  const [sx, setSx] = useState(0)
  const [sy, setSy] = useState(0)
  const [startClipLength, setStartClipLength] = useState(0)
  const [currentX, setCurrentX] = useState(0)
  const [currentY, setCurrentY] = useState(0)
  const [translate, setTranslate] = useState('')
  const [maxLength, setMaxLength] = useState(0)

  const clipImage = (
    x: number,
    y: number,
    width: number,
    height: number,
    length: number
  ) => {
    canvasRef.current.width = length
    canvasRef.current.height = length
    const ctx = canvasRef.current.getContext('2d')
    ctx.drawImage(imgRef.current, x, y, length, length, 0, 0, length, length)

    const { data } = ctx.getImageData(0, 0, width, height)
    setSize(data.length)
  }

  const onLoad = useCallback(() => {
    const _width = imgRef.current.naturalWidth
    const _height = imgRef.current.naturalHeight
    setHeight(_height)
    setWidth(_width)
    const _maxLength = Math.min(_height, _width)
    setMaxLength(_maxLength)
    const _clipLength = _maxLength * 0.8
    setClipLength(_clipLength)
    clipImage(0, 0, _width, _height, _clipLength)
  }, [])

  // init
  useEffect(() => {
    setDrag(false)
    setSx(0)
    setSy(0)
    setTranslate('')
  }, [open])

  const onMouseDown = (e, drag: Drag) => {
    setDrag(true)
    setDragType(drag)
    setSx(e.pageX)
    setSy(e.pageY)
    setStartClipLength(clipLength)
  }

  const onMouseUp = () => {
    if (!drag) {
      return
    }
    setDrag(false)

    const clipperRect = clipperRef.current.getBoundingClientRect()
    const wrapperRect = wrapperRef.current.getBoundingClientRect()
    const cx = clipperRect.left - wrapperRect.left
    const cy = clipperRect.top - wrapperRect.top
    setCurrentX(cx)
    setCurrentY(cy)

    clipImage(cx, cy, clipLength, clipLength, clipLength)
  }

  useEffect(() => {
    document.documentElement.addEventListener('mouseup', onMouseUp)
    return () => {
      document.documentElement.removeEventListener('mouseup', onMouseUp)
    }
  }, [drag, clipLength])

  const move = (translateX: number, translateY: number, length: number) => {
    if (translateX + length > width) {
      translateX = width - length
    } else if (translateX < 0) {
      translateX = 0
    }

    if (translateY + length > height) {
      translateY = height - length
    } else if (translateY < 0) {
      translateY = 0
    }

    setTranslate(`translateX(${translateX}px) translateY(${translateY}px)`)
  }

  const onMouseMove = e => {
    if (!drag) {
      return
    }

    if (dragType === Drag.MOVE) {
      move(currentX + e.pageX - sx, currentY + e.pageY - sy, clipLength)
    } else if (dragType === Drag.UPPER_LEFT) {
      const dy = e.pageY - sy
      const length = startClipLength - dy
      if (length < MIN_LENGTH || maxLength < length) {
        return
      }

      setClipLength(length)
      move(currentX + dy, currentY + dy, length)
    } else if (dragType === Drag.UPPER_RIGHT) {
      const dy = e.pageY - sy
      const length = startClipLength - dy
      if (length < MIN_LENGTH || maxLength < length) {
        return
      }

      setClipLength(length)
      move(currentX, currentY + dy, length)
    } else if (dragType === Drag.LOWER_LEFT) {
      const dy = e.pageY - sy
      const length = startClipLength + dy
      if (length < MIN_LENGTH || maxLength < length) {
        return
      }

      setClipLength(length)
      move(currentX - dy, currentY, length)
    } else if (dragType === Drag.LOWER_RIGHT) {
      const dy = e.pageY - sy
      const length = startClipLength + dy
      if (length < MIN_LENGTH || maxLength < length) {
        return
      }

      setClipLength(length)
      move(currentX, currentY, length)
    }
  }

  return (
    <Modal open={open} onClose={onClose}>
      <Wrap className={drag ? 'drag' : ''}>
        <div>size: {size}</div>
        <div
          className="canvas-wrap"
          style={{ width, height }}
          ref={wrapperRef}
          onMouseMove={onMouseMove}
        >
          <div
            ref={clipperRef}
            className="clipper"
            style={{
              width: clipLength - 1,
              height: clipLength - 1,
              transform: translate
            }}
          >
            <div className="clipper-inner">
              <div
                className="face"
                onMouseDown={e => onMouseDown(e, Drag.MOVE)}
              />
              <div
                className="point upper-left"
                onMouseDown={e => onMouseDown(e, Drag.UPPER_LEFT)}
              />
              <div
                className="point upper-right"
                onMouseDown={e => onMouseDown(e, Drag.UPPER_RIGHT)}
              />
              <div
                className="point lower-left"
                onMouseDown={e => onMouseDown(e, Drag.LOWER_LEFT)}
              />
              <div
                className="point lower-right"
                onMouseDown={e => onMouseDown(e, Drag.LOWER_RIGHT)}
              />
            </div>
          </div>
          <canvas
            ref={canvasRef}
            style={{
              transform: translate
            }}
          />
          <div className="underlay"></div>
          <img src={image} ref={imgRef} onLoad={onLoad} />
        </div>
      </Wrap>
    </Modal>
  )
}

const Wrap = styled.div`
  padding: 1em;
  border-radius: 3px;
  background-color: var(--color-background);
  color: var(--color-on-background);
  display: flex;
  flex-direction: column;
  justify-content: center;

  &.drag {
    canvas {
      display: none;
    }
  }

  .canvas-wrap {
    margin: 0.5em;
    position: relative;
    img {
      position: absolute;
      z-index: 10;
    }
    .underlay {
      position: absolute;
      width: 100%;
      height: 100%;
      background: rgb(0, 0, 0);
      opacity: 0.5;
      z-index: 50;
    }
    canvas {
      position: absolute;
      z-index: 100;
    }
    .clipper {
      position: absolute;
      border: 1px solid var(--color-border-clipper);
      z-index: 200;
    }
    .clipper-inner {
      position: relative;
      height: 100%;
      width: 100%;

      .face {
        cursor: move;
        position: absolute;
        height: 100%;
        width: 100%;
      }

      .point {
        position: absolute;
        background-color: var(--color-border-clipper);
        --point-length: 8px;
        height: var(--point-length);
        width: var(--point-length);
        --point-diff: calc(var(--point-length) / 2);
      }
      .upper-left {
        cursor: nwse-resize;
        top: calc(0px - var(--point-diff));
        left: calc(0px - var(--point-diff));
      }
      .upper-right {
        cursor: nesw-resize;
        top: calc(0px - var(--point-diff));
        right: calc(0px - var(--point-diff));
      }
      .lower-left {
        cursor: nesw-resize;
        bottom: calc(0px - var(--point-diff));
        left: calc(0px - var(--point-diff));
      }
      .lower-right {
        cursor: nwse-resize;
        bottom: calc(0px - var(--point-diff));
        right: calc(0px - var(--point-diff));
      }
    }
  }
`
