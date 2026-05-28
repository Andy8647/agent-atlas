import { useReferences } from '../../lib/referencesContext'

export function References() {
  const refs = useReferences()
  if (refs.length === 0) return null

  return (
    <section className="references mt-12 border-t pt-6" style={{ borderColor: 'var(--color-border)' }}>
      <h2
        className="mb-4 text-base font-semibold uppercase tracking-wider"
        style={{ color: 'var(--color-text-muted)' }}
      >
        References
      </h2>
      <ol className="references-list space-y-2.5 text-sm">
        {refs.map((ref, i) => (
          <li
            key={ref.id}
            id={`ref-${ref.id}`}
            className="grid grid-cols-[2rem_1fr] items-baseline gap-2 scroll-mt-20"
            style={{ color: '#475569' }}
          >
            <span className="text-right font-mono text-xs" style={{ color: 'var(--color-text-muted)' }}>
              [{i + 1}]
            </span>
            <span>
              <span className="font-medium" style={{ color: '#1e293b' }}>{ref.authors}</span>{' '}
              <span style={{ color: 'var(--color-text-muted)' }}>({ref.year}).</span>{' '}
              <span style={{ color: '#1e293b' }}>{ref.title}</span>
              {ref.venue && (
                <>
                  {'. '}
                  <em>{ref.venue}</em>
                </>
              )}
              {ref.url && (
                <>
                  {' · '}
                  <a
                    href={ref.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="break-all"
                    style={{ color: 'var(--color-primary)' }}
                  >
                    {ref.url.replace(/^https?:\/\//, '')}
                  </a>
                </>
              )}
            </span>
          </li>
        ))}
      </ol>
    </section>
  )
}
