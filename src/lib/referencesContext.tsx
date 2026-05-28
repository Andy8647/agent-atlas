import { createContext, useContext } from 'react'

export interface Reference {
  id: string
  authors: string
  year: number | string
  title: string
  venue?: string
  url?: string
}

export const ReferencesContext = createContext<Reference[]>([])

export function useReferences() {
  return useContext(ReferencesContext)
}

export function useReference(id: string): { ref: Reference | null; index: number } {
  const refs = useReferences()
  const index = refs.findIndex((r) => r.id === id)
  return { ref: index === -1 ? null : refs[index], index }
}
