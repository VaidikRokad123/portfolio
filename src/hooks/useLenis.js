import Lenis from 'lenis'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

let lenisInstance = null

export function initLenis() {
  if (lenisInstance) return lenisInstance

  const lenis = new Lenis({
    duration: 1.2,
    easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
    orientation: 'vertical',
    smoothWheel: true,
  })

  // Sync Lenis scroll events with GSAP ScrollTrigger
  lenis.on('scroll', ScrollTrigger.update)

  // Use GSAP ticker to drive Lenis RAF so they stay in sync
  gsap.ticker.add((time) => {
    lenis.raf(time * 1000)
  })

  gsap.ticker.lagSmoothing(0)

  lenisInstance = lenis
  if (typeof window !== 'undefined') window.__lenis = lenis
  return lenis
}

export function getLenis() {
  return lenisInstance
}
