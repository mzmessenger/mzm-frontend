import React, { useRef, useState, useEffect } from 'react'
import styled from 'styled-components'
import Modal from '../atoms/Modal'
import Button from '../atoms/Button'

type Props = {
  image: string
  open: boolean
  onSave: (image: Blob) => void
  onCancel: () => void
}

const Drag = {
  MOVE: 'move',
  UPPER_LEFT: 'upper-left',
  UPPER_RIGHT: 'upper-right',
  LOWER_LEFT: 'lower-left',
  LOWER_RIGHT: 'lower-right'
} as const
type Drag = typeof Drag[keyof typeof Drag]

const MIN_LENGTH = 30
const LIMIT_LENGTH = 400

const getLength = (
  type: Drag,
  startClipLength: number,
  diff: number,
  minLength: number,
  maxLength: number
): number => {
  let length = startClipLength
  if (type === Drag.UPPER_LEFT || type === Drag.UPPER_RIGHT) {
    length = startClipLength - diff
  } else if (type === Drag.LOWER_LEFT || type === Drag.LOWER_RIGHT) {
    length = startClipLength + diff
  }

  if (length < minLength) {
    return minLength
  }
  if (maxLength < length) {
    return maxLength
  }
  return Math.floor(length)
}

const getMoveTo = (
  type: Drag,
  currentX: number,
  currentY: number,
  diff: number
): { x: number; y: number } => {
  switch (type) {
    case Drag.UPPER_LEFT:
      return { x: currentX + diff, y: currentY + diff }
    case Drag.UPPER_RIGHT:
      return { x: currentX, y: currentY + diff }
    case Drag.LOWER_LEFT:
      return { x: currentX + diff, y: currentY }
    case Drag.LOWER_RIGHT:
      return { x: currentX, y: currentY }
  }
  return { x: currentX, y: currentY }
}

