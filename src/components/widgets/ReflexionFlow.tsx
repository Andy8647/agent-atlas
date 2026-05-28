import { useState } from 'react'
import { motion } from 'framer-motion'
import { useReducedMotion } from '../../hooks/useReducedMotion'

type Phase = 'actor' | 'evaluator' | 'reflection'

const phases: { id: Phase; label: string; color: string; description: string }[] = [
  {
    id: 'actor',
    label: 'Actor 执行者',
    color: '#f59e0b',
    description: '在当前轨迹中执行任务，生成 actions 和 observations。对环境做决策。',
  },
  {
    id: 'evaluator',
    label: 'Evaluator 评估者',
    color: '#3b82f6',
    description: '检测轨迹中的失败——当连续重复无效动作或最终结果错误时触发。给出"pass"或具体的失败原因。',
  },
  {
    id: 'reflection',
    label: 'Self-Reflection 反思',
    color: '#10b981',
    description: '读取失败轨迹 + evaluator 诊断 → 用自然语言总结失败教训 → 写入 episodic memory。最多保留 1-3 条最相关的反思。',
  },
]

export function ReflexionFlow() {
  const [activePhase, setActivePhase] = useState<Phase>('actor')
  const reduced = useReducedMotion()

  const phase = phases.find((p) => p.id === activePhase)!

  return (
    <div className="my-6 overflow-hidden rounded-xl border" style={{ borderColor: 'var(--color-border)', background: 'var(--color-surface)' }}>
      <div className="border-b px-5 py-3" style={{ borderColor: 'var(--color-border)' }}>
        <span className="text-sm font-semibold" style={{ color: 'var(--color-text)' }}>
          Reflexion 三阶段循环
        </span>
        <span className="ml-2 text-xs" style={{ color: 'var(--color-text-muted)' }}>
          Shinn et al., NeurIPS 2023
        </span>
      </div>

      <div className="p-5">
        {/* Phase selector */}
        <div className="mb-4 flex gap-2">
          {phases.map((p) => (
            <button
              key={p.id}
              onClick={() => setActivePhase(p.id)}
              className="cursor-pointer rounded-full px-4 py-1.5 text-xs font-semibold transition-all"
              style={{
                background: activePhase === p.id ? p.color + '20' : 'transparent',
                color: p.color,
                border: `1.5px solid ${p.color}`,
              }}
            >
              {p.label}
            </button>
          ))}
        </div>

        {/* Active phase description */}
        <motion.div
          key={activePhase}
          initial={reduced ? {} : { opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.2 }}
          className="rounded-lg border p-4"
          style={{ borderColor: phase.color + '40', background: phase.color + '08' }}
        >
          <h4 className="mb-2 text-sm font-bold" style={{ color: phase.color }}>
            {phase.label}
          </h4>
          <p className="text-sm leading-relaxed" style={{ color: 'var(--color-text)' }}>
            {phase.description}
          </p>
        </motion.div>

        {/* Flow diagram (simple SVG) */}
        <div className="mt-4 flex items-center justify-center gap-2 text-xs">
          {phases.map((p, i) => (
            <div key={p.id} className="flex items-center gap-2">
              <div
                className="rounded-full px-3 py-1 font-semibold"
                style={{
                  background: activePhase === p.id ? p.color : p.color + '30',
                  color: activePhase === p.id ? 'white' : p.color,
                }}
              >
                {p.label.split(' ')[0]}
              </div>
              {i < phases.length - 1 && (
                <span style={{ color: 'var(--color-text-muted)' }}>→</span>
              )}
            </div>
          ))}
          <div className="ml-2 flex items-center">
            <svg width="40" height="20" viewBox="0 0 40 20">
              <path
                d="M 35 10 Q 35 18, 20 18 Q 5 18, 5 10"
                fill="none"
                stroke="var(--color-text-muted)"
                strokeWidth="1"
                markerEnd="url(#arrowhead)"
              />
              <defs>
                <marker id="arrowhead" markerWidth="6" markerHeight="6" refX="6" refY="3" orient="auto">
                  <path d="M 0 0 L 6 3 L 0 6 Z" fill="var(--color-text-muted)" />
                </marker>
              </defs>
            </svg>
            <span className="text-xs" style={{ color: 'var(--color-text-muted)' }}>循环</span>
          </div>
        </div>

        {/* Dual memory structure */}
        <div className="mt-4 grid grid-cols-2 gap-3">
          <div className="rounded-lg border p-3" style={{ borderColor: 'var(--color-border)' }}>
            <div className="mb-1 text-xs font-semibold" style={{ color: 'var(--color-text-muted)' }}>
              Short-term Memory 短期记忆
            </div>
            <div className="text-xs" style={{ color: 'var(--color-text-muted)' }}>
              当前轨迹的所有 (Thought, Action, Observation)
            </div>
          </div>
          <div className="rounded-lg border p-3" style={{ borderColor: 'var(--color-border)' }}>
            <div className="mb-1 text-xs font-semibold" style={{ color: 'var(--color-text-muted)' }}>
              Long-term Memory 长期记忆
            </div>
            <div className="text-xs" style={{ color: 'var(--color-text-muted)' }}>
              反思生成的自然语言教训（最多 1-3 条）
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
