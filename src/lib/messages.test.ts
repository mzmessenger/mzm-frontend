import { convertToHtml } from './messages'

test('convertToHtml', async () => {
  const html = await convertToHtml(
    'http://localhost\n[localhost](https://localhost)'
  )
  expect(html).toEqual(
    '<p><a href="http://localhost">http://localhost</a>\n<a href="https://localhost">localhost</a></p>'
  )
})
