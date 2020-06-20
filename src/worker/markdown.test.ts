import { Markdown } from './markdown'

test.each([
  [
    'simple link',
    'http://mzm.dev',
    '<p><a href="http://mzm.dev">http:&#x2F;&#x2F;mzm.dev</a></p>'
  ],
  [
    'markdown link',
    '[mzm](https://mzm.dev)',
    '<p><a href="https://mzm.dev">mzm</a></p>'
  ],
  [
    'simple link (top)',
    'http://localhost',
    '<p><a href="http://localhost">http:&#x2F;&#x2F;localhost</a></p>'
  ],
  [
    'simple link (room)',
    'http://localhost/rooms/test',
    '<p><a class="mzm-room-link" href="http://localhost/rooms/test">&#x2F;rooms&#x2F;test</a></p>'
  ],
  [
    'simple  link (room:日本語)',
    'http://localhost/rooms/要望室',
    '<p><a class="mzm-room-link" href="http://localhost/rooms/%E8%A6%81%E6%9C%9B%E5%AE%A4">&#x2F;rooms&#x2F;要望室</a></p>'
  ],
  [
    'markdown link (room)',
    '[localhost](https://localhost/rooms/test)',
    '<p><a href="https://localhost/rooms/test">localhost</a></p>'
  ],
  [
    'marquee',
    '<marquee>aaa</marquee>',
    '<p>&lt;marquee&gt;aaa&lt;&#x2F;marquee&gt;</p>'
  ]
])('convertToHtml (%s)', async (_label, src, converted) => {
  const worker = new Markdown()
  const html = await worker.convertToHtml(src)
  expect(html.trim()).toEqual(converted)
})
