import { useEffect, useMemo, useRef, useState } from 'react'
import { createPortal } from 'react-dom'
import { useNavigate } from 'react-router-dom'
import { treeData } from '../../content/tree'
import { useProgressStore } from '../../store/progressStore'

interface SearchItem {
  slug: string
  title: string
  summary: string
  clusterId: string
  clusterTitle: string
  clusterColor: string
}

function buildIndex(): SearchItem[] {
  const items: SearchItem[] = []
  for (const cluster of treeData.clusters) {
    for (const node of cluster.nodes) {
      items.push({
        slug: node.slug,
        title: node.title,
        summary: node.summary,
        clusterId: cluster.id,
        clusterTitle: cluster.title,
        clusterColor: cluster.color,
      })
    }
  }
  return items
}

function fuzzyScore(item: SearchItem, query: string): number {
  if (!query) return 1
  const q = query.toLowerCase()
  const fields: [string, number][] = [
    [item.title.toLowerCase(), 3],
    [item.summary.toLowerCase(), 1],
    [item.clusterTitle.toLowerCase(), 1.5],
    [item.slug.toLowerCase(), 2],
  ]
  let score = 0
  for (const [text, weight] of fields) {
    if (text.includes(q)) score += weight
    // bonus for prefix match
    if (text.startsWith(q)) score += weight * 0.5
  }
  return score
}

