import { useMemo, useCallback, useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  ReactFlow,
  Background,
  MiniMap,
  useNodesState,
  useEdgesState,
  getNodesBounds,
  getViewportForBounds,
  type Node,
  type ReactFlowInstance,
} from '@xyflow/react'
import { SkillNode } from '../components/roadmap/SkillNode'
import { treeData } from '../content/tree'
import { getTreeLayout } from '../lib/layoutTree'
import { useTheme } from '../lib/themeContext'
import { useProgressStore } from '../store/progressStore'
import { MOCHA, LATTE } from '../lib/constants'
import type { NodeStatus } from '../lib/types'

const NODE_WIDTH = 140
const NODE_HEIGHT = 120

const nodeTypes = { skill: SkillNode }

/**
 * Compute which nodes the user should focus on next:
 *   1. Any in-progress nodes (highest priority — user is actively reading)
 *   2. Unlocked nodes (all prerequisites completed but self not-started)
 *   3. Root node `what-is-agent` (default for new users)
 */
function computeFocusNodes(nodeStates: Record<string, NodeStatus>): string[] {
  const allNodes = treeData.clusters.flatMap((c) => c.nodes)

  const inProgress = allNodes.filter((n) => nodeStates[n.slug] === 'in-progress')
  if (inProgress.length > 0) return inProgress.map((n) => n.slug)

  const unlocked = allNodes.filter((n) => {
    const status = nodeStates[n.slug] || 'not-started'
    if (status !== 'not-started') return false
    if (n.prerequisites.length === 0) return false
    return n.prerequisites.every((p) => nodeStates[p] === 'completed')
  })
  if (unlocked.length > 0) return unlocked.slice(0, 3).map((n) => n.slug)

  return ['what-is-agent']
}

export function RoadmapPage() {
  const navigate = useNavigate()
  const { mode } = useTheme()
  const p = mode === 'dark' ? MOCHA : LATTE
  const nodeStates = useProgressStore((s) => s.nodes)
  const [rfInstance, setRfInstance] = useState<ReactFlowInstance | null>(null)

  const { nodes: layoutNodes, edges: layoutEdges } = useMemo(
    () => getTreeLayout(treeData.clusters),
    []
  )

  const focusSlugs = useMemo(() => computeFocusNodes(nodeStates), [nodeStates])

  const initialNodes: Node[] = useMemo(
    () =>
      layoutNodes.map((n) => ({
        id: n.id,
        type: n.type,
        position: n.position,
        data: n.data,
        width: NODE_WIDTH,
        height: NODE_HEIGHT,
      })),
    [layoutNodes]
  )

  const initialEdges = useMemo(
    () =>
      layoutEdges.map((e) => {
        const isCrossCluster = e.style?.opacity === 0.45
        return {
          ...e,
          style: {
            stroke: isCrossCluster ? p.overlay0 : p.mauve,
            strokeWidth: isCrossCluster ? 1 : 1.5,
            opacity: isCrossCluster ? 0.45 : mode === 'dark' ? 0.85 : 0.7,
          },
        }
      }),
    [layoutEdges, p, mode]
  )

  const [nodes, , onNodesChange] = useNodesState(initialNodes)
  const [edges, , onEdgesChange] = useEdgesState(initialEdges)

  const onNodeClick = useCallback(
    (_event: React.MouseEvent, node: Node) => {
      navigate(`/article/${node.data.slug}`)
    },
    [navigate]
  )

  // Focus on relevant nodes; place them ~10% above viewport center (not dead-center)
  const focusOnLearning = useCallback(() => {
    if (!rfInstance || focusSlugs.length === 0) return
    const focusNodes = rfInstance.getNodes().filter((n) => focusSlugs.includes(n.id))
    if (focusNodes.length === 0) return

    const bounds = getNodesBounds(focusNodes)
    const container = document.querySelector('.react-flow') as HTMLElement | null
    if (!container) return
    const w = container.clientWidth
    const h = container.clientHeight

    const vp = getViewportForBounds(bounds, w, h, 0.5, 1.0, 0.5)
    // Pull canvas up (negative y delta) → nodes appear shifted up by 10% of viewport height.
    rfInstance.setViewport(
      { x: vp.x, y: vp.y - h * 0.1, zoom: vp.zoom },
      { duration: 600 }
    )
  }, [rfInstance, focusSlugs])

  // Initial focus when instance is ready
  useEffect(() => {
    if (!rfInstance) return
    const t = setTimeout(focusOnLearning, 100)
    return () => clearTimeout(t)
  }, [rfInstance, focusOnLearning])

  const bgGradient = `radial-gradient(ellipse at center, ${p.base} 0%, ${p.mantle} 60%, ${p.crust} 100%)`

  return (
    <div style={{ width: '100%', height: 'calc(100vh - 48px)', background: bgGradient, position: 'relative' }}>
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onNodeClick={onNodeClick}
        onInit={setRfInstance}
        nodeTypes={nodeTypes}
        nodesDraggable={false}
        nodesConnectable={false}
        elementsSelectable
        fitView={false}
        minZoom={0.2}
        maxZoom={2}
        defaultEdgeOptions={{ type: 'default' }}
        proOptions={{ hideAttribution: true }}
      >
        <Background color={p.surface0} gap={32} size={1} />
        <MiniMap
          pannable
          zoomable
          style={{
            background: mode === 'dark' ? p.crust : p.mantle,
            border: `1px solid ${p.surface0}`,
            borderRadius: 6,
          }}
          maskColor={mode === 'dark' ? 'rgba(17, 17, 27, 0.75)' : 'rgba(220, 224, 232, 0.65)'}
          nodeColor={(n) => (n.data as any)?.clusterColor || p.mauve}
          nodeStrokeColor={p.mantle}
          nodeStrokeWidth={2}
          nodeBorderRadius={20}
        />
      </ReactFlow>

      {/* Hint banner — click to re-focus on learning targets */}
      <button
        onClick={focusOnLearning}
        title="重新聚焦到当前学习焦点"
        className="absolute left-1/2 top-4 flex -translate-x-1/2 cursor-pointer items-center gap-2 rounded-full px-3.5 py-1.5 text-[11px] transition-all hover:scale-105"
        style={{
          background: mode === 'dark' ? 'rgba(24, 24, 37, 0.75)' : 'rgba(255, 255, 255, 0.85)',
          border: `1px solid ${p.surface0}`,
          color: p.subtext0,
          backdropFilter: 'blur(8px)',
        }}
      >
        <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{ color: p.mauve }}>
          <circle cx="12" cy="12" r="3" />
          <path d="M12 2v3M12 19v3M2 12h3M19 12h3" />
        </svg>
        {(() => {
          const inProgressCount = Object.values(nodeStates).filter((s) => s === 'in-progress').length
          const completedCount = Object.values(nodeStates).filter((s) => s === 'completed').length
          if (inProgressCount > 0) return `继续学习 · ${inProgressCount} 个节点学习中`
          if (completedCount > 0) {
            const unlockedCount = computeFocusNodes(nodeStates).length
            return `已掌握 ${completedCount} 节 · ${unlockedCount} 个新节点已解锁`
          }
          return '从「什么是 Agent」开始 · 点击节点进入文章'
        })()}
      </button>
    </div>
  )
}
