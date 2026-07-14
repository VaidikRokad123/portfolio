import { useRef } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { useGSAP } from '@gsap/react'
import { experience } from '../../data/portfolio'
import { revealBouncy } from '../../utils/reveal'

gsap.registerPlugin(ScrollTrigger)

const Experience = () => {
  const sectionRef = useRef(null)

  useGSAP(() => {
    const q = gsap.utils.selector(sectionRef)
    revealBouncy(q('.experience-heading')[0])

    gsap.from('.experience-item', {
      scrollTrigger: { trigger: '.experience-timeline', start: 'top 85%', once: true },
      y: 40,
      opacity: 0,
      duration: 0.8,
      ease: 'cubic-bezier(0.23, 1, 0.32, 1)', // Emil custom ease-out
    })
  }, { scope: sectionRef })

  const exp = experience[0] // Single experience node (Saeculum Solutions Intern)

  return (
    <section id="experience" ref={sectionRef} className="experience-section">
      <div className="section-container">
        <h2 className="experience-heading section-heading">
          Work <span className="gradient-text">Experience</span>
        </h2>

        <div className="experience-timeline">
          <div className="experience-item">
            {/* Left Column — Role & Metadata */}
            <div className="experience-info-col">
              <span className="experience-icon-badge" style={{ color: exp.color, background: `${exp.color}1a` }}>
                <i className={exp.icon} />
              </span>
              <h3 className="experience-role-title">{exp.role}</h3>
              <p className="experience-company-name">{exp.company}</p>
              <div className="experience-meta-details">
                <span className="experience-meta-item">
                  <i className="ri-calendar-line" /> {exp.period}
                </span>
                <span className="experience-meta-item">
                  <i className="ri-map-pin-line" /> {exp.location}
                </span>
              </div>
            </div>

            {/* Right Column — Accomplishments */}
            <div className="experience-content-col">
              <ul className="experience-bullets-list">
                {exp.bullets.map((bullet, idx) => (
                  <li key={idx} className="experience-bullet-item">
                    <span className="experience-bullet-dot" style={{ background: exp.color }} />
                    <p className="experience-bullet-desc">{bullet}</p>
                  </li>
                ))}
              </ul>

              {/* Muted Pastel Tech Tags */}
              <div className="experience-tech-tags">
                {exp.tags.map((tag) => (
                  <span key={tag} className="experience-tech-tag" style={{ border: `1px solid ${exp.color}33`, color: exp.color }}>
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

export default Experience
