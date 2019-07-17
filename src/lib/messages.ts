import marked from 'marked'
import createDOMPurify from 'dompurify'
const DOMPurify = createDOMPurify(window)

const r = new marked.Renderer()

// ignore
r.heading = text => text
r.html = text => text
r.heading = text => text
r.hr = () => ''
r.list = text => text
r.listitem = text => text
r.table = text => text
r.tablerow = text => text
r.tablecell = text => text

r.em = text => text
r.codespan = text => text
r.br = () => ''
r.image = text => text
r.text = text => text

// todo: worker

export async function convertToHtml(message: string): Promise<string> {
  const html = marked(message, { renderer: r })
  const sanitize = DOMPurify.sanitize(html)
  return sanitize.trim()
}
