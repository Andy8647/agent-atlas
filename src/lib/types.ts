export type NodeStatus = 'not-started' | 'in-progress' | 'completed'

export interface TreeNode {
  slug: string
  title: string
  order: number
  prerequisites: string[]
  estimatedMinutes: number
  summary: string
}

export interface Cluster {
  id: string
  title: string
  color: string
  nodes: TreeNode[]
}

export interface TreeData {
  clusters: Cluster[]
}

export interface ArticleMeta {
  slug: string
  title: string
  cluster: string
  order: number
  prerequisites: string[]
  estimatedMinutes: number
  summary: string
  widgets: string[]
  updated: string
}
