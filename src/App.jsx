import './App.css'
import { Canvas } from '@react-three/fiber'
import { Suspense } from 'react'
import Dog from './components/Dog'
import Navbar from './components/ui/Navbar'
import Hero from './components/sections/Hero'
import About from './components/sections/About'
import Projects from './components/sections/Projects'
import Skills from './components/sections/Skills'
import Achievements from './components/sections/Achievements'
import Contact from './components/sections/Contact'

function App() {
  return (
    <>
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
        <Hero />
        <About />
        <Projects />
        <Skills />
        <Achievements />
        <Contact />
      </main>
    </>
  )
}

export default App
