import { Markdown } from './markdown'

test('convertToHtml', async () => {
  const worker = new Markdown()
  const html = await worker.convertToHtml(
    'http://localhost\n[localhost](https://localhost)'
  )
  expect(html.trim()).toEqual(
    '<p><a href="http://localhost">http://localhost</a>\n<a href="https://localhost">localhost</a></p>'
  )
})
