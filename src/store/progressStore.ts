import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { NodeStatus } from '../lib/types'

interface ProgressState {
  nodes: Record<string, NodeStatus>
  toggleNodeStatus: (slug: string) => void
  setNodeStatus: (slug: string, status: NodeStatus) => void
  resetAll: () => void
}

export const useProgressStore = create<ProgressState>()(
  persist(
    (set, get) => ({
      nodes: {},
      toggleNodeStatus: (slug: string) => {
        const current = get().nodes[slug] || 'not-started'
        const next: NodeStatus =
          current === 'not-started'
            ? 'in-progress'
            : current === 'in-progress'
              ? 'completed'
              : 'not-started'
        set({ nodes: { ...get().nodes, [slug]: next } })
      },
      setNodeStatus: (slug: string, status: NodeStatus) =>
        set({ nodes: { ...get().nodes, [slug]: status } }),
      resetAll: () => set({ nodes: {} }),
    }),
    { name: 'agent-course-progress' }
  )
)
