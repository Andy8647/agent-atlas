import { createRoot } from 'react-dom/client'
import './index.css'
import '@xyflow/react/dist/style.css'
import 'katex/dist/katex.min.css'
import App from './App'

createRoot(document.getElementById('root')!).render(<App />)
