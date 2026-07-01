import { useRef } from 'react'
import gsap from 'gsap'
import { useGSAP } from '@gsap/react'

const HOVER_SELECTOR =
  'a, button, input, textarea, [data-cursor], .project-card, .skill-card, .cp-card'

const Cursor = () => {
  const dotRef = useRef(null)
  const ringRef = useRef(null)

  useGSAP(() => {
    // Skip entirely on touch / coarse-pointer devices
    if (!window.matchMedia('(pointer: fine)').matches) return

    document.documentElement.classList.add('has-custom-cursor')

    const dot = dotRef.current
    const ring = ringRef.current

    const xDot = gsap.quickTo(dot, 'x', { duration: 0.15, ease: 'power3' })
    const yDot = gsap.quickTo(dot, 'y', { duration: 0.15, ease: 'power3' })
    const xRing = gsap.quickTo(ring, 'x', { duration: 0.45, ease: 'power3' })
    const yRing = gsap.quickTo(ring, 'y', { duration: 0.45, ease: 'power3' })

    let visible = false
    let activeMagnet = null

    const showCursor = (e) => {
      if (!visible) {
        visible = true
        gsap.to([dot, ring], { autoAlpha: 1, duration: 0.3 })
      }
      xDot(e.clientX)
      yDot(e.clientY)
      xRing(e.clientX)
      yRing(e.clientY)
    }

    const onMove = (e) => {
      showCursor(e)

      const t = e.target
      const hovering = t.closest?.(HOVER_SELECTOR)
      ring.classList.toggle('cursor-ring--hover', !!hovering)

      // Magnetic pull
      const magnet = t.closest?.('[data-magnetic]')
      if (magnet) {
        const r = magnet.getBoundingClientRect()
        const rx = e.clientX - (r.left + r.width / 2)
        const ry = e.clientY - (r.top + r.height / 2)
        
        // Clamp to a maximum displacement of 10px to prevent button drift/overlap
        const maxDisplacement = 10
        const targetX = Math.max(-maxDisplacement, Math.min(maxDisplacement, rx * 0.25))
        const targetY = Math.max(-maxDisplacement, Math.min(maxDisplacement, ry * 0.25))

        gsap.to(magnet, {
          x: targetX,
          y: targetY,
          duration: 0.35,
          ease: 'power2.out',
        })
        activeMagnet = magnet
      } else if (activeMagnet) {
        gsap.to(activeMagnet, { x: 0, y: 0, duration: 0.5, ease: 'power2.out' })
        activeMagnet = null
      }
    }

    // Re-show cursor immediately when mouse re-enters the window
    const onEnter = (e) => {
      showCursor(e)
    }

    const onDown = () => ring.classList.add('cursor-ring--down')
    const onUp = () => ring.classList.remove('cursor-ring--down')
    const onLeave = () => {
      visible = false
      gsap.to([dot, ring], { autoAlpha: 0, duration: 0.2 })
    }

    window.addEventListener('mousemove', onMove)
    window.addEventListener('mousedown', onDown)
    window.addEventListener('mouseup', onUp)
    document.addEventListener('mouseleave', onLeave)
    document.addEventListener('mouseenter', onEnter)

    return () => {
      window.removeEventListener('mousemove', onMove)
      window.removeEventListener('mousedown', onDown)
      window.removeEventListener('mouseup', onUp)
      document.removeEventListener('mouseleave', onLeave)
      document.removeEventListener('mouseenter', onEnter)
      document.documentElement.classList.remove('has-custom-cursor')
    }
  }, [])

  return (
    <>
      <div ref={ringRef} className="cursor-ring" aria-hidden="true" />
      <div ref={dotRef} className="cursor-dot" aria-hidden="true" />
    </>
  )
}

export default Cursor
