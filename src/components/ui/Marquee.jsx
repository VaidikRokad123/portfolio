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

    // Animate from 0 to -35% (or vice versa) to scroll left/right dynamically as you scroll up/down
    const startX = direction > 0 ? 0 : -35
    const endX = direction > 0 ? -35 : 0

    gsap.fromTo(track,
      { xPercent: startX },
      {
        xPercent: endX,
        ease: 'none',
        scrollTrigger: {
          trigger: wrap,
          start: 'top bottom',
          end: 'bottom top',
          scrub: 1.2, // Gives it a very premium, smooth lagging effect
        }
      }
    )
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
