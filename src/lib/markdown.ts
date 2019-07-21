import { wrap } from 'comlink'

const MarkdownWorker = wrap<typeof import('../worker/markdown').Markdown>(
  new Worker('../worker/markdown', { type: 'module' })
)

let markdown = null

export async function convertToHtml(message: string) {
  if (!markdown) markdown = await new MarkdownWorker()

  return await markdown.convertToHtml(message)
}
