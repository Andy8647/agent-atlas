import type { Cluster, NodeStatus } from '../../lib/types'
import { TreeNode } from './TreeNode'

interface ClusterCardProps {
  cluster: Cluster
  nodeStates: Record<string, NodeStatus>
  onNodeClick: (slug: string) => void
}

export function ClusterCard({ cluster, nodeStates, onNodeClick }: ClusterCardProps) {
  const completed = cluster.nodes.filter((n) => nodeStates[n.slug] === 'completed').length
  const total = cluster.nodes.length

  return (
    <div
      className="rounded-xl border p-6"
      style={{ borderColor: cluster.color + '40', background: 'var(--color-surface)' }}
    >
      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-xl font-bold" style={{ color: cluster.color }}>
          {cluster.title}
        </h2>
        <span className="text-sm" style={{ color: 'var(--color-text-muted)' }}>
          {completed} / {total}
        </span>
      </div>

      {/* Progress bar */}
      <div className="mb-5 h-1.5 w-full overflow-hidden rounded-full" style={{ background: cluster.color + '20' }}>
        <div
          className="h-full rounded-full transition-all duration-500"
          style={{ width: `${(completed / total) * 100}%`, background: cluster.color }}
        />
      </div>

      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {cluster.nodes.map((node) => (
          <TreeNode
            key={node.slug}
            node={node}
            status={nodeStates[node.slug] || 'not-started'}
            clusterColor={cluster.color}
            onClick={() => onNodeClick(node.slug)}
          />
        ))}
      </div>
    </div>
  )
}
