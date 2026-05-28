import { useReference } from '../../lib/referencesContext'

interface CiteProps {
  id: string
}

export function Cite({ id }: CiteProps) {
  const { ref, index } = useReference(id)

  if (!ref) {
    return (
      <sup
        title={`Unknown citation id: ${id}`}
        style={{ color: '#dc2626', fontWeight: 600 }}
      >
        [?]
      </sup>
    )
  }

  return (
    <sup>
      <a
        href={`#ref-${id}`}
        title={`${ref.authors} (${ref.year}). ${ref.title}`}
        className="cite-link"
        onClick={(e) => {
          // Smooth-scroll plus visual flash
          e.preventDefault()
          const target = document.getElementById(`ref-${id}`)
          if (!target) return
          target.scrollIntoView({ behavior: 'smooth', block: 'center' })
          target.classList.add('cite-flash')
          setTimeout(() => target.classList.remove('cite-flash'), 1400)
          history.replaceState(null, '', `#ref-${id}`)
        }}
      >
        [{index + 1}]
      </a>
    </sup>
  )
}
