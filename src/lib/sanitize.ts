import createDOMPurify from 'dompurify'
const DOMPurify = createDOMPurify(self)

export function sanitize(html: string) {
  const sanitize = DOMPurify.sanitize(html)
  return sanitize.trim()
}
