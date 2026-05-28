import { Link } from 'react-router-dom'
import type { TreeNode } from '../../lib/types'
import { useScrollSpy } from '../../hooks/useScrollSpy'

interface ArticleSidebarProps {
  prerequisites: TreeNode[]
  nextNodes: TreeNode[]
  onCollapse?: () => void
}

export function ArticleSidebar({ prerequisites, nextNodes, onCollapse }: ArticleSidebarProps) {
  const { items, activeId } = useScrollSpy()

  return (
    <aside className="hidden w-64 shrink-0 lg:block">
      <div className="sticky top-6 space-y-8 text-[13px]">
        {onCollapse && (
          <button
            onClick={onCollapse}
            title="收起侧栏"
            className="flex h-7 w-7 cursor-pointer items-center justify-center rounded-md border transition-colors hover:bg-slate-100"
            style={{ borderColor: 'var(--color-border)', color: 'var(--color-text-muted)' }}
          >
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <rect x="3" y="3" width="18" height="18" rx="2" />
              <path d="M9 3v18" />
              <path d="m16 15-3-3 3-3" />
            </svg>
          </button>
        )}

        {prerequisites.length > 0 && (
          <SidebarSection title="前置知识">
            <ul className="space-y-1.5">
              {prerequisites.map((p) => (
                <li key={p.slug}>
                  <Link
                    to={`/article/${p.slug}`}
                    className="block no-underline transition-colors"
                    style={{ color: 'var(--color-primary)' }}
                  >
                    {p.title}
                  </Link>
                </li>
              ))}
            </ul>
          </SidebarSection>
        )}

        {items.length > 0 && (
          <SidebarSection title="目录">
            <nav className="relative">
              {/* Vertical guide line */}
              <div
                className="absolute bottom-0 left-0 top-0 w-px"
                style={{ background: 'var(--color-border)' }}
              />
              <ul className="space-y-0.5">
                {items.map((item) => {
                  const isActive = item.id === activeId
                  const isH3 = item.level === 3
                  return (
                    <li key={item.id}>
                      <a
                        href={`#${item.id}`}
                        className="relative block py-1 leading-snug no-underline transition-all"
                        style={{
                          paddingLeft: isH3 ? '1.5rem' : '0.75rem',
                          color: isActive
                            ? 'var(--color-primary)'
                            : isH3
                              ? '#94a3b8'
                              : '#475569',
                          fontWeight: isActive ? 500 : 400,
                          fontSize: isH3 ? '12px' : '13px',
                        }}
                      >
                        {/* Active indicator — overlays the guide line */}
                        {isActive && (
                          <span
                            className="absolute bottom-0 left-0 top-0 w-px"
                            style={{ background: 'var(--color-primary)' }}
                          />
                        )}
                        {item.text}
                      </a>
                    </li>
                  )
                })}
              </ul>
            </nav>
          </SidebarSection>
        )}

        {nextNodes.length > 0 && (
          <SidebarSection title="下一步">
            <ul className="space-y-1.5">
              {nextNodes.map((n) => (
                <li key={n.slug}>
                  <Link
                    to={`/article/${n.slug}`}
                    className="block no-underline transition-colors"
                    style={{ color: 'var(--color-primary)' }}
                  >
                    {n.title}
                  </Link>
                </li>
              ))}
            </ul>
          </SidebarSection>
        )}
      </div>
    </aside>
  )
}

function SidebarSection({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div>
      <h3
        className="mb-2.5 text-[11px] font-semibold uppercase tracking-wider"
        style={{ color: '#94a3b8' }}
      >
        {title}
      </h3>
      {children}
    </div>
  )
}
