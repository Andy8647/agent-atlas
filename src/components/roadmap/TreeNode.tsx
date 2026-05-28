import type { TreeNode as TreeNodeType, NodeStatus } from '../../lib/types'

interface TreeNodeProps {
  node: TreeNodeType
  status: NodeStatus
  clusterColor: string
  onClick: () => void
}

const statusIcon: Record<NodeStatus, string> = {
  'not-started': '○',
  'in-progress': '◐',
  'completed': '●',
}

export function TreeNode({ node, status, clusterColor, onClick }: TreeNodeProps) {
  const isCompleted = status === 'completed'
  const isInProgress = status === 'in-progress'
  const opacity = isCompleted ? 1 : isInProgress ? 0.85 : 0.6

  return (
    <button
      onClick={onClick}
      className="cursor-pointer rounded-lg border p-4 text-left transition-all duration-200 hover:shadow-md"
      style={{
        borderColor: isCompleted || isInProgress ? clusterColor : 'var(--color-border)',
        background: isCompleted
          ? clusterColor + '12'
          : isInProgress
            ? clusterColor + '08'
            : 'var(--color-surface)',
        opacity,
      }}
    >
      <div className="mb-2 flex items-center gap-2">
        <span
          className="text-lg"
          style={{ color: isCompleted || isInProgress ? clusterColor : 'var(--color-text-muted)' }}
        >
          {statusIcon[status]}
        </span>
        <span
          className="text-sm font-semibold"
          style={{ color: isCompleted || isInProgress ? clusterColor : 'var(--color-text)' }}
        >
          {node.title}
        </span>
      </div>
      <p className="text-xs leading-relaxed" style={{ color: 'var(--color-text-muted)' }}>
        {node.summary}
      </p>
      <div className="mt-2 flex items-center gap-2 text-xs" style={{ color: 'var(--color-text-muted)' }}>
        <span>约 {node.estimatedMinutes} 分钟</span>
        {node.prerequisites.length > 0 && (
          <span>· 前置: {node.prerequisites.length} 项</span>
        )}
      </div>
    </button>
  )
}
