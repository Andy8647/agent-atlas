import { useProgressStore } from '../../store/progressStore'
import { ClusterCard } from './ClusterCard'
import type { Cluster } from '../../lib/types'

interface SkillTreeProps {
  clusters: Cluster[]
  onNodeClick: (slug: string) => void
}

export function SkillTree({ clusters, onNodeClick }: SkillTreeProps) {
  const nodes = useProgressStore((s) => s.nodes)

  return (
    <div className="space-y-8">
      {clusters.map((cluster) => (
        <ClusterCard
          key={cluster.id}
          cluster={cluster}
          nodeStates={nodes}
          onNodeClick={onNodeClick}
        />
      ))}
    </div>
  )
}
