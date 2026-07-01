import { useRef } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { useGSAP } from '@gsap/react'

gsap.registerPlugin(ScrollTrigger)

const Marquee = ({ items, direction = 1 }) => {
  const trackRef = useRef(null)
  const wrapRef = useRef(null)

  useGSAP(() => {
    const track = trackRef.current
    const wrap = wrapRef.current
    if (!track || !wrap) return

    // 1. Create the base infinite scrolling loop (perfectly smooth, linear ease)
    const loop = gsap.to(track, {
      xPercent: -50,
      duration: 22,
      ease: 'none',
      repeat: -1,
    })
    loop.timeScale(direction)

    // 2. Listen to scroll events to dynamically accelerate the loop speed
    const st = ScrollTrigger.create({
      trigger: wrap,
      start: 'top bottom',
      end: 'bottom top',
      onUpdate: (self) => {
        const v = Math.abs(self.getVelocity())
        // Smoothly accelerate speed multiplier up to a maximum of 4.5x
        const speedMultiplier = 1 + gsap.utils.clamp(0, 3.5, v / 180)
        const targetSpeed = direction * speedMultiplier

        // Smoothly animate the timeScale to avoid any speed jumps
        gsap.to(loop, {
          timeScale: targetSpeed,
          duration: 0.35,
          ease: 'power1.out',
          overwrite: 'auto',
        })
      },
      onToggle: (self) => {
        // Pause loop when offscreen to optimize performance
        if (self.isActive) {
          loop.play()
        } else {
          loop.pause()
        }
      }
    })

    // 3. Smoothly decelerate back to normal speed when scroll stops
    const scrollStopListener = () => {
      gsap.to(loop, {
        timeScale: direction,
        duration: 0.5,
        ease: 'power2.out',
        overwrite: 'auto',
      })
    }
    window.addEventListener('scrollend', scrollStopListener)

    // Safety interval to catch stop even if scrollend event is not triggered
    const interval = setInterval(() => {
      if (!ScrollTrigger.isScrolling()) {
        gsap.to(loop, {
          timeScale: direction,
          duration: 0.5,
          ease: 'power2.out',
          overwrite: 'auto',
        })
      }
    }, 300)

    return () => {
      st.kill()
      loop.kill()
      window.removeEventListener('scrollend', scrollStopListener)
      clearInterval(interval)
    }
  }, { scope: wrapRef })

  const row = [...items, ...items]

  return (
    <div className="marquee" ref={wrapRef} aria-hidden="true">
      <div className="marquee-track" ref={trackRef}>
        {row.map((item, i) => (
          <span className="marquee-item" key={i}>
            {item}
            <span className="marquee-dot" />
          </span>
        ))}
      </div>
    </div>
  )
}

export default Marquee
