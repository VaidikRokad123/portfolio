import { useRef } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { useGSAP } from '@gsap/react'
import { revealCharsStagger } from '../../utils/reveal'

gsap.registerPlugin(ScrollTrigger)

const skillCategories = [
  {
    id: 'languages',
    icon: 'ri-code-s-slash-line',
    title: 'Programming Languages',
    color: '#818cf8',
    glow: 'rgba(129,140,248,0.28)',
    items: ['C++', 'C', 'Java', 'Python'],
  },
  {
    id: 'web',
    icon: 'ri-stack-line',
    title: 'Web & Backend Development',
    color: '#c084fc',
    glow: 'rgba(192,132,252,0.28)',
    items: ['Node.js', 'Express.js', 'REST APIs', 'HTML5', 'CSS', 'JavaScript'],
  },
  {
    id: 'databases-os',
    icon: 'ri-database-2-line',
    title: 'Databases & Operating Systems',
    color: '#f59e0b',
    glow: 'rgba(245,158,11,0.28)',
    items: ['MongoDB', 'MySQL', 'Linux', 'Windows'],
  },
  {
    id: 'core',
    icon: 'ri-brain-line',
    title: 'Core Concepts',
    color: '#60a5fa',
    glow: 'rgba(96,165,250,0.28)',
    items: ['Data Structures & Algorithms', 'OOP', 'DBMS', 'OS', 'Computer Networks', 'Cloud Computing'],
  },
]

const SkillCard = ({ cat }) => {
  const cardRef = useRef(null)

  const handleMouseMove = (e) => {
    const card = cardRef.current
    if (!card) return
    const rect = card.getBoundingClientRect()
    const nx = (e.clientX - rect.left) / rect.width - 0.5  // -0.5 to 0.5
    const ny = (e.clientY - rect.top) / rect.height - 0.5
    card.style.setProperty('--mx', `${e.clientX - rect.left}px`)
    card.style.setProperty('--my', `${e.clientY - rect.top}px`)
    gsap.to(card, {
      rotateY: nx * 12,
      rotateX: ny * -12,
      x: nx * 10,
      y: ny * 10,
      duration: 0.4,
      ease: 'power2.out',
      transformPerspective: 800,
    })
  }

  const handleMouseLeave = () => {
    gsap.to(cardRef.current, { rotateY: 0, rotateX: 0, x: 0, y: 0, duration: 0.6, ease: 'power2.out' })
  }

  return (
    <div
      ref={cardRef}
      className="skill-card glass-card"
      style={{ '--card-color': cat.color, '--card-glow': cat.glow }}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
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
  )
}

const Skills = () => {
  const sectionRef = useRef(null)

  useGSAP(() => {
    const q = gsap.utils.selector(sectionRef)
    revealCharsStagger(q('.skills-heading')[0])
    gsap.from('.skill-card', {
      scrollTrigger: { trigger: '.skills-cards-grid', start: 'top 85%', once: true },
      y: 50, opacity: 0, duration: 0.6, stagger: 0.1, ease: 'cubic-bezier(0.23, 1, 0.32, 1)',
    })
  }, { scope: sectionRef })

  return (
    <section id="skills" ref={sectionRef} className="skills-section">
      <div className="section-container">

        <h2 className="skills-heading section-heading">
          My <span className="gradient-text">Skills</span>
        </h2>

        {/* Skill cards — simple tag-based, no percentages */}
        <div className="skills-cards-grid">
          {skillCategories.map((cat) => (
            <SkillCard key={cat.id} cat={cat} />
          ))}
        </div>

      </div>
    </section>
  )
}

export default Skills
