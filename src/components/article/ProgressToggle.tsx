import { useProgressStore } from '../../store/progressStore'
import type { NodeStatus } from '../../lib/types'

interface ProgressToggleProps {
  slug: string
}

const labels: Record<NodeStatus, string> = {
  'not-started': '标记为学习中',
  'in-progress': '标记为已掌握',
  'completed': '取消标记',
}

const icons: Record<NodeStatus, string> = {
  'not-started': '○',
  'in-progress': '◐',
  'completed': '●',
}

export function ProgressToggle({ slug }: ProgressToggleProps) {
  const status = useProgressStore((s) => s.nodes[slug] || 'not-started')
  const toggle = useProgressStore((s) => s.toggleNodeStatus)

  return (
    <button
      onClick={() => toggle(slug)}
      className="cursor-pointer rounded-full border px-3 py-1 text-xs font-medium transition-all hover:opacity-80"
      style={{
        borderColor: status === 'not-started' ? 'var(--color-border)' : 'var(--color-primary)',
        color: status === 'not-started' ? 'var(--color-text-muted)' : 'var(--color-primary)',
        background: status === 'not-started' ? 'transparent' : 'var(--color-primary-light)',
      }}
    >
      {icons[status]} {labels[status]}
    </button>
  )
}
