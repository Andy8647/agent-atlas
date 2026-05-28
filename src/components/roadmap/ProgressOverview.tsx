import type { Cluster } from '../../lib/types'
import { useProgressStore } from '../../store/progressStore'

interface ProgressOverviewProps {
  clusters: Cluster[]
}

export function ProgressOverview({ clusters }: ProgressOverviewProps) {
  const nodes = useProgressStore((s) => s.nodes)

  return (
    <div className="mt-12 rounded-xl border p-6" style={{ borderColor: 'var(--color-border)', background: 'var(--color-surface)' }}>
      <h2 className="mb-4 text-lg font-bold" style={{ color: 'var(--color-text)' }}>
        学习进度总览
      </h2>
      <div className="space-y-3">
        {clusters.map((cluster) => {
          const completed = cluster.nodes.filter((n) => nodes[n.slug] === 'completed').length
          const total = cluster.nodes.length
          const pct = total > 0 ? Math.round((completed / total) * 100) : 0
          return (
            <div key={cluster.id} className="flex items-center gap-3">
              <span className="w-32 text-sm font-medium shrink-0" style={{ color: 'var(--color-text)' }}>
                {cluster.title}
              </span>
              <div className="h-2 flex-1 overflow-hidden rounded-full" style={{ background: 'var(--color-border)' }}>
                <div
                  className="h-full rounded-full transition-all duration-500"
                  style={{ width: `${pct}%`, background: cluster.color }}
                />
              </div>
              <span className="w-12 text-right text-sm shrink-0" style={{ color: 'var(--color-text-muted)' }}>
                {pct}%
              </span>
            </div>
          )
        })}
      </div>
    </div>
  )
}