export function CommandPalette() {
  const [open, setOpen] = useState(false)
  const [query, setQuery] = useState('')
  const [activeIndex, setActiveIndex] = useState(0)
  const inputRef = useRef<HTMLInputElement>(null)
  const listRef = useRef<HTMLDivElement>(null)
  const navigate = useNavigate()
  const nodeStates = useProgressStore((s) => s.nodes)

  const index = useMemo(buildIndex, [])

  const results = useMemo(() => {
    const scored = index
      .map((it) => ({ item: it, score: fuzzyScore(it, query.trim()) }))
      .filter((s) => s.score > 0)
      .sort((a, b) => b.score - a.score)
    return scored.slice(0, 20).map((s) => s.item)
  }, [index, query])

  // Global Cmd+K / Ctrl+K listener
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      const isMod = e.metaKey || e.ctrlKey
      if (isMod && e.key.toLowerCase() === 'k') {
        e.preventDefault()
        setOpen((v) => !v)
      } else if (e.key === 'Escape' && open) {
        setOpen(false)
      }
    }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [open])

  // Focus input on open + reset state on close
  useEffect(() => {
    if (open) {
      setTimeout(() => inputRef.current?.focus(), 0)
    } else {
      setQuery('')
      setActiveIndex(0)
    }
  }, [open])

  // Reset active index when query changes
  useEffect(() => {
    setActiveIndex(0)
  }, [query])

  // Keep active item visible
  useEffect(() => {
    const list = listRef.current
    if (!list) return
    const item = list.children[activeIndex] as HTMLElement | undefined
    item?.scrollIntoView({ block: 'nearest' })
  }, [activeIndex])

  const onKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault()
      setActiveIndex((i) => Math.min(i + 1, results.length - 1))
    } else if (e.key === 'ArrowUp') {
      e.preventDefault()
      setActiveIndex((i) => Math.max(i - 1, 0))
    } else if (e.key === 'Enter') {
      e.preventDefault()
      const target = results[activeIndex]
      if (target) {
        navigate(`/article/${target.slug}`)
        setOpen(false)
      }
    }
  }

  if (!open) return null

  return createPortal(
    <div
      className="fixed inset-0 z-50 flex items-start justify-center px-4 pt-[15vh]"
      style={{ background: 'rgba(0,0,0,0.45)', backdropFilter: 'blur(4px)' }}
      onClick={() => setOpen(false)}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="w-full max-w-xl overflow-hidden rounded-xl shadow-2xl"
        style={{ background: 'var(--color-surface)', border: '1px solid var(--color-border)' }}
      >
        {/* Input */}
        <div
          className="flex items-center gap-2 border-b px-4 py-3"
          style={{ borderColor: 'var(--color-border)' }}
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ color: 'var(--color-text-muted)' }}>
            <circle cx="11" cy="11" r="8" />
            <path d="m21 21-4.3-4.3" />
          </svg>
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={onKeyDown}
            placeholder="搜索文章、概念、cluster..."
            className="flex-1 bg-transparent text-sm outline-none"
            style={{ color: 'var(--color-text)' }}
          />
          <kbd
            className="rounded border px-1.5 py-0.5 text-[10px]"
            style={{
              borderColor: 'var(--color-border)',
              color: 'var(--color-text-muted)',
              fontFamily: '-apple-system, ui-sans-serif, system-ui, sans-serif',
            }}
          >
            esc
          </kbd>
        </div>

        {/* Results */}
        <div
          ref={listRef}
          className="max-h-[50vh] overflow-y-auto py-2"
        >
          {results.length === 0 && (
            <div className="px-4 py-8 text-center text-sm" style={{ color: 'var(--color-text-muted)' }}>
              没有找到匹配的文章
            </div>
          )}
          {results.map((item, i) => {
            const isActive = i === activeIndex
            const status = nodeStates[item.slug] || 'not-started'
            return (
              <button
                key={item.slug}
                onMouseEnter={() => setActiveIndex(i)}
                onClick={() => {
                  navigate(`/article/${item.slug}`)
                  setOpen(false)
                }}
                className="flex w-full cursor-pointer items-start gap-3 px-4 py-2.5 text-left"
                style={{
                  background: isActive ? 'var(--color-border)' : 'transparent',
                }}
              >
                {/* Status dot */}
                <div
                  className="mt-1 h-2 w-2 shrink-0 rounded-full"
                  style={{
                    background:
                      status === 'completed' ? '#fab387'
                      : status === 'in-progress' ? '#89b4fa'
                      : 'transparent',
                    border: status === 'not-started' ? `1.5px solid var(--color-text-muted)` : 'none',
                  }}
                />
                {/* Content */}
                <div className="min-w-0 flex-1">
                  <div className="flex items-baseline gap-2">
                    <span className="truncate text-sm font-medium" style={{ color: 'var(--color-text)' }}>
                      {item.title}
                    </span>
                    <span
                      className="shrink-0 rounded px-1.5 text-[10px]"
                      style={{
                        background: `${item.clusterColor}22`,
                        color: item.clusterColor,
                      }}
                    >
                      {item.clusterTitle}
                    </span>
                  </div>
                  <div className="truncate text-xs" style={{ color: 'var(--color-text-muted)' }}>
                    {item.summary}
                  </div>
                </div>
                {isActive && (
                  <kbd
                    className="shrink-0 rounded border px-1.5 py-0.5 text-[10px]"
                    style={{
                      borderColor: 'var(--color-border)',
                      color: 'var(--color-text-muted)',
                      fontFamily: '-apple-system, ui-sans-serif, system-ui, sans-serif',
                    }}
                  >
                    ↵
                  </kbd>
                )}
              </button>
            )
          })}
        </div>

        {/* Footer */}
        <div
          className="flex items-center justify-between border-t px-4 py-2 text-[11px]"
          style={{ borderColor: 'var(--color-border)', color: 'var(--color-text-muted)' }}
        >
          <div className="flex items-center gap-3">
            <span><kbd style={{ fontFamily: 'Maple Mono NF CN, monospace' }}>↑↓</kbd> 导航</span>
            <span><kbd style={{ fontFamily: 'Maple Mono NF CN, monospace' }}>↵</kbd> 打开</span>
            <span><kbd style={{ fontFamily: 'Maple Mono NF CN, monospace' }}>esc</kbd> 关闭</span>
          </div>
          <span>{results.length} / {index.length}</span>
        </div>
      </div>
    </div>,
    document.body
  )
}
