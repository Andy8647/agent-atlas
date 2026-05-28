import { HashRouter, Routes, Route, useLocation } from 'react-router-dom'
import { Navbar } from './components/layout/Navbar'
import { Footer } from './components/layout/Footer'
import { RoadmapPage } from './routes/RoadmapPage'
import { ArticlePage } from './routes/ArticlePage'
import { ThemeProvider } from './lib/themeContext'
import { CommandPalette } from './components/layout/CommandPalette'

function AppContent() {
  const location = useLocation()
  const isRoadmap = location.pathname === '/'

  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />
      <main className={isRoadmap ? 'flex-1' : 'flex-1'}>
        <Routes>
          <Route path="/" element={<RoadmapPage />} />
          <Route path="/article/:slug" element={<ArticlePage />} />
        </Routes>
      </main>
      {!isRoadmap && <Footer />}
      <CommandPalette />
    </div>
  )
}

export default function App() {
  return (
    <ThemeProvider>
      <HashRouter>
        <AppContent />
      </HashRouter>
    </ThemeProvider>
  )
}
