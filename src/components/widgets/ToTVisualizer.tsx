import { useState, useEffect, useRef } from 'react'
import * as d3 from 'd3'

interface TotNode {
  id: string
  expression: string
  value: number | null
  pruned: boolean
  children: string[]
}

interface TotData {
  title: string
  nodes: Record<string, TotNode>
  root: string
}

const gameOf24Data: TotData = {
  title: 'Game of 24: 4, 9, 10, 13',
  root: 'start',
  nodes: {
    start: { id: 'start', expression: '4, 9, 10, 13', value: null, pruned: false, children: ['n1', 'n2', 'n3'] },
    n1: { id: 'n1', expression: '13 - 9 = 4\n→ 4, 4, 10', value: 0.5, pruned: false, children: ['n1a', 'n1b'] },
    n2: { id: 'n2', expression: '10 - 4 = 6\n→ 9, 13, 6', value: 0.7, pruned: false, children: ['n2a'] },
    n3: { id: 'n3', expression: '13 - 10 = 3\n→ 4, 9, 3', value: 0.3, pruned: true, children: [] },
    n1a: { id: 'n1a', expression: '10 - 4 = 6\n→ 4, 6', value: 0.4, pruned: true, children: [] },
    n1b: { id: 'n1b', expression: '4 × 10 = 40\n→ 4, 40', value: 0.3, pruned: true, children: [] },
    n2a: { id: 'n2a', expression: '13 - 9 = 4\n→ 4, 6', value: 1.0, pruned: false, children: ['n2a1'] },
    n2a1: { id: 'n2a1', expression: '4 × 6 = 24 ✓', value: 1.0, pruned: false, children: [] },
  },
}

export function ToTVisualizer() {
  const svgRef = useRef<SVGSVGElement>(null)
  const [step, setStep] = useState(0)
  const data = gameOf24Data

  const visibleNodes = new Set<string>()
  const bfsOrder = ['start', 'n1', 'n2', 'n3', 'n1a', 'n1b', 'n2a', 'n2a1']
  for (let i = 0; i <= step && i < bfsOrder.length; i++) {
    visibleNodes.add(bfsOrder[i])
  }

  useEffect(() => {
    if (!svgRef.current) return
    const svg = d3.select(svgRef.current)
    svg.selectAll('*').remove()

    const width = svgRef.current.clientWidth || 600

    const positions: Record<string, [number, number]> = {
      start: [width / 2, 40],
      n1: [width / 2 - 200, 110],
      n2: [width / 2, 110],
      n3: [width / 2 + 180, 110],
      n1a: [width / 2 - 280, 190],
      n1b: [width / 2 - 120, 190],
      n2a: [width / 2, 190],
      n2a1: [width / 2, 270],
    }

    const g = svg.append('g')

    // Edges
    for (const [id, node] of Object.entries(data.nodes)) {
      if (!visibleNodes.has(id)) continue
      for (const childId of node.children) {
        if (!visibleNodes.has(childId)) continue
        const from = positions[id]
        const to = positions[childId]
        if (!from || !to) continue
        g.append('line')
          .attr('x1', from[0]).attr('y1', from[1] + 20)
          .attr('x2', to[0]).attr('y2', to[1] - 20)
          .attr('stroke', 'var(--color-border)')
          .attr('stroke-width', 1.5)
      }
    }

    // Nodes
    for (const [id, node] of Object.entries(data.nodes)) {
      if (!visibleNodes.has(id)) continue
      const pos = positions[id]
      if (!pos) continue

      const isRoot = id === 'start'
      const isSolution = id === 'n2a1'
      const isPruned = node.pruned

      // Background
      g.append('rect')
        .attr('x', pos[0] - 70)
        .attr('y', pos[1] - 20)
        .attr('width', 140)
        .attr('height', 40)
        .attr('rx', 6)
        .attr('fill', isSolution ? '#ecfdf5' : isPruned ? '#fef2f2' : isRoot ? '#e0e7ff' : 'var(--color-surface)')
        .attr('stroke', isSolution ? '#10b981' : isPruned ? '#fca5a5' : isRoot ? '#c7d2fe' : 'var(--color-border)')
        .attr('stroke-width', isSolution ? 2 : 1)

      // Text
      const textEl = g.append('text')
        .attr('x', pos[0])
        .attr('y', pos[1] + 5)
        .attr('text-anchor', 'middle')
        .attr('fill', isPruned ? '#991b1b' : 'var(--color-text)')
        .style('font-size', '10px')
        .style('font-family', 'monospace')

      node.expression.split('\n').forEach((line, i) => {
        textEl.append('tspan')
          .attr('x', pos[0])
          .attr('dy', i === 0 ? 0 : 12)
          .text(line)
      })

      if (node.value !== null) {
        g.append('text')
          .attr('x', pos[0] + 60)
          .attr('y', pos[1] - 24)
          .attr('text-anchor', 'middle')
          .attr('fill', 'var(--color-text-muted)')
          .style('font-size', '9px')
          .text(`v=${node.value}`)
      }

      if (isPruned) {
        g.append('text')
          .attr('x', pos[0] + 60)
          .attr('y', pos[1] + 28)
          .attr('text-anchor', 'middle')
          .attr('fill', '#ef4444')
          .style('font-size', '9px')
          .style('font-weight', 600)
          .text('✕ 剪枝')
      }

      if (isSolution) {
        g.append('text')
          .attr('x', pos[0] + 60)
          .attr('y', pos[1] + 28)
          .attr('text-anchor', 'middle')
          .attr('fill', '#10b981')
          .style('font-size', '9px')
          .style('font-weight', 600)
          .text('✓ 解')
      }
    }
  }, [step, visibleNodes, data.nodes])

  return (
    <div className="my-6 overflow-hidden rounded-xl border" style={{ borderColor: 'var(--color-border)', background: 'var(--color-surface)' }}>
      <div className="border-b px-5 py-3" style={{ borderColor: 'var(--color-border)' }}>
        <span className="text-sm font-semibold" style={{ color: 'var(--color-text)' }}>
          Tree of Thoughts — Game of 24 搜索树
        </span>
        <span className="ml-2 text-xs" style={{ color: 'var(--color-text-muted)' }}>
          Yao et al., NeurIPS 2023
        </span>
      </div>
      <div className="p-2">
        <svg ref={svgRef} width="100%" height={420} />
      </div>
      <div className="flex items-center justify-between border-t px-5 py-3" style={{ borderColor: 'var(--color-border)' }}>
        <button
          onClick={() => setStep((s) => Math.max(0, s - 1))}
          disabled={step === 0}
          className="cursor-pointer rounded border px-3 py-1 text-sm transition-opacity disabled:cursor-default disabled:opacity-30"
          style={{ borderColor: 'var(--color-border)', color: 'var(--color-text)' }}
        >
          ← BFS 展开
        </button>
        <span className="text-xs" style={{ color: 'var(--color-text-muted)' }}>
          搜索步骤 {step + 1}/8
        </span>
        <button
          onClick={() => setStep((s) => Math.min(7, s + 1))}
          disabled={step === 7}
          className="cursor-pointer rounded border px-3 py-1 text-sm transition-opacity disabled:cursor-default disabled:opacity-30"
          style={{ borderColor: 'var(--color-border)', color: 'var(--color-text)' }}
        >
          BFS 展开 →
        </button>
      </div>
    </div>
  )
}
