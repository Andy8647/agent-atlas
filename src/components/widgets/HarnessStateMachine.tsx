import { useState } from 'react'

interface StepDef {
  id: string
  label: string
  description: string
  x: number
  y: number
}

const steps: StepDef[] = [
  { id: 'assemble', label: '组装请求', description: '系统提示 + 用户任务 + 历史 + 工具定义', x: 80, y: 30 },
  { id: 'llm', label: 'LLM 推理', description: '模型生成文本响应或 tool_call', x: 250, y: 30 },
  { id: 'parse', label: '解析输出', description: '检测 tool_call 并解析参数', x: 420, y: 30 },
  { id: 'sandbox', label: '沙箱执行', description: '权限检查 → 子进程 → 捕获 stdout/stderr', x: 420, y: 120 },
  { id: 'truncate', label: '结果截断', description: '保留头尾，中间省略（token-aware）', x: 250, y: 180 },
  { id: 'append', label: '回填上下文', description: 'tool_call + 结果追加到 history', x: 80, y: 180 },
  { id: 'check', label: '检查终止', description: '模型输出文本 → 完成；tool_call → 继续', x: 80, y: 270 },
]

const edges: [string, string, string][] = [
  ['assemble', 'llm', '请求体'],
  ['llm', 'parse', '模型输出'],
  ['parse', 'sandbox', 'tool_call'],
  ['sandbox', 'truncate', '原始输出'],
  ['truncate', 'append', '截断后结果'],
  ['append', 'assemble', '更新 history → 重新组装'],
  ['check', 'assemble', '新请求（如果继续）'],
]

export function HarnessStateMachine() {
  const [activeStep, setActiveStep] = useState<string | null>(null)

  return (
    <div className="my-6 overflow-hidden rounded-xl border" style={{ borderColor: 'var(--color-border)', background: 'var(--color-surface)' }}>
      <div className="border-b px-5 py-3" style={{ borderColor: 'var(--color-border)' }}>
        <span className="text-sm font-semibold" style={{ color: 'var(--color-text)' }}>
          Agent Harness 主循环
        </span>
        <span className="ml-2 text-xs" style={{ color: 'var(--color-text-muted)' }}>
          Claude Code / Codex 通用模式
        </span>
      </div>

      <div className="p-4">
        <svg viewBox="0 0 560 320" width="100%" style={{ maxHeight: 320 }}>
          {/* Edges */}
          {edges.map(([from, to, label]) => {
            const fromStep = steps.find((s) => s.id === from)!
            const toStep = steps.find((s) => s.id === to)!
            const midX = (fromStep.x + toStep.x) / 2
            const midY = (fromStep.y + toStep.y) / 2
            const isActive = activeStep === from || activeStep === to
            return (
              <g key={`${from}-${to}`}>
                <line
                  x1={fromStep.x}
                  y1={fromStep.y}
                  x2={toStep.x}
                  y2={toStep.y}
                  stroke={isActive ? 'var(--color-primary)' : 'var(--color-border)'}
                  strokeWidth={isActive ? 2 : 1}
                  strokeDasharray={from === 'append' && to === 'assemble' ? '5,3' : undefined}
                />
                <text
                  x={midX}
                  y={midY - 5}
                  textAnchor="middle"
                  fill="var(--color-text-muted)"
                  fontSize="9"
                >
                  {label}
                </text>
              </g>
            )
          })}

          {/* Nodes */}
          {steps.map((s) => {
            const isActive = activeStep === s.id
            return (
              <g
                key={s.id}
                onMouseEnter={() => setActiveStep(s.id)}
                onMouseLeave={() => setActiveStep(null)}
                style={{ cursor: 'pointer' }}
              >
                <rect
                  x={s.x - 55}
                  y={s.y - 18}
                  width={110}
                  height={36}
                  rx={6}
                  fill={isActive ? 'var(--color-primary-light)' : 'var(--color-surface)'}
                  stroke={isActive ? 'var(--color-primary)' : 'var(--color-border)'}
                  strokeWidth={isActive ? 2 : 1}
                />
                <text
                  x={s.x}
                  y={s.y}
                  textAnchor="middle"
                  fill="var(--color-text)"
                  fontSize="11"
                  fontWeight={600}
                >
                  {s.label}
                </text>
              </g>
            )
          })}

          {/* Legend */}
          <text x={280} y={310} textAnchor="middle" fill="var(--color-text-muted)" fontSize="10">
            悬停节点查看详情
          </text>
        </svg>
      </div>

      {/* Description panel */}
      {activeStep && (
        <div
          className="border-t px-5 py-3 text-sm"
          style={{ borderColor: 'var(--color-border)', background: 'var(--color-primary-light)' }}
        >
          <strong style={{ color: 'var(--color-primary)' }}>
            {steps.find((s) => s.id === activeStep)!.label}：
          </strong>
          <span style={{ color: 'var(--color-text)' }}>
            {steps.find((s) => s.id === activeStep)!.description}
          </span>
        </div>
      )}
    </div>
  )
}
