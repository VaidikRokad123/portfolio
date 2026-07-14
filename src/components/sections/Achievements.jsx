import { useRef } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { useGSAP } from '@gsap/react'
import { achievements } from '../../data/portfolio'
import { revealTypewriter } from '../../utils/reveal'

gsap.registerPlugin(ScrollTrigger)

const Achievements = () => {
  const sectionRef = useRef(null)

  useGSAP(() => {
    const q = gsap.utils.selector(sectionRef)
    revealTypewriter(q('.ach-heading')[0])

    // Timeline line grows downward
    gsap.from('.ach-timeline-track', {
      scrollTrigger: { trigger: '.ach-timeline', start: 'top 80%', end: 'bottom 60%', scrub: 1 },
      scaleY: 0,
      transformOrigin: 'top center',
      ease: 'none',
    })

    // Each item slides in alternating left/right
    gsap.utils.toArray('.ach-item').forEach((item, i) => {
      gsap.from(item, {
        scrollTrigger: { trigger: item, start: 'top 85%' },
        x: i % 2 === 0 ? -60 : 60,
        opacity: 0,
        duration: 0.75,
        ease: 'cubic-bezier(0.23, 1, 0.32, 1)',
      })
    })

    // Dot pulse on enter — emil-design-eng: never animate from scale(0)
    gsap.utils.toArray('.ach-dot').forEach((dot) => {
      gsap.from(dot, {
        scrollTrigger: { trigger: dot, start: 'top 88%' },
        scale: 0.6,
        opacity: 0,
        duration: 0.4,
        ease: 'back.out(2)',
      })
    })
  }, { scope: sectionRef })

  return (
    <section id="achievements" ref={sectionRef} className="ach-section">
      <div className="section-container">
        <div className="section-label">
          <span className="section-num">02</span>
          <span className="section-label-line" />
          <span>Recognition</span>
        </div>

        <h2 className="ach-heading section-heading">
          Milestones &amp; <span className="gradient-text">Achievements</span>
        </h2>

        <div className="ach-timeline">
          <div className="ach-timeline-track" />

          {achievements.map((item, i) => (
            <div
              key={item.title}
              className={`ach-item ${i % 2 === 0 ? 'ach-item--left' : 'ach-item--right'}`}
            >
              <div className="ach-dot" style={{ background: item.color, boxShadow: `0 0 16px ${item.color}` }} />
              <div className="ach-card glass-card" style={{ '--ach-color': item.color }}>
                <div className="ach-card-top">
                  <span className="ach-icon" style={{ background: `${item.color}22`, color: item.color }}>
                    <i className={item.icon} />
                  </span>
                </div>
                <h3 className="ach-title" style={{ color: item.color }}>{item.title}</h3>
                <p className="ach-subtitle">{item.subtitle}</p>
                <p className="ach-desc">{item.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

export default Achievements
