import { useRef } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { useGSAP } from '@gsap/react'
import { skills } from '../../data/portfolio'

gsap.registerPlugin(ScrollTrigger)

const skillColors = {
  'C++': '#00b4d8',
  'Java': '#f59e0b',
  'Python': '#3b82f6',
  'JavaScript': '#facc15',
  'TypeScript': '#6366f1',
  'React.js': '#61dafb',
  'Node.js': '#84cc16',
  'Express.js': '#10b981',
  'MongoDB': '#22c55e',
  'MySQL': '#f97316',
  'REST APIs': '#a855f7',
  'Three.js': '#e2e8f0',
  'GSAP': '#8bef6d',
  'Git': '#f43f5e',
  'Docker': '#38bdf8',
}

const SkillTag = ({ name, delay }) => {
  const color = skillColors[name] || '#6366f1'
  return (
    <span
      className="skill-pill"
      style={{ '--pill-color': color, '--pill-glow': `${color}33` }}
    >
      {name}
    </span>
  )
}

const Skills = () => {
  const sectionRef = useRef(null)

  useGSAP(() => {
    gsap.from('.skills-heading', {
      scrollTrigger: { trigger: '.skills-heading', start: 'top 85%' },
      y: 60, opacity: 0, duration: 0.8, ease: 'power3.out',
    })

    gsap.from('.skill-pill', {
      scrollTrigger: { trigger: '.skills-lang-group', start: 'top 80%' },
      scale: 0.5, opacity: 0, duration: 0.5,
      stagger: { amount: 0.8, from: 'start' },
      ease: 'back.out(1.7)',
    })

    gsap.from('.skill-core-item', {
      scrollTrigger: { trigger: '.skills-core-group', start: 'top 83%' },
      x: -40, opacity: 0, duration: 0.6,
      stagger: 0.1, ease: 'power3.out',
    })

    gsap.from('.skills-category-label', {
      scrollTrigger: { trigger: '.skills-grid', start: 'top 82%' },
      y: 20, opacity: 0, duration: 0.5, stagger: 0.12, ease: 'power2.out',
    })
  }, { scope: sectionRef })

  return (
    <section id="skills" ref={sectionRef} className="skills-section">
      <div className="section-container">
        <div className="section-label">
          <span className="section-label-line" />
          <span>Tech Stack</span>
        </div>

        <h2 className="skills-heading section-heading">
          My <span className="gradient-text">Skills</span>
        </h2>

        <div className="skills-grid">
          {/* Languages */}
          <div className="skills-group">
            <p className="skills-category-label">
              <i className="ri-code-s-slash-line" /> Languages
            </p>
            <div className="skills-lang-group skills-pills">
              {skills.languages.map((s) => <SkillTag key={s} name={s} />)}
            </div>
          </div>

          {/* Technologies */}
          <div className="skills-group">
            <p className="skills-category-label">
              <i className="ri-stack-line" /> Technologies & Frameworks
            </p>
            <div className="skills-pills">
              {skills.tech.map((s) => <SkillTag key={s} name={s} />)}
            </div>
          </div>

          {/* Core CS */}
          <div className="skills-group skills-core-group">
            <p className="skills-category-label">
              <i className="ri-brain-line" /> Core Computer Science
            </p>
            <div className="skills-core-list">
              {skills.core.map((item, i) => (
                <div key={item} className="skill-core-item glass-card">
                  <span className="skill-core-num">0{i + 1}</span>
                  <span className="skill-core-name">{item}</span>
                  <i className="ri-arrow-right-line skill-core-arrow" />
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

export default Skills
