import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.jsx'
import { initLenis } from './hooks/useLenis.js'

// Initialize Lenis smooth scrolling (synced with GSAP ScrollTrigger)
initLenis()

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
