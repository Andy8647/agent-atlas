import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useReducedMotion } from '../../hooks/useReducedMotion'

interface TrajectoryStep {
  thought: string
  action: string
  observation: string | null
}

interface Trajectory {
  title: string
  question: string
  steps: TrajectoryStep[]
}

interface ReActVisualizerProps {
  trajectory?: string
}

// Load trajectory data at module level
const trajectoryData: Record<string, Trajectory> = {
  'apple-remote': {
    title: 'Apple Remote 问题 — ReAct 正确轨迹',
    question: '除了 Apple Remote，还有什么设备能控制 Apple Remote 最初设计要交互的那个程序？',
    steps: [
      { thought: 'Apple Remote 最初是设计来控制 Apple TV 的吗？让我查一下。', action: 'search[Apple Remote]', observation: 'Apple Remote 是 Apple 公司于 2005 年发布的红外遥控器，最初设计用于控制 Front Row 媒体中心程序...' },
      { thought: '原来 Apple Remote 是控制 Front Row 的，不是 Apple TV。现在我需要查 Front Row 还能被什么设备控制。', action: 'search[Front Row control]', observation: 'Front Row 可以通过 Apple Remote、键盘快捷键、以及兼容的 IR 遥控器来控制。' },
      { thought: '所以除了 Apple Remote，键盘也能控制 Front Row。但"兼容 IR 遥控器"范围太大。让我查查是否有专门的兼容设备。', action: 'search[Front Row compatible devices]', observation: 'Front Row 兼容 Apple Remote 和大多数通用红外遥控器。在 Mac 上，也可以通过键盘的 Command+Esc 快捷键启动和控制。' },
      { thought: '现在我可以确定了：除了 Apple Remote，键盘（通过快捷键）也能控制 Front Row。', action: 'finish[键盘（通过 Command+Esc 等快捷键）]', observation: null },
    ],
  },
}

export function ReActVisualizer({ trajectory = 'apple-remote' }: ReActVisualizerProps) {
  const [step, setStep] = useState(0)
  const reduced = useReducedMotion()
  const data = trajectoryData[trajectory]

  if (!data) {
    return <div className="rounded border p-4 text-sm" style={{ borderColor: 'var(--color-border)', color: 'var(--color-text-muted)' }}>未找到轨迹数据: {trajectory}</div>
  }

  const current = data.steps[step]
  const isLast = step === data.steps.length - 1
  const isFirst = step === 0

  const columnVariants = {
    enter: { opacity: 0, y: reduced ? 0 : 12 },
    center: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: reduced ? 0 : -12 },
  }

  return (
    <div className="my-6 overflow-hidden rounded-xl border" style={{ borderColor: 'var(--color-border)', background: 'var(--color-surface)' }}>
      {/* Header */}
      <div className="border-b px-5 py-3" style={{ borderColor: 'var(--color-border)' }}>
        <span className="text-sm font-semibold" style={{ color: 'var(--color-text)' }}>
          ReAct 轨迹可视化
        </span>
        <span className="ml-2 text-xs" style={{ color: 'var(--color-text-muted)' }}>
          {data.title} &middot; 步骤 {step + 1}/{data.steps.length}
        </span>
      </div>

      {/* Question banner */}
      <div className="border-b px-5 py-2 text-xs" style={{ borderColor: 'var(--color-border)', background: 'var(--color-primary-light)' }}>
        <span className="font-semibold" style={{ color: 'var(--color-primary)' }}>任务：</span>
        <span style={{ color: 'var(--color-text)' }}>{data.question}</span>
      </div>

      {/* T-A-O Columns */}
      <div className="grid grid-cols-3 divide-x" style={{ borderColor: 'var(--color-border)' }}>
        <AnimatePresence mode="wait">
          {/* Thought */}
          <motion.div
            key={`t-${step}`}
            variants={columnVariants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{ duration: 0.2 }}
            className="p-4"
          >
            <div className="mb-2 text-xs font-semibold uppercase tracking-wider" style={{ color: '#f59e0b' }}>
              Thought 思考
            </div>
            <p className="text-sm leading-relaxed" style={{ color: 'var(--color-text)' }}>
              {current.thought}
            </p>
          </motion.div>

          {/* Action */}
          <motion.div
            key={`a-${step}`}
            variants={columnVariants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{ duration: 0.2, delay: 0.05 }}
            className="p-4"
          >
            <div className="mb-2 text-xs font-semibold uppercase tracking-wider" style={{ color: '#3b82f6' }}>
              Action 行动
            </div>
            <code className="text-sm" style={{ color: 'var(--color-text)' }}>
              {current.action}
            </code>
          </motion.div>

          {/* Observation */}
          <motion.div
            key={`o-${step}`}
            variants={columnVariants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{ duration: 0.2, delay: 0.1 }}
            className="p-4"
          >
            <div className="mb-2 text-xs font-semibold uppercase tracking-wider" style={{ color: '#10b981' }}>
              Observation 观察
            </div>
            {current.observation ? (
              <p className="text-sm leading-relaxed" style={{ color: 'var(--color-text)' }}>
                {current.observation}
              </p>
            ) : (
              <span className="text-sm" style={{ color: 'var(--color-text-muted)' }}>
                （最终回答，无观察）
              </span>
            )}
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Controls */}
      <div className="flex items-center justify-between border-t px-5 py-3" style={{ borderColor: 'var(--color-border)' }}>
        <button
          onClick={() => setStep((s) => s - 1)}
          disabled={isFirst}
          className="cursor-pointer rounded border px-3 py-1 text-sm transition-opacity disabled:cursor-default disabled:opacity-30"
          style={{ borderColor: 'var(--color-border)', color: 'var(--color-text)' }}
        >
          ← 上一步
        </button>
        <div className="flex gap-1">
          {data.steps.map((_, i) => (
            <button
              key={i}
              onClick={() => setStep(i)}
              className="h-2 w-2 cursor-pointer rounded-full transition-colors"
              style={{
                background: i === step ? 'var(--color-primary)' : 'var(--color-border)',
              }}
            />
          ))}
        </div>
        <button
          onClick={() => setStep((s) => s + 1)}
          disabled={isLast}
          className="cursor-pointer rounded border px-3 py-1 text-sm transition-opacity disabled:cursor-default disabled:opacity-30"
          style={{ borderColor: 'var(--color-border)', color: 'var(--color-text)' }}
        >
          下一步 →
        </button>
      </div>
    </div>
  )
}
