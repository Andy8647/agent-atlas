import { useEffect, useState } from 'react'

const STORAGE_KEY = 'article-sidebar-collapsed'

export function useSidebarCollapsed() {
  const [collapsed, setCollapsed] = useState<boolean>(() => {
    if (typeof window === 'undefined') return false
    return localStorage.getItem(STORAGE_KEY) === 'true'
  })

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, String(collapsed))
  }, [collapsed])

  return [collapsed, setCollapsed] as const
}
