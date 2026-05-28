import { useRef, useState, useCallback } from 'react'
import { useReducedMotion } from '../../hooks/useReducedMotion'

interface ComparisonSliderProps {
  beforeLabel?: string
  afterLabel?: string
  beforeContent: string
  afterContent: string
}

export function ComparisonSlider({
  beforeLabel = 'Before',
  afterLabel = 'After',
  beforeContent,
  afterContent,
}: ComparisonSliderProps) {
  const [position, setPosition] = useState(50)
  const containerRef = useRef<HTMLDivElement>(null)
  const reduced = useReducedMotion()

  const handleMove = useCallback(
    (clientX: number) => {
      if (!containerRef.current) return
      const rect = containerRef.current.getBoundingClientRect()
      const x = Math.max(0, Math.min(100, ((clientX - rect.left) / rect.width) * 100))
      setPosition(x)
    },
    []
  )

  return (
    <div className="my-6 overflow-hidden rounded-xl border" style={{ borderColor: 'var(--color-border)', background: 'var(--color-surface)' }}>
      <div className="flex border-b" style={{ borderColor: 'var(--color-border)' }}>
        <div className="flex-1 px-4 py-2 text-center text-xs font-semibold" style={{ color: '#ef4444' }}>
          {beforeLabel}
        </div>
        <div className="flex-1 px-4 py-2 text-center text-xs font-semibold" style={{ color: '#10b981' }}>
          {afterLabel}
        </div>
      </div>

      <div
        ref={containerRef}
        className="relative h-64 cursor-ew-resize select-none overflow-hidden"
        onMouseDown={(e) => {
          e.preventDefault()
          const handleUp = () => {
            document.removeEventListener('mousemove', onMove)
            document.removeEventListener('mouseup', handleUp)
          }
          const onMove = (e: MouseEvent) => handleMove(e.clientX)
          document.addEventListener('mousemove', onMove)
          document.addEventListener('mouseup', handleUp)
        }}
        onTouchMove={(e) => handleMove(e.touches[0].clientX)}
      >
        {/* Before (full width, right side clipped) */}
        <div className="absolute inset-0 flex items-center justify-center p-4 text-sm" style={{ background: '#fef2f2', color: '#991b1b' }}>
          <pre className="whitespace-pre-wrap text-xs">{beforeContent}</pre>
        </div>

        {/* After (left side clipped) */}
        <div
          className="absolute inset-0 flex items-center justify-center p-4 text-sm"
          style={{
            background: '#ecfdf5',
            color: '#065f46',
            clipPath: `inset(0 ${100 - position}% 0 0)`,
          }}
        >
          <pre className="whitespace-pre-wrap text-xs">{afterContent}</pre>
        </div>

        {/* Slider line */}
        <div
          className="absolute inset-y-0 w-0.5 bg-white shadow-lg"
          style={{ left: `${position}%`, transition: reduced ? 'none' : 'left 0.1s ease-out' }}
        />

        {/* Slider handle */}
        <div
          className="absolute top-1/2 -ml-4 -mt-4 flex h-8 w-8 items-center justify-center rounded-full bg-white shadow-lg"
          style={{ left: `${position}%` }}
        >
          <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
            <path d="M3 1L3 11M9 1L9 11" stroke="#6b7280" strokeWidth="1.5" strokeLinecap="round" />
          </svg>
        </div>
      </div>
    </div>
  )
}
