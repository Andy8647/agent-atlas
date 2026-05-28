import { readFileSync, readdirSync, writeFileSync } from 'node:fs'
import { join } from 'node:path'

const ARTICLES_DIR = 'content/articles'

// Full prerequisite graph (~31 edges)
// Structure: what-is-agent is root → chains branch out within and across clusters
const PREREQ_MAP = {
  // Cluster 1: Agent 基础概念
  'what-is-agent': [],
  'workflow-vs-agent': ['what-is-agent'],
  'agent-architecture': ['workflow-vs-agent'],

  // Cluster 2: 单Agent推理范式
  'react-core': ['agent-architecture'],
  'react-failures': ['react-core'],
  'plan-and-solve': ['react-core'],
  'tree-of-thoughts': ['plan-and-solve'],
  'reflexion': ['react-failures'],

  // Cluster 3: 工具与记忆
  'function-calling': ['react-core'],
  'toolformer': ['function-calling'],
  'aci': ['function-calling'],
  'memory-basics': ['react-core'],
  'memgpt': ['memory-basics', 'function-calling'],

  // Cluster 4: 上下文工程
  'context-engineering': ['memory-basics'],
  'context-design': ['context-engineering'],
  'long-running-techniques': ['context-design', 'memgpt'],
  'context-failure-modes': ['long-running-techniques'],
  'context-fixes-evidence': ['context-failure-modes'],

  // Cluster 5: 多Agent与工程落地
  'multi-agent-debate': ['reflexion', 'context-engineering'],
  'harness-overview': ['agent-architecture', 'function-calling', 'reflexion'],
  'harness-loop': ['harness-overview'],
  'harness-tools-context': ['harness-loop', 'aci'],
  'harness-agents-safety': ['harness-tools-context'],
  'evaluation': ['harness-loop'],
  'prompt-caching-infra': ['harness-loop', 'context-engineering'],
}

const files = readdirSync(ARTICLES_DIR).filter(f => f.endsWith('.mdx'))
let updated = 0

for (const file of files) {
  const filePath = join(ARTICLES_DIR, file)
  let content = readFileSync(filePath, 'utf-8')
  const slugMatch = content.match(/^---\n[\s\S]*?slug:\s*"([^"]+)"/m)
  if (!slugMatch) {
    console.warn(`Skipping ${file}: no slug found`)
    continue
  }
  const slug = slugMatch[1]
  const prereqs = PREREQ_MAP[slug]
  if (!prereqs) {
    console.warn(`Skipping ${file}: no prereq mapping for slug "${slug}"`)
    continue
  }

  const yamlPrereqs = prereqs.length > 0
    ? `[${prereqs.map(p => `"${p}"`).join(', ')}]`
    : '[]'

  // Replace or add prerequisites line in frontmatter
  if (content.match(/^prerequisites:/m)) {
    content = content.replace(/^prerequisites:.*$/m, `prerequisites: ${yamlPrereqs}`)
  } else {
    // Insert after slug line
    content = content.replace(/^(slug:.*)$/m, `$1\nprerequisites: ${yamlPrereqs}`)
  }

  writeFileSync(filePath, content, 'utf-8')
  console.log(`Updated ${file}: prerequisites = [${prereqs.join(', ')}]`)
  updated++
}

console.log(`\nUpdated ${updated} files`)
