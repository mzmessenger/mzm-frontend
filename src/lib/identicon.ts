const crypto = require('crypto')

const patch0 = new Array(0, 4, 24, 20)
const patch1 = new Array(0, 4, 20)
const patch2 = new Array(2, 24, 20)
const patch3 = new Array(0, 2, 20, 22)
const patch4 = new Array(2, 14, 22, 10)
const patch5 = new Array(0, 14, 24, 22)
const patch6 = new Array(2, 24, 22, 13, 11, 22, 20)
const patch7 = new Array(0, 14, 22)
const patch8 = new Array(6, 8, 18, 16)
const patch9 = new Array(4, 20, 10, 12, 2)
const patch10 = new Array(0, 2, 12, 10)
const patch11 = new Array(10, 14, 22)
const patch12 = new Array(20, 12, 24)
const patch13 = new Array(10, 2, 12)
const patch14 = new Array(0, 2, 10)

const patchTypes = new Array(
  patch0,
  patch1,
  patch2,
  patch3,
  patch4,
  patch5,
  patch6,
  patch7,
  patch8,
  patch9,
  patch10,
  patch11,
  patch12,
  patch13,
  patch14,
  patch0
)
const centerPatchTypes = new Array(0, 4, 8, 15)

function render_identicon_patch(
  ctx,
  x,
  y,
  size,
  patch,
  turn,
  invert,
  foreColor,
  backColor
) {
  patch %= patchTypes.length
  turn %= 4
  if (patch == 15) {
    invert = !invert
  }

  const vertices = patchTypes[patch]
  const offset = size / 2
  const scale = size / 4

  ctx.save()

  ctx.fillStyle = invert ? foreColor : backColor
  ctx.fillRect(x, y, size, size)

  ctx.translate(x + offset, y + offset)
  ctx.rotate((turn * Math.PI) / 2)
  ctx.beginPath()
  ctx.moveTo(
    (vertices[0] % 5) * scale - offset,
    Math.floor(vertices[0] / 5) * scale - offset
  )
  for (let i = 1; i < vertices.length; i++)
    ctx.lineTo(
      (vertices[i] % 5) * scale - offset,
      Math.floor(vertices[i] / 5) * scale - offset
    )
  ctx.closePath()

  ctx.fillStyle = invert ? backColor : foreColor
  ctx.fill()

  ctx.restore()
}

function render_identicon(ctx, code, size) {
  const patchSize = size / 3
  const middleType = centerPatchTypes[code & 3]
  const middleInvert = ((code >> 2) & 1) != 0
  const cornerType = (code >> 3) & 15
  const cornerInvert = ((code >> 7) & 1) != 0
  let cornerTurn = (code >> 8) & 3
  const sideType = (code >> 10) & 15
  const sideInvert = ((code >> 14) & 1) != 0
  let sideTurn = (code >> 15) & 3
  const blue = (code >> 16) & 31
  const green = (code >> 21) & 31
  const red = (code >> 27) & 31
  const foreColor =
    'rgb(' + (red << 3) + ',' + (green << 3) + ',' + (blue << 3) + ')'
  const backColor = 'rgb(255,255,255)'

  // middle patch
  render_identicon_patch(
    ctx,
    patchSize,
    patchSize,
    patchSize,
    middleType,
    0,
    middleInvert,
    foreColor,
    backColor
  )

  // side patchs, starting from top and moving clock-wise
  render_identicon_patch(
    ctx,
    patchSize,
    0,
    patchSize,
    sideType,
    sideTurn++,
    sideInvert,
    foreColor,
    backColor
  )
  render_identicon_patch(
    ctx,
    patchSize * 2,
    patchSize,
    patchSize,
    sideType,
    sideTurn++,
    sideInvert,
    foreColor,
    backColor
  )
  render_identicon_patch(
    ctx,
    patchSize,
    patchSize * 2,
    patchSize,
    sideType,
    sideTurn++,
    sideInvert,
    foreColor,
    backColor
  )
  render_identicon_patch(
    ctx,
    0,
    patchSize,
    patchSize,
    sideType,
    sideTurn++,
    sideInvert,
    foreColor,
    backColor
  )

  // corner patchs, starting from top left and moving clock-wise
  render_identicon_patch(
    ctx,
    0,
    0,
    patchSize,
    cornerType,
    cornerTurn++,
    cornerInvert,
    foreColor,
    backColor
  )
  render_identicon_patch(
    ctx,
    patchSize * 2,
    0,
    patchSize,
    cornerType,
    cornerTurn++,
    cornerInvert,
    foreColor,
    backColor
  )
  render_identicon_patch(
    ctx,
    patchSize * 2,
    patchSize * 2,
    patchSize,
    cornerType,
    cornerTurn++,
    cornerInvert,
    foreColor,
    backColor
  )
  render_identicon_patch(
    ctx,
    0,
    patchSize * 2,
    patchSize,
    cornerType,
    cornerTurn++,
    cornerInvert,
    foreColor,
    backColor
  )
}

const icons = new Map<string, string>()

function _gen(str, size, callback) {
  const hash = crypto
    .createHash('sha1')
    .update(str)
    .digest('base64')
  const code =
    (hash.charCodeAt(0) << 24) |
    (hash.charCodeAt(1) << 16) |
    (hash.charCodeAt(2) << 8) |
    hash.charCodeAt(3)

  const canvas = document.createElement('canvas')
  canvas.width = size
  canvas.height = size
  const ctx = canvas.getContext('2d')

  render_identicon(ctx, code, size)

  ctx.getImageData(0, 0, size, size)
  const icon = canvas.toDataURL('image/png')
  icons.set(str, icon)
  callback(null, icon)
}

export default function(str: string, size: number, callback) {
  // @todo webworker
  if (icons.has(str)) {
    return callback(null, icons.get(str))
  }
  return _gen(str, size, callback)
}
