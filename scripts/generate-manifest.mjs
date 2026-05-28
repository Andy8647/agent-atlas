import { readFileSync, readdirSync, writeFileSync } from 'node:fs'
import { join } from 'node:path'

const ARTICLES_DIR = 'content/articles'
const TREE_OUTPUT = 'src/content/tree.ts'

function parseFrontmatter(content) {
  const match = content.match(/^---\n([\s\S]*?)\n---/)
  if (!match) return null
  const fm = {}
  for (const line of match[1].split('\n')) {
    // Only parse top-level keys (no leading whitespace). Skip nested YAML lines.
    if (/^\s/.test(line) || line.startsWith('-')) continue
    const colon = line.indexOf(':')
    if (colon === -1) continue
    const key = line.slice(0, colon).trim()
    let value = line.slice(colon + 1).trim()
    // Skip empty values (these belong to nested structures we don't care about)
    if (value === '') continue
    // Parse JSON arrays
    if (value.startsWith('[') && value.endsWith(']')) {
      try { value = JSON.parse(value) } catch { /* keep as string */ }
    }
    // Remove quotes
    if (typeof value === 'string' && value.startsWith('"') && value.endsWith('"')) {
      value = value.slice(1, -1)
    }
    fm[key] = value
  }
  return fm
}

const articles = []
const files = readdirSync(ARTICLES_DIR).filter(f => f.endsWith('.mdx'))

for (const file of files) {
  const content = readFileSync(join(ARTICLES_DIR, file), 'utf-8')
  const fm = parseFrontmatter(content)
  if (!fm || !fm.slug) {
    console.warn(`Skipping ${file}: missing slug in frontmatter`)
    continue
  }
  articles.push({
    ...fm,
    file,
    prerequisites: Array.isArray(fm.prerequisites) ? fm.prerequisites : [],
    widgets: Array.isArray(fm.widgets) ? fm.widgets : [],
    estimatedMinutes: Number(fm.estimatedMinutes) || 10,
    order: Number(fm.order) || 99,
  })
}

articles.sort((a, b) => a.order - b.order)

// Reconstruct clusters from article frontmatter
const clusterMap = new Map()
for (const a of articles) {
  if (!clusterMap.has(a.cluster)) {
    clusterMap.set(a.cluster, [])
  }
  clusterMap.get(a.cluster).push(a)
}

// Catppuccin Mocha cluster colors
const CLUSTER_META = {
  foundations: { title: 'Agent 基础概念', color: '#cba6f7' },               // mauve
  'single-agent-reasoning': { title: '单 Agent 推理范式', color: '#fab387' }, // peach
  'tools-and-memory': { title: '工具与记忆', color: '#a6e3a1' },              // green
  'context-engineering': { title: '上下文工程', color: '#89b4fa' },           // blue
  'multi-agent-production': { title: '多 Agent 与工程落地', color: '#f5c2e7' }, // pink
}

const clusters = []
for (const [id, nodes] of clusterMap) {
  const meta = CLUSTER_META[id] || { title: id, color: '#6366f1' }
  clusters.push({
    id,
    title: meta.title,
    color: meta.color,
    nodes: nodes.map(n => ({
      slug: n.slug,
      title: n.title,
      order: n.order,
      prerequisites: n.prerequisites,
      estimatedMinutes: n.estimatedMinutes,
      summary: n.summary || '',
    })),
  })
}

clusters.sort((a, b) => {
  const minA = Math.min(...a.nodes.map(n => n.order))
  const minB = Math.min(...b.nodes.map(n => n.order))
  return minA - minB
})

// Generate tree.ts
const treeTs = `import type { TreeData } from '../lib/types'

export const treeData: TreeData = ${JSON.stringify({ clusters }, null, 2)}
`

writeFileSync(TREE_OUTPUT, treeTs, 'utf-8')
console.log(`Generated ${TREE_OUTPUT} with ${articles.length} articles in ${clusters.length} clusters`)
console.log(`Articles: ${articles.map(a => a.slug).join(', ')}`)
