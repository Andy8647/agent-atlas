import { GITHUB_URL } from '../../lib/constants'

export function Footer() {
  return (
    <footer className="border-t py-6 text-center text-sm" style={{ borderColor: 'var(--color-border)', color: 'var(--color-text-muted)' }}>
      <p>
        Built with React + Vite + MDX &middot;{' '}
        <a href={GITHUB_URL} target="_blank" rel="noopener noreferrer" className="underline" style={{ color: 'var(--color-primary)' }}>
          Open Source on GitHub
        </a>
      </p>
    </footer>
  )
}
