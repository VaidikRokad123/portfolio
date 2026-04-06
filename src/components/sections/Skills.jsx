import { useRef } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { useGSAP } from '@gsap/react'

gsap.registerPlugin(ScrollTrigger)

const skillCategories = [
  {
    id: 'languages',
    icon: 'ri-code-s-slash-line',
    title: 'Languages',
    color: '#818cf8',
    glow: 'rgba(129,140,248,0.28)',
    items: ['C++', 'Java', 'Python', 'JavaScript', 'TypeScript'],
  },
  {
    id: 'tech',
    icon: 'ri-stack-line',
    title: 'Technologies & Frameworks',
    color: '#c084fc',
    glow: 'rgba(192,132,252,0.28)',
    items: ['React.js', 'Node.js', 'Express.js', 'MongoDB', 'MySQL', 'REST APIs', 'Three.js', 'GSAP', 'Git', 'Docker'],
  },
  {
    id: 'core',
    icon: 'ri-brain-line',
    title: 'Core Computer Science',
    color: '#60a5fa',
    glow: 'rgba(96,165,250,0.28)',
    items: ['Data Structures & Algorithms', 'Object-Oriented Programming', 'Operating Systems', 'Database Management Systems', 'Computer Networks'],
  },
]

const coursework = [
  'Data Structures & Algorithms',
  'Operating Systems',
  'Database Management Systems',
  'Computer Networks',
  'Machine Learning',
  'Object-Oriented Programming',
  'Software Engineering',
  'Compiler Design',
]

const Skills = () => {
  const sectionRef = useRef(null)

  useGSAP(() => {
    gsap.from('.skills-heading', {
      scrollTrigger: { trigger: '.skills-heading', start: 'top 88%', once: true },
      y: 40, opacity: 0, duration: 0.7, ease: 'power3.out',
    })
    gsap.from('.skill-card', {
      scrollTrigger: { trigger: '.skills-cards-grid', start: 'top 85%', once: true },
      y: 50, opacity: 0, duration: 0.6, stagger: 0.15, ease: 'power3.out',
    })
    gsap.from('.cw-tag', {
      scrollTrigger: { trigger: '.coursework-tags', start: 'top 88%', once: true },
      scale: 0.7, opacity: 0, duration: 0.4, stagger: 0.05, ease: 'back.out(1.7)',
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

        {/* Skill cards — simple tag-based, no percentages */}
        <div className="skills-cards-grid">
          {skillCategories.map((cat) => (
            <div
              key={cat.id}
              className="skill-card glass-card"
              style={{ '--card-color': cat.color, '--card-glow': cat.glow }}
            >
              <div className="skill-card-header">
                <div className="skill-card-icon-wrap" style={{ background: `${cat.color}18`, border: `1px solid ${cat.color}44` }}>
                  <i className={cat.icon} style={{ color: cat.color }} />
                </div>
                <h3 className="skill-card-title" style={{ color: cat.color }}>{cat.title}</h3>
              </div>
              <div className="skill-tags-wrap">
                {cat.items.map((item) => (
                  <span key={item} className="skill-tag-item" style={{ '--tag-color': cat.color }}>
                    {item}
                  </span>
                ))}
              </div>
              <div className="skill-card-glow" style={{ background: cat.color }} />
            </div>
          ))}
        </div>

      </div>
    </section>
  )
}

export default Skills
