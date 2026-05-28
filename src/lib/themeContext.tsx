import { createContext, useContext, useEffect, useState, type ReactNode } from 'react'
import { MOCHA, LATTE, type Palette } from './constants'

export type ThemeMode = 'dark' | 'light'

interface ThemeContextValue {
  mode: ThemeMode
  palette: Palette
  toggle: () => void
  setMode: (m: ThemeMode) => void
}

const STORAGE_KEY = 'theme-mode'

const ThemeContext = createContext<ThemeContextValue | null>(null)

function getInitialMode(): ThemeMode {
  if (typeof window === 'undefined') return 'dark'
  const stored = localStorage.getItem(STORAGE_KEY) as ThemeMode | null
  if (stored === 'dark' || stored === 'light') return stored
  // Default to dark if user prefers, otherwise dark anyway (matches homepage RPG vibe)
  return window.matchMedia?.('(prefers-color-scheme: light)').matches ? 'light' : 'dark'
}

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [mode, setMode] = useState<ThemeMode>(getInitialMode)

  useEffect(() => {
    document.documentElement.dataset.theme = mode
    localStorage.setItem(STORAGE_KEY, mode)
  }, [mode])

  const value: ThemeContextValue = {
    mode,
    palette: mode === 'dark' ? MOCHA : LATTE,
    toggle: () => setMode((m) => (m === 'dark' ? 'light' : 'dark')),
    setMode,
  }

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>
}

export function useTheme() {
  const ctx = useContext(ThemeContext)
  if (!ctx) throw new Error('useTheme must be used within ThemeProvider')
  return ctx
}
