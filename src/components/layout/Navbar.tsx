import { Link } from 'react-router-dom'
import { useMemo } from 'react'
import { SITE_TITLE, GITHUB_URL } from '../../lib/constants'
import { useProgressStore } from '../../store/progressStore'
import { useTheme } from '../../lib/themeContext'
import { treeData } from '../../content/tree'
import { getAllSlugs } from '../../lib/tree'

export function Navbar() {
  const nodeStates = useProgressStore((s) => s.nodes)
  const resetAll = useProgressStore((s) => s.resetAll)
  const { mode, toggle: toggleTheme } = useTheme()

  const allSlugs = useMemo(() => getAllSlugs(treeData.clusters), [])
  const completed = allSlugs.filter((s) => nodeStates[s] === 'completed').length
  const inProgress = allSlugs.filter((s) => nodeStates[s] === 'in-progress').length
  const progressPct = (completed / allSlugs.length) * 100

  return (
    <nav
      className="relative flex h-14 shrink-0 items-center px-5 text-sm"
      style={{
        background: 'var(--color-surface)',
        color: 'var(--color-text)',
      }}
    >
      {/* Left — Logo + title */}
      <Link
        to="/"
        className="group flex items-center gap-2.5 font-semibold no-underline"
        style={{ color: 'var(--color-text)' }}
      >
        {/* 3-node network logo — represents agent reasoning graph */}
        <svg
          width="26"
          height="26"
          viewBox="0 0 32 32"
          fill="none"
          className="transition-transform duration-300 group-hover:rotate-12"
          style={{ color: 'var(--color-primary)' }}
        >
          {/* Edges (drawn first so nodes overlap them) */}
          <line x1="16" y1="9" x2="9" y2="22" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" opacity="0.55" />
          <line x1="16" y1="9" x2="23" y2="22" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" opacity="0.55" />
          <line x1="10" y1="23" x2="22" y2="23" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" opacity="0.4" strokeDasharray="2 2" />
          {/* Top node (filled — represents the active "thought" step) */}
          <circle cx="16" cy="7" r="4" fill="currentColor" />
          {/* Bottom-left node */}
          <circle cx="8" cy="23" r="3" fill="var(--color-surface)" stroke="currentColor" strokeWidth="2" />
          {/* Bottom-right node */}
          <circle cx="24" cy="23" r="3" fill="var(--color-surface)" stroke="currentColor" strokeWidth="2" />
        </svg>
        <span className="text-[13px] tracking-tight">{SITE_TITLE}</span>
      </Link>

      {/* Center — search trigger (Cmd+K). Absolutely centered so progress / icons
          can grow or shrink on the right without nudging the search bar. */}
      <button
        onClick={() => {
          window.dispatchEvent(new KeyboardEvent('keydown', { key: 'k', metaKey: true }))
        }}
        title="搜索（Cmd/Ctrl + K）"
        className="absolute left-1/2 top-1/2 hidden h-8 w-[320px] -translate-x-1/2 -translate-y-1/2 items-center gap-2 rounded-md border px-3 text-xs transition-colors hover:bg-[color:var(--color-border)] sm:flex"
        style={{
          borderColor: 'var(--color-border)',
          background: 'var(--color-bg)',
          color: 'var(--color-text-muted)',
        }}
      >
        <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="11" cy="11" r="8" />
          <path d="m21 21-4.3-4.3" />
        </svg>
        <span className="flex-1 text-left">搜索文章...</span>
        <kbd
          className="flex items-center gap-0.5 rounded border px-1.5 py-0.5 text-[10px] leading-none"
          style={{
            borderColor: 'var(--color-border)',
            fontFamily: '-apple-system, ui-sans-serif, system-ui, sans-serif',
            color: 'var(--color-text-muted)',
          }}
        >
          <span className="text-[13px] leading-none">⌘</span>
          <span>K</span>
        </kbd>
      </button>

      {/* Right group — progress + icons. ml-auto pushes everything to the right
          edge, so the centered search button stays put regardless of width. */}
      <div className="ml-auto flex items-center gap-3">
        {/* Progress block — fixed width so "学习中 N" appearing/disappearing
            doesn't ripple anything. */}
        <div className="hidden w-[180px] items-center justify-end gap-2 lg:flex">
          <span className="text-[11px]" style={{ color: 'var(--color-text-muted)' }}>
            {inProgress > 0 ? `学习中 ${inProgress}` : ''}
          </span>
          <div className="flex items-baseline gap-1 text-xs" style={{ color: 'var(--color-text-muted)' }}>
            <span style={{ color: 'var(--color-text)', fontWeight: 600 }}>{completed}</span>
            <span>/ {allSlugs.length}</span>
          </div>
          <div className="h-1.5 w-20 overflow-hidden rounded-full" style={{ background: 'var(--color-border)' }}>
            <div
              className="h-full rounded-full transition-all duration-300"
              style={{ width: `${progressPct}%`, background: 'var(--color-primary)' }}
            />
          </div>
        </div>

        {/* Icon buttons */}
        <div className="flex items-center gap-1">
        <IconButton
          title={mode === 'dark' ? '切换到浅色模式' : '切换到深色模式'}
          onClick={toggleTheme}
        >
          {mode === 'dark' ? (
            // Sun icon
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="12" r="4" />
              <path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M6.34 17.66l-1.41 1.41M19.07 4.93l-1.41 1.41" />
            </svg>
          ) : (
            // Moon icon
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
            </svg>
          )}
        </IconButton>

        {completed + inProgress > 0 && (
          <IconButton
            title="重置所有学习进度"
            onClick={() => { if (confirm('确定重置所有学习进度？此操作不可撤销。')) resetAll() }}
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M3 12a9 9 0 1 0 3-6.7" />
              <path d="M3 4v5h5" />
            </svg>
          </IconButton>
        )}

        <IconButton
          as="a"
          href={GITHUB_URL}
          title="GitHub 仓库"
          target="_blank"
          rel="noopener noreferrer"
        >
          {/* GitHub Octocat — official mark */}
          <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
            <path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.4 3-.405 1.02.005 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12" />
          </svg>
        </IconButton>
        </div>
      </div>
    </nav>
  )
}

type IconButtonProps = {
  title: string
  onClick?: () => void
  children: React.ReactNode
  as?: 'button' | 'a'
  href?: string
  target?: string
  rel?: string
}

function IconButton({ title, onClick, children, as = 'button', href, target, rel }: IconButtonProps) {
  const className =
    'inline-flex h-8 w-8 cursor-pointer items-center justify-center rounded-md no-underline transition-colors hover:bg-[color:var(--color-border)]'
  const style = { color: 'var(--color-text-muted)' }

  if (as === 'a') {
    return (
      <a className={className} style={style} title={title} href={href} target={target} rel={rel}>
        {children}
      </a>
    )
  }
  return (
    <button className={className} style={style} title={title} onClick={onClick}>
      {children}
    </button>
  )
}
