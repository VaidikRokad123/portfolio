import { useRef } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { useGSAP } from '@gsap/react'
import { personalInfo } from '../../data/portfolio'

gsap.registerPlugin(ScrollTrigger)

const About = () => {
  const sectionRef = useRef(null)

  useGSAP(() => {
    // Heading reveal
    gsap.from('.about-heading', {
      scrollTrigger: { trigger: '.about-heading', start: 'top 85%' },
      y: 60, opacity: 0, duration: 0.8, ease: 'power3.out',
    })

    // Left column
    gsap.from('.about-edu-card', {
      scrollTrigger: { trigger: '.about-edu-card', start: 'top 82%' },
      x: -60, opacity: 0, duration: 0.9, ease: 'power3.out',
    })

    // Right column — stagger cards
    gsap.from('.about-cp-card', {
      scrollTrigger: { trigger: '.about-cp-grid', start: 'top 80%' },
      y: 50, opacity: 0, duration: 0.7, stagger: 0.15, ease: 'power3.out',
    })

    // Animate CGPA counter
    const cgpaEl = document.querySelector('.about-cgpa-value')
    if (cgpaEl) {
      ScrollTrigger.create({
        trigger: cgpaEl,
        start: 'top 85%',
        once: true,
        onEnter: () => {
          gsap.to({ val: 0 }, {
            val: 8.33,
            duration: 1.5,
            ease: 'power2.out',
            onUpdate: function () { cgpaEl.textContent = this.targets()[0].val.toFixed(2) },
          })
        },
      })
    }

    // Coursework tags stagger
    gsap.from('.about-tag', {
      scrollTrigger: { trigger: '.about-tags', start: 'top 85%' },
      scale: 0.7, opacity: 0, duration: 0.5, stagger: 0.07, ease: 'back.out(1.7)',
    })
  }, { scope: sectionRef })

  return (
    <section id="about" ref={sectionRef} className="about-section">
      <div className="section-container">

        {/* Section label */}
        <div className="section-label">
          <span className="section-label-line" />
          <span>About Me</span>
        </div>

        <h2 className="about-heading section-heading">
          Passionate about <span className="gradient-text">building</span> &amp;{' '}
          <span className="gradient-text">competing</span>
        </h2>

        <div className="about-grid">
          {/* LEFT — Education */}
          <div className="about-left">
            <p className="about-bio">
              I&apos;m a Computer Science student at Nirma University with a strong foundation 
              in full-stack development, competitive programming, and AI systems. I thrive at 
              the intersection of clean code and creative problem-solving.
            </p>

            <div className="about-edu-card glass-card">
              <div className="about-edu-icon">
                <i className="ri-graduation-cap-line" />
              </div>
              <div className="about-edu-info">
                <p className="about-edu-degree">{personalInfo.education.degree}</p>
                <p className="about-edu-uni">{personalInfo.education.university}</p>
                <p className="about-edu-loc">
                  <i className="ri-map-pin-line" /> {personalInfo.education.location}
                  <span className="about-edu-period"> · {personalInfo.education.period}</span>
                </p>
                <div className="about-edu-cgpa">
                  <span className="about-cgpa-label">CGPA</span>
                  <span className="about-cgpa-value">0.00</span>
                  <span className="about-cgpa-max"> / 10</span>
                </div>
              </div>
            </div>

            <div className="about-tags-label">Relevant Coursework</div>
            <div className="about-tags">
              {personalInfo.education.coursework.map((tag) => (
                <span key={tag} className="about-tag">{tag}</span>
              ))}
            </div>
          </div>

          {/* RIGHT — Competitive Programming */}
          <div className="about-right">
            <p className="about-cp-title">Competitive Programming</p>
            <div className="about-cp-grid">
              {personalInfo.competitive.map((item) => (
                <a
                  key={item.platform}
                  href={item.link}
                  target="_blank"
                  rel="noreferrer"
                  className="about-cp-card glass-card"
                  style={{ '--cp-color': item.color }}
                >
                  <div className="about-cp-platform">{item.platform}</div>
                  <div className="about-cp-rating" style={{ color: item.color }}>
                    {item.rating}
                  </div>
                  <div className="about-cp-detail">{item.detail}</div>
                  <div className="about-cp-glow" style={{ background: item.color }} />
                </a>
              ))}
            </div>

            <div className="about-stats-row">
              <div className="about-stat">
                <span className="about-stat-value">500+</span>
                <span className="about-stat-label">Problems Solved</span>
              </div>
              <div className="about-stat">
                <span className="about-stat-value">3</span>
                <span className="about-stat-label">Platforms</span>
              </div>
              <div className="about-stat">
                <span className="about-stat-value">Top 5%</span>
                <span className="about-stat-label">LeetCode Global</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

export default About
