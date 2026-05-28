import { visit } from 'unist-util-visit'

// Match [[slug]] or [[slug|alias]]
const WIKILINK_RE = /\[\[([^\]|]+)(?:\|([^\]]+))?\]\]/g

/**
 * Remark plugin: convert [[slug]] and [[slug|alias]] into hash-router links
 * pointing at /#/article/slug. Works on text nodes only.
 */
export default function remarkWikilink() {
  return (tree) => {
    visit(tree, 'text', (node, index, parent) => {
      if (!parent || typeof index !== 'number' || !node.value.includes('[[')) return

      const children = []
      let lastIndex = 0
      let match
      WIKILINK_RE.lastIndex = 0

      while ((match = WIKILINK_RE.exec(node.value)) !== null) {
        const [full, slug, alias] = match
        const label = alias || slug

        if (match.index > lastIndex) {
          children.push({ type: 'text', value: node.value.slice(lastIndex, match.index) })
        }

        children.push({
          type: 'link',
          url: `#/article/${slug.trim()}`,
          data: { hProperties: { className: 'wikilink' } },
          children: [{ type: 'text', value: label.trim() }],
        })

        lastIndex = match.index + full.length
      }

      if (children.length === 0) return

      if (lastIndex < node.value.length) {
        children.push({ type: 'text', value: node.value.slice(lastIndex) })
      }

      parent.children.splice(index, 1, ...children)
      return index + children.length
    })
  }
}
