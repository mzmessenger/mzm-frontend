import marked from 'marked'
import { escape } from 'validator'
import { expose } from 'comlink'

// bundle size
import highlight from 'highlight.js/lib/highlight'
import shell from 'highlight.js/lib/languages/shell'
import javascript from 'highlight.js/lib/languages/javascript'
import css from 'highlight.js/lib/languages/css'
highlight.registerLanguage('shell', shell)
highlight.registerLanguage('javascript', javascript)
highlight.registerLanguage('css', css)

const ctx: Worker = self as any

const r = new marked.Renderer()

const escapeTxt = text => escape(text)

// ignore
r.heading = escapeTxt
r.html = escapeTxt
r.heading = escapeTxt
r.hr = () => ''
r.list = escapeTxt
r.listitem = escapeTxt
r.table = escapeTxt
r.tablerow = escapeTxt
r.tablecell = escapeTxt

r.em = escapeTxt
r.codespan = escapeTxt
r.br = () => ''
r.image = escapeTxt
r.text = escapeTxt

r.code = (code, lang) => {
  lang = lang ? lang : 'bash'
  return [
    '<pre>',
    `<code class="hljs">${highlight.highlightAuto(code, [lang]).value}</code>`,
    '</pre>'
  ].join('')
}

// markedで取りこぼしたものをescape
function postEscape(str: string) {
  return str.replace(/<marquee[^\s]+marquee>/g, match => {
    return escape(match)
  })
}

export class Markdown {
  convertToHtml(message: string) {
    return new Promise<string>((resolve, reject) => {
      marked(message, { renderer: r }, (err, html) => {
        if (err) {
          reject(err)
          return
        }
        html = postEscape(html)
        resolve(html)
      })
    })
  }
}

expose(Markdown, ctx)
