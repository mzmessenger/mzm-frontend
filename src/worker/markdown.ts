import marked from 'marked'
import { expose } from 'comlink'

const ctx: Worker = self as any

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

export class Markdown {
  convertToHtml(message: string) {
    return new Promise<string>((resolve, reject) => {
      marked(message, { renderer: r }, (err, html) => {
        if (err) {
          reject(err)
          return
        }
        resolve(html)
      })
    })
  }
}

expose(Markdown, ctx)
