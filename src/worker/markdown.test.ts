import { Markdown } from './markdown'

test.each([
  [
    'http://localhost\n[localhost](https://localhost)',
    '<p><a href="http://localhost">http:&#x2F;&#x2F;localhost</a>\n<a href="https://localhost">localhost</a></p>'
  ],
  ['<marquee>aaa</marquee>', '<p>&lt;marquee&gt;aaa&lt;&#x2F;marquee&gt;</p>']
])('convertToHtml', async (src, converted) => {
  const worker = new Markdown()
  const html = await worker.convertToHtml(src)
  expect(html.trim()).toEqual(converted)
})
