import edge from 'edge.js'
import markdown from '#utils/markdown'

edge.global('markdown', (value: string) => {
  return edge.globals.html.safe(markdown.render(value))
})