export default function ModalIcon({ image, open, onSave, onCancel }: Props) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const sendImgRef = useRef<HTMLCanvasElement>(null)
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
  const [left, setLeft] = useState(0)
  const [top, setTop] = useState(0)
  const [translate, setTranslate] = useState('')
  const [maxLength, setMaxLength] = useState(0)
  const [minLength, setMinLength] = useState(MIN_LENGTH)
  const [scale, setScale] = useState(1)

  const clipImage = (
    x: number,
    y: number,
    sw: number,
    sh: number,
    dw: number,
    dh: number
  ) => {
    canvasRef.current.width = dw
    canvasRef.current.height = dh
    canvasRef.current
      .getContext('2d')
      .drawImage(imgRef.current, x, y, sw, sh, 0, 0, dw, dh)
  }

  const getCurrentPosition = () => {
    const clipperRect = clipperRef.current.getBoundingClientRect()
    const wrapperRect = wrapperRef.current.getBoundingClientRect()
    const left = clipperRect.left - wrapperRect.left
    const top = clipperRect.top - wrapperRect.top
    return { top, left }
  }

  const setSendImg = (length: number, sendScale: number) => {
    const current = getCurrentPosition()
    sendImgRef.current.width = LIMIT_LENGTH
    sendImgRef.current.height = LIMIT_LENGTH
    sendImgRef.current
      .getContext('2d')
      .drawImage(
        imgRef.current,
        current.left / sendScale,
        current.top / sendScale,
        length / sendScale,
        length / sendScale,
        0,
        0,
        LIMIT_LENGTH,
        LIMIT_LENGTH
      )

    sendImgRef.current.toBlob((blob) => {
      setSize(blob.size)
    })
  }

  const onLoad = () => {
    const _width = imgRef.current.naturalWidth
    const _height = imgRef.current.naturalHeight
    let _scale = 1
    if (_width > LIMIT_LENGTH) {
      _scale = Math.floor((LIMIT_LENGTH / _width) * 100) / 100
    }

    setMinLength(_width * 0.1 > MIN_LENGTH ? _width * 0.1 : MIN_LENGTH)

    setHeight(_height * _scale)
    setWidth(_width * _scale)
    setScale(_scale)
    const _maxLength = Math.min(_height, _width) * _scale
    setMaxLength(_maxLength)
    const _clipLength = _maxLength
    setClipLength(_clipLength)
    clipImage(
      0,
      0,
      _clipLength / _scale,
      _clipLength / _scale,
      _clipLength,
      _clipLength
    )
    setSendImg(_clipLength, _scale)
  }

  // init
  useEffect(() => {
    setDrag(false)
    setSx(0)
    setSy(0)
    setTranslate('')
  }, [open])

  const onMouseDown = (e, type: Drag) => {
    setDrag(true)
    setDragType(type)
    setSx(e.pageX)
    setSy(e.pageY)
    setStartClipLength(clipLength)

    const current = getCurrentPosition()
    if (type === Drag.UPPER_LEFT) {
      setMaxLength(
        Math.floor(
          Math.min(clipLength + current.left, clipLength + current.top)
        )
      )
    } else if (type === Drag.UPPER_RIGHT) {
      setMaxLength(
        Math.floor(Math.min(width - current.left, clipLength + current.top))
      )
    } else if (type === Drag.LOWER_LEFT) {
      setMaxLength(
        Math.floor(Math.min(width + current.left, height - current.top))
      )
    } else if (type === Drag.LOWER_RIGHT) {
      setMaxLength(
        Math.floor(Math.min(width - current.left, height - current.top))
      )
    }
  }

  const onMouseUp = () => {
    if (!drag) {
      return
    }
    setDrag(false)

    const current = getCurrentPosition()
    setLeft(current.left)
    setTop(current.top)

    clipImage(
      current.left / scale,
      current.top / scale,
      clipLength / scale,
      clipLength / scale,
      clipLength,
      clipLength
    )
    setSendImg(clipLength, scale)
  }

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

  const onMouseMove = (e) => {
    if (!drag) {
      return
    }

    if (dragType === Drag.MOVE) {
      move(left + e.pageX - sx, top + e.pageY - sy, clipLength)
    } else if (
      dragType === Drag.UPPER_LEFT ||
      dragType === Drag.UPPER_RIGHT ||
      dragType === Drag.LOWER_LEFT ||
      dragType === Drag.LOWER_RIGHT
    ) {
      const diff = e.pageY - sy
      const length = getLength(
        dragType,
        startClipLength,
        diff,
        minLength,
        maxLength
      )
      setClipLength(Math.floor(length))

      const moveTo = getMoveTo(dragType, left, top, startClipLength - length)
      move(moveTo.x, moveTo.y, length)
    }
  }

  useEffect(() => {
    document.documentElement.addEventListener('mousemove', onMouseMove)
    document.documentElement.addEventListener('mouseup', onMouseUp)
    return () => {
      document.documentElement.removeEventListener('mousemove', onMouseMove)
      document.documentElement.removeEventListener('mouseup', onMouseUp)
    }
  }, [drag, clipLength])

  const sendImage = () => {
    sendImgRef.current.toBlob((blob) => onSave(blob))
  }

  const sizeStr =
    size > 1000 * 1000 ? `${size / 1000 / 1000}MB` : `${size / 1000}KB`

  return (
    <Modal open={open} onClose={() => {}}>
      <Wrap className={drag ? 'drag' : ''}>
        <img
          src={image}
          style={{ display: 'none' }}
          ref={imgRef}
          onLoad={onLoad}
        />
        <canvas
          ref={sendImgRef}
          style={{
            width: LIMIT_LENGTH,
            height: LIMIT_LENGTH,
            display: 'none'
          }}
        />
        <div className="canvas-wrap" style={{ width, height }} ref={wrapperRef}>
          <div
            ref={clipperRef}
            className="clipper"
            style={{
              width: clipLength,
              height: clipLength,
              transform: translate
            }}
          >
            <div className="clipper-inner">
              <div
                className="face"
                onMouseDown={(e) => onMouseDown(e, Drag.MOVE)}
              />
              <div
                className="point upper-left"
                onMouseDown={(e) => onMouseDown(e, Drag.UPPER_LEFT)}
              />
              <div
                className="point upper-right"
                onMouseDown={(e) => onMouseDown(e, Drag.UPPER_RIGHT)}
              />
              <div
                className="point lower-left"
                onMouseDown={(e) => onMouseDown(e, Drag.LOWER_LEFT)}
              />
              <div
                className="point lower-right"
                onMouseDown={(e) => onMouseDown(e, Drag.LOWER_RIGHT)}
              />
            </div>
          </div>
          <canvas ref={canvasRef} style={{ transform: translate }} />
          <div className="underlay"></div>
          <img src={image} style={{ width, height }} />
        </div>
        <div className="info">
          <div>
            <h4>width</h4>
            <span>{width}px</span>
          </div>
          <div>
            <h4>height</h4>
            <span>{height}px</span>
          </div>
          <div>
            <h4>scale</h4>
            <span>{scale}</span>
          </div>
          <div>
            <h4>clip</h4>
            <span>{clipLength}px</span>
          </div>
          <div>
            <h4>size</h4>
            <span>{sizeStr}</span>
          </div>
        </div>
        <div className="button">
          <Button className="cancel" onClick={onCancel}>
            キャンセル
          </Button>
          <Button className="send" onClick={sendImage}>
            送信
          </Button>
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

  &.drag {
    canvas {
      display: none;
    }
  }

  .canvas-wrap {
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

  .info {
    margin-top: 0.5em;
    border-top: 1px solid var(--color-border);
    padding: 8px;
    display: grid;
    grid-template-columns: 1fr 1fr 1fr;
    grid-gap: 8px;
  }

  .button {
    border-top: 1px solid var(--color-border);
    padding: 8px 0 0;
    display: flex;
    justify-content: flex-end;
    button {
      width: 100px;
      height: 40px;
    }
    .send {
      margin-left: 8px;
    }
    .cancel {
      border-color: transparent;
      background: none;
    }
  }
`
