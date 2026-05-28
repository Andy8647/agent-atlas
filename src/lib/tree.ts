import type { Cluster, TreeNode } from './types'

export function getNodeBySlug(clusters: Cluster[], slug: string): TreeNode | undefined {
  for (const c of clusters) {
    const found = c.nodes.find((n) => n.slug === slug)
    if (found) return found
  }
  return undefined
}

export function getPrerequisites(clusters: Cluster[], slug: string): TreeNode[] {
  const node = getNodeBySlug(clusters, slug)
  if (!node || node.prerequisites.length === 0) return []
  return node.prerequisites
    .map((p) => getNodeBySlug(clusters, p))
    .filter(Boolean) as TreeNode[]
}

export function getNextNodes(clusters: Cluster[], slug: string): TreeNode[] {
  const result: TreeNode[] = []
  for (const c of clusters) {
    for (const n of c.nodes) {
      if (n.prerequisites.includes(slug)) {
        result.push(n)
      }
    }
  }
  return result
}

export function getClusterForNode(clusters: Cluster[], slug: string): Cluster | undefined {
  return clusters.find((c) => c.nodes.some((n) => n.slug === slug))
}

export function getAllSlugs(clusters: Cluster[]): string[] {
  return clusters.flatMap((c) => c.nodes.map((n) => n.slug))
}
