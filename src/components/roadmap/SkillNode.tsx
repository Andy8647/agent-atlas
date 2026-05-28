import { memo } from 'react'
import { Handle, Position } from '@xyflow/react'
import { useProgressStore } from '../../store/progressStore'
import { useTheme } from '../../lib/themeContext'

interface SkillNodeData {
  slug: string
  title: string
  summary: string
  clusterId: string
  clusterColor: string
  estimatedMinutes: number
}

const CLUSTER_ICONS: Record<string, React.ReactNode> = {
  foundations: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="9" />
      <circle cx="12" cy="12" r="3" />
    </svg>
  ),
  'single-agent-reasoning': (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M13 2L4 14h7l-1 8 9-12h-7l1-8z" />
    </svg>
  ),
  'tools-and-memory': (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="3" />
      <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 1 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 1 1-4 0v-.09a1.65 1.65 0 0 0-1-1.51 1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 1 1-2.83-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 1 1 0-4h.09a1.65 1.65 0 0 0 1.51-1 1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 1 1 2.83-2.83l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 1 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 1 1 2.83 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 1 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z" />
    </svg>
  ),
  'context-engineering': (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M3 6h18M3 12h18M3 18h12" />
    </svg>
  ),
  'multi-agent-production': (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="5" r="2" />
      <circle cx="5" cy="19" r="2" />
      <circle cx="19" cy="19" r="2" />
      <path d="M12 7v3M7 14l3-3M17 14l-3-3" />
    </svg>
  ),
}

// Status styles for both Catppuccin Mocha (dark) and Latte (light)
function getStatusStyles(mode: 'dark' | 'light') {
  if (mode === 'dark') {
    return {
      'not-started': {
        bg: '#313244',
        border: '#6c7086',
        iconColor: '#a6adc8',
        titleColor: '#a6adc8',
        glow: 'none',
        badgeBorder: '#11111b',
      },
      'in-progress': {
        bg: 'rgba(137, 180, 250, 0.15)',
        border: '#89b4fa',
        iconColor: '#89b4fa',
        titleColor: '#bac2de',
        glow: '0 0 16px rgba(137, 180, 250, 0.55), 0 0 32px rgba(137, 180, 250, 0.25)',
        badgeBorder: '#11111b',
      },
      completed: {
        bg: 'rgba(250, 179, 135, 0.18)',
        border: '#fab387',
        iconColor: '#fab387',
        titleColor: '#cdd6f4',
        glow: '0 0 18px rgba(250, 179, 135, 0.55), 0 0 36px rgba(250, 179, 135, 0.22)',
        badgeBorder: '#11111b',
      },
    } as const
  }
  return {
    'not-started': {
      bg: '#ffffff',
      border: '#ccd0da',
      iconColor: '#6c6f85',
      titleColor: '#5c5f77',
      glow: '0 1px 3px rgba(0,0,0,0.08)',
      badgeBorder: '#eff1f5',
    },
    'in-progress': {
      bg: 'rgba(30, 102, 245, 0.08)',
      border: '#1e66f5',
      iconColor: '#1e66f5',
      titleColor: '#1e40af',
      glow: '0 0 0 3px rgba(30, 102, 245, 0.12), 0 2px 8px rgba(30, 102, 245, 0.2)',
      badgeBorder: '#ffffff',
    },
    completed: {
      bg: 'rgba(254, 100, 11, 0.1)',
      border: '#fe640b',
      iconColor: '#fe640b',
      titleColor: '#9a3412',
      glow: '0 0 0 3px rgba(254, 100, 11, 0.12), 0 2px 8px rgba(254, 100, 11, 0.2)',
      badgeBorder: '#ffffff',
    },
  } as const
}

export const SkillNode = memo(function SkillNode({
  data,
  selected,
}: {
  data: SkillNodeData
  selected: boolean
}) {
  const status = useProgressStore((s) => s.nodes[data.slug] || 'not-started')
  const { mode } = useTheme()
  const style = getStatusStyles(mode)[status]
  const icon = CLUSTER_ICONS[data.clusterId] || CLUSTER_ICONS.foundations

  const accentBorder = status === 'not-started'
    ? (selected ? data.clusterColor : style.border)
    : style.border

  return (
    <div
      style={{
        width: 140,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: 8,
        cursor: 'pointer',
      }}
    >
      <Handle type="target" position={Position.Top} style={{ background: 'transparent', border: 'none', top: 4 }} />
      <div
        style={{
          width: 72,
          height: 72,
          borderRadius: '50%',
          background: style.bg,
          border: `2px solid ${accentBorder}`,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: status === 'not-started' ? data.clusterColor : style.iconColor,
          boxShadow: selected
            ? `${style.glow}, 0 0 0 4px ${data.clusterColor}40`
            : style.glow,
          transition: 'all 0.2s ease',
          position: 'relative',
        }}
      >
        <div style={{ width: 30, height: 30, opacity: status === 'not-started' ? 0.55 : 1 }}>
          {icon}
        </div>
        {status !== 'not-started' && (
          <div
            style={{
              position: 'absolute',
              top: -4,
              right: -4,
              width: 18,
              height: 18,
              borderRadius: '50%',
              background: status === 'completed' ? style.border : style.border,
              border: `2px solid ${style.badgeBorder}`,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: mode === 'dark' ? '#11111b' : '#ffffff',
              fontSize: 10,
              fontWeight: 700,
            }}
          >
            {status === 'completed' ? '✓' : '◐'}
          </div>
        )}
      </div>
      <div
        style={{
          fontSize: 11,
          fontWeight: 600,
          color: style.titleColor,
          textAlign: 'center',
          lineHeight: 1.3,
          maxWidth: 140,
          textShadow:
            mode === 'dark' && status !== 'not-started'
              ? `0 0 8px ${style.iconColor}80`
              : 'none',
        }}
      >
        {data.title}
      </div>
      <Handle type="source" position={Position.Bottom} style={{ background: 'transparent', border: 'none', bottom: 4 }} />
    </div>
  )
})
