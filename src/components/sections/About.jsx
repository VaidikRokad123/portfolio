import { useRef } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { useGSAP } from '@gsap/react'
import { personalInfo } from '../../data/portfolio'
import { revealBouncy, revealLines } from '../../utils/reveal'

gsap.registerPlugin(ScrollTrigger)

const cpData = [
  {
    platform: 'LeetCode',
    rating: '1863',
    badge: 'Knight · Top 5%',
    color: '#f59e0b',
    icon: 'ri-trophy-line',
    link: 'https://leetcode.com/u/harry0018/',
  },
  {
    platform: 'CodeChef',
    rating: '3★',
    badge: '3-Star Rated',
    color: '#c084fc',
    icon: 'ri-star-line',
    link: 'https://www.codechef.com/users/harry0018',
  },
  {
    platform: 'Codeforces',
    rating: '1369',
    badge: 'Pupil',
    color: '#60a5fa',
    icon: 'ri-code-line',
    link: 'https://codeforces.com/profile/harry0018',
  },
]

const About = () => {
  const sectionRef = useRef(null)

  useGSAP(() => {
    const q = gsap.utils.selector(sectionRef)
    revealBouncy(q('.about-heading')[0])
    revealLines(q('.about-bio')[0])
    gsap.from('.about-edu-card', {
      scrollTrigger: { trigger: '.about-edu-card', start: 'top 85%', once: true },
      x: -40, opacity: 0, duration: 0.8, ease: 'power3.out',
    })
    // CP cards: only translate, NO opacity so they're never invisible
    gsap.from('.cp-card', {
      scrollTrigger: { trigger: '.about-cp-grid', start: 'top 92%', once: true },
      y: 20, duration: 0.5, stagger: 0.1, ease: 'power3.out',
    })
    gsap.from('.about-stat-card', {
      scrollTrigger: { trigger: '.about-stats-row', start: 'top 92%', once: true },
      y: 15, duration: 0.45, stagger: 0.08, ease: 'power3.out',
    })

    // CGPA counter
    const cgpaEl = document.querySelector('.about-cgpa-value')
    if (cgpaEl) {
      ScrollTrigger.create({
        trigger: cgpaEl, start: 'top 88%', once: true,
        onEnter: () => {
          gsap.to({ val: 0 }, {
            val: 8.33, duration: 1.4, ease: 'power2.out',
            onUpdate: function () { cgpaEl.textContent = this.targets()[0].val.toFixed(2) },
          })
        },
      })
    }
  }, { scope: sectionRef })

  return (
    <section id="about" ref={sectionRef} className="about-section">
      <div className="section-container">

        <div className="section-label">
          <span className="section-num">01</span>
          <span className="section-label-line" />
          <span>About Me</span>
        </div>

        <h2 className="about-heading section-heading">
          Passionate about <span className="gradient-text">building</span> &amp;{' '}
          <span className="gradient-text">competing</span>
        </h2>

        <div className="about-grid">
          {/* ── LEFT — Education ── */}
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
          </div>

          {/* ── RIGHT — Competitive Programming ── */}
          <div className="about-right">
            <p className="about-cp-title">
              <i className="ri-sword-line" /> Competitive Programming
            </p>

            <div className="about-cp-grid">
              {cpData.map((item) => (
                <a
                  key={item.platform}
                  href={item.link}
                  target="_blank"
                  rel="noreferrer"
                  className="cp-card glass-card"
                  style={{ '--cp-color': item.color }}
                >
                  <div className="cp-card-left">
                    <div className="cp-icon" style={{ color: item.color, background: `${item.color}18` }}>
                      <i className={item.icon} />
                    </div>
                    <div>
                      <p className="cp-platform">{item.platform}</p>
                      <p className="cp-badge" style={{ color: item.color }}>{item.badge}</p>
                    </div>
                  </div>
                  <div className="cp-card-right">
                    <span className="cp-rating-num" style={{ color: item.color }}>
                      {item.rating}
                    </span>
                  </div>
                  <div className="cp-card-glow" style={{ background: item.color }} />
                </a>
              ))}
            </div>

            <div className="about-stats-row">
              {[
                { value: '500+', label: 'Problems Solved' },
                { value: '3', label: 'Platforms' },
                { value: 'Top 5%', label: 'LeetCode Rank' },
              ].map((s) => (
                <div key={s.label} className="about-stat-card glass-card">
                  <span className="about-stat-value">{s.value}</span>
                  <span className="about-stat-label">{s.label}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

export default About
