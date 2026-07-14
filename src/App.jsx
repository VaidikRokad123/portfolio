import './App.css'
import { Canvas } from '@react-three/fiber'
import { Suspense, useState } from 'react'
import Dog from './components/Dog'
import Navbar from './components/ui/Navbar'
import ScrollProgress from './components/ui/ScrollProgress'
import Cursor from './components/ui/Cursor'
import Preloader from './components/ui/Preloader'
import Marquee from './components/ui/Marquee'
import Hero from './components/sections/Hero'
import About from './components/sections/About'
import Experience from './components/sections/Experience'
import Projects from './components/sections/Projects'
import Skills from './components/sections/Skills'
import Achievements from './components/sections/Achievements'
import Contact from './components/sections/Contact'

function App() {
  const [loaded, setLoaded] = useState(false)

  return (
    <>
      {!loaded && <Preloader onComplete={() => setLoaded(true)} />}

      {/* Custom cursor (no-op on touch devices) */}
      <Cursor />

      {/* Drifting aurora glow blobs — behind everything */}
      <div className="bg-aurora" aria-hidden="true">
        <div className="aurora-blob aurora-blob--1" />
        <div className="aurora-blob aurora-blob--2" />
        <div className="aurora-blob aurora-blob--3" />
      </div>

      {/* Film grain texture overlay */}
      <div className="bg-grain" aria-hidden="true" />

      {/* Scroll progress bar */}
      <ScrollProgress isPageLoaded={loaded} />

      {/* Fixed 3D Canvas — transparent so body bg-image shows through */}
      <Canvas
        id="canvas-elem"
        gl={{ alpha: true, antialias: true }}
        style={{
          height: '100vh',
          width: '100vw',
          position: 'fixed',
          top: 0,
          left: 0,
          zIndex: 1,
          background: 'transparent',
        }}
      >
        <Suspense fallback={null}>
          <Dog />
        </Suspense>
      </Canvas>

      {/* Navbar — fixed on top */}
      <Navbar />

      {/* Page sections */}
      <main>
        <Hero loaded={loaded} />
        <Marquee
          items={[
            'Full Stack Developer',
            'Problem Solver',
            'AI Enthusiast',
            'Competitive Programmer',
          ]}
        />
        <About />
        <Experience />
        <Projects />
        <Skills />
        <Achievements />
        <Contact />
      </main>
    </>
  )
}

export default App
