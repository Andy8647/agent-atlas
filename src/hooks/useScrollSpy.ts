import { useEffect, useState, useRef } from 'react'

interface TocItem {
  id: string
  text: string
  level: number
}

export function useScrollSpy() {
  const [items, setItems] = useState<TocItem[]>([])
  const [activeId, setActiveId] = useState<string>('')
  const observer = useRef<IntersectionObserver | null>(null)

  useEffect(() => {
    const article = document.querySelector('article.prose')
    if (!article) return

    // Collect all h2 and h3 headings
    const headings = article.querySelectorAll('h2, h3')
    const toc: TocItem[] = []
    headings.forEach((h, i) => {
      const id = h.id || `heading-${i}`
      if (!h.id) h.id = id
      toc.push({
        id,
        text: h.textContent || '',
        level: h.tagName === 'H2' ? 2 : 3,
      })
    })
    setItems(toc)

    // Set up intersection observer
    observer.current = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            setActiveId(entry.target.id)
          }
        }
      },
      { rootMargin: '-80px 0px -70% 0px', threshold: 0 }
    )

    headings.forEach((h) => observer.current?.observe(h))

    return () => observer.current?.disconnect()
  }, [])

  return { items, activeId }
}
