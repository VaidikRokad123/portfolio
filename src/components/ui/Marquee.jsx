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
    const loop = gsap.to(track, {
      xPercent: -50,
      duration: 24,
      ease: 'none',
      repeat: -1,
    })
    loop.timeScale(direction)

    let resetCall
    const st = ScrollTrigger.create({
      trigger: wrapRef.current,
      onUpdate: (self) => {
        const v = self.getVelocity()
        gsap.to(track, {
          skewX: gsap.utils.clamp(-10, 10, v / -120),
          duration: 0.3,
          overwrite: true,
        })
        loop.timeScale(direction * (1 + gsap.utils.clamp(0, 3, Math.abs(v) / 250)))
        resetCall?.kill()
        resetCall = gsap.delayedCall(0.2, () => {
          gsap.to(track, { skewX: 0, duration: 0.5, ease: 'power2.out', overwrite: true })
          loop.timeScale(direction)
        })
      },
    })

    return () => {
      st.kill()
      loop.kill()
      resetCall?.kill()
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
