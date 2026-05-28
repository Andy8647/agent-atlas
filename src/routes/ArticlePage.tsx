import { useMemo } from 'react'
import { useParams, Link } from 'react-router-dom'
import { MDXProvider } from '@mdx-js/react'
import { treeData } from '../content/tree'
import { getNodeBySlug, getPrerequisites, getNextNodes, getClusterForNode } from '../lib/tree'
import { ArticleSidebar } from '../components/article/ArticleSidebar'
import { ProgressToggle } from '../components/article/ProgressToggle'
import { CLUSTER_COLORS } from '../lib/constants'
import { mdxComponents } from '../lib/mdxComponents'
import { useSidebarCollapsed } from '../hooks/useSidebarCollapsed'
import { ReferencesContext, type Reference } from '../lib/referencesContext'
import { References } from '../components/article/References'
import type { ComponentType } from 'react'

interface MdxModule {
  default: ComponentType
  frontmatter?: { references?: Reference[]; [k: string]: unknown }
}

// Glob-import all MDX articles at build time
const mdxModules = import.meta.glob<MdxModule>(
  '../../content/articles/*.mdx',
  { eager: true }
)

function getMdxModule(slug: string): MdxModule | null {
  for (const [path, mod] of Object.entries(mdxModules)) {
    if (path.endsWith(`/${slug}.mdx`)) return mod
  }
  return null
}

export function ArticlePage() {
  const { slug } = useParams<{ slug: string }>()
  const node = slug ? getNodeBySlug(treeData.clusters, slug) : undefined
  const cluster = slug ? getClusterForNode(treeData.clusters, slug) : undefined
  const prerequisites = slug ? getPrerequisites(treeData.clusters, slug) : []
  const nextNodes = slug ? getNextNodes(treeData.clusters, slug) : []

  const mdxModule = useMemo(() => (slug ? getMdxModule(slug) : null), [slug])
  const ArticleContent = mdxModule?.default ?? null
  const references = mdxModule?.frontmatter?.references ?? []
  const [collapsed, setCollapsed] = useSidebarCollapsed()

  if (!node || !slug) {
    return (
      <div className="mx-auto max-w-3xl px-4 py-20 text-center">
        <h1 className="mb-4 text-2xl font-bold">文章未找到</h1>
        <p className="mb-6" style={{ color: 'var(--color-text-muted)' }}>slug: {slug}</p>
        <Link to="/" className="inline-block rounded px-4 py-2 font-medium text-white no-underline" style={{ background: 'var(--color-primary)' }}>
          返回学习路线图
        </Link>
      </div>
    )
  }

  return (
    <div className="mx-auto flex max-w-7xl gap-10 px-4 py-8">
      {!collapsed && (
        <ArticleSidebar
          prerequisites={prerequisites}
          nextNodes={nextNodes}
          onCollapse={() => setCollapsed(true)}
        />
      )}
      {collapsed && (
        <button
          onClick={() => setCollapsed(false)}
          title="展开侧栏"
          className="sticky top-6 hidden h-8 w-8 shrink-0 cursor-pointer items-center justify-center rounded-md border transition-colors hover:bg-slate-100 lg:flex"
          style={{ borderColor: 'var(--color-border)', color: 'var(--color-text-muted)' }}
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <rect x="3" y="3" width="18" height="18" rx="2" />
            <path d="M9 3v18" />
            <path d="m14 9 3 3-3 3" />
          </svg>
        </button>
      )}
      <article className="prose min-w-0 flex-1">
        <header className="mb-8">
          {cluster && (
            <span
              className="mb-2 inline-block rounded-full px-3 py-1 text-xs font-semibold text-white"
              style={{ background: CLUSTER_COLORS[cluster.id] || 'var(--color-primary)' }}
            >
              {cluster.title}
            </span>
          )}
          <h1 className="mb-2 mt-2 text-3xl font-extrabold" style={{ color: 'var(--color-text)' }}>
            {node.title}
          </h1>
          <div className="flex items-center gap-4 text-sm" style={{ color: 'var(--color-text-muted)' }}>
            <span>阅读时间约 {node.estimatedMinutes} 分钟</span>
            <ProgressToggle slug={slug} />
          </div>
        </header>

        <div className="article-body rounded-lg border p-8" style={{ borderColor: 'var(--color-border)', background: 'var(--color-surface)' }}>
          {ArticleContent ? (
            <ReferencesContext.Provider value={references}>
              <MDXProvider components={mdxComponents}>
                <ArticleContent />
              </MDXProvider>
              <References />
            </ReferencesContext.Provider>
          ) : (
            <div className="py-12 text-center" style={{ color: 'var(--color-text-muted)' }}>
              <p className="mb-2 text-lg">文章内容正在编写中</p>
              <p className="text-sm">
                <code className="rounded px-1 py-0.5 text-xs" style={{ background: 'var(--color-border)' }}>
                  content/articles/{slug}.mdx
                </code>
              </p>
            </div>
          )}
        </div>

        <footer className="mt-8 flex items-center justify-between">
          {prerequisites.length > 0 && (
            <div>
              <span className="text-sm" style={{ color: 'var(--color-text-muted)' }}>前置知识：</span>
              {prerequisites.map((p) => (
                <Link key={p.slug} to={`/article/${p.slug}`} className="ml-1 text-sm no-underline hover:underline" style={{ color: 'var(--color-primary)' }}>
                  {p.title}
                </Link>
              ))}
            </div>
          )}
          {nextNodes.length > 0 && (
            <div className="ml-auto">
              <span className="text-sm" style={{ color: 'var(--color-text-muted)' }}>下一步：</span>
              {nextNodes.map((n) => (
                <Link key={n.slug} to={`/article/${n.slug}`} className="ml-1 text-sm no-underline hover:underline" style={{ color: 'var(--color-primary)' }}>
                  {n.title}
                </Link>
              ))}
            </div>
          )}
        </footer>
      </article>
    </div>
  )
}

