import dagre from 'dagre'
import type { Cluster } from './types'

const NODE_WIDTH = 140
const NODE_HEIGHT = 120

export interface LayoutNode {
  id: string
  type: string
  position: { x: number; y: number }
  data: {
    slug: string
    title: string
    summary: string
    clusterId: string
    clusterColor: string
    estimatedMinutes: number
    order: number
  }
}

export interface LayoutEdge {
  id: string
  source: string
  target: string
  animated?: boolean
  style?: Record<string, string | number>
}

export function getTreeLayout(clusters: Cluster[]): { nodes: LayoutNode[]; edges: LayoutEdge[] } {
  // Compound graph — dagre will keep cluster members closer together
  const g = new dagre.graphlib.Graph({ compound: true })
  g.setDefaultEdgeLabel(() => ({}))
  g.setGraph({
    rankdir: 'TB',
    nodesep: 60,
    ranksep: 100,
    marginx: 80,
    marginy: 80,
    ranker: 'network-simplex',
  })

  // Add cluster meta-nodes (invisible) and attach each leaf node as their child
  for (const cluster of clusters) {
    g.setNode(`cluster-${cluster.id}`, {})
    for (const node of cluster.nodes) {
      g.setNode(node.slug, { width: NODE_WIDTH, height: NODE_HEIGHT })
      g.setParent(node.slug, `cluster-${cluster.id}`)
    }
  }

  // Prerequisite edges
  for (const cluster of clusters) {
    for (const node of cluster.nodes) {
      for (const prereq of node.prerequisites) {
        g.setEdge(prereq, node.slug)
      }
    }
  }

  dagre.layout(g)

  const layoutNodes: LayoutNode[] = []
  const layoutEdges: LayoutEdge[] = []
  const seenEdges = new Set<string>()

  for (const cluster of clusters) {
    for (const node of cluster.nodes) {
      const pos = g.node(node.slug)
      if (!pos) continue

      layoutNodes.push({
        id: node.slug,
        type: 'skill',
        position: {
          x: pos.x - NODE_WIDTH / 2,
          y: pos.y - NODE_HEIGHT / 2,
        },
        data: {
          slug: node.slug,
          title: node.title,
          summary: node.summary,
          clusterId: cluster.id,
          clusterColor: cluster.color,
          estimatedMinutes: node.estimatedMinutes,
          order: node.order,
        },
      })

      for (const prereq of node.prerequisites) {
        const edgeKey = `${prereq}->${node.slug}`
        if (!seenEdges.has(edgeKey)) {
          seenEdges.add(edgeKey)
          // Mark cross-cluster edges separately
          const prereqCluster = clusters.find((c) => c.nodes.some((n) => n.slug === prereq))?.id
          const crossCluster = prereqCluster && prereqCluster !== cluster.id
          layoutEdges.push({
            id: edgeKey,
            source: prereq,
            target: node.slug,
            animated: false,
            style: {
              stroke: crossCluster ? '#6c7086' : '#cba6f7', // overlay0 for cross, mauve for within
              strokeWidth: crossCluster ? 1 : 1.5,
              opacity: crossCluster ? 0.45 : 0.85,
            },
          })
        }
      }
    }
  }

  return { nodes: layoutNodes, edges: layoutEdges }
}
