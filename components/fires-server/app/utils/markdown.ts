import markdownit from 'markdown-it'

// enable everything
const md = markdownit({
  html: false,
  linkify: true,
  typographer: true,
})

md.linkify.set({ fuzzyEmail: false })

function render(markdown?: string): string | undefined {
  if (markdown === undefined || markdown === null) return undefined
  return md.render(markdown)
}

export default {
  render,
}
