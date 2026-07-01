import { useEffect, useRef, useState } from 'react'
import { createPortal } from 'react-dom'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { useGSAP } from '@gsap/react'
import { projects } from '../../data/portfolio'
import { revealHeading, revealLines, parallax } from '../../utils/reveal'

gsap.registerPlugin(ScrollTrigger)

const ProjectModal = ({ project, onClose }) => {
  const closeRef = useRef(null)

  useEffect(() => {
    if (!project) return
    closeRef.current?.focus()
    // Lock body scroll while modal is open
    const scrollbarWidth = window.innerWidth - document.documentElement.clientWidth
    document.body.style.overflow = 'hidden'
    document.body.style.paddingRight = `${scrollbarWidth}px`

    const onKeyDown = (e) => { if (e.key === 'Escape') onClose() }
    document.addEventListener('keydown', onKeyDown)
    return () => {
      document.removeEventListener('keydown', onKeyDown)
      document.body.style.overflow = ''
      document.body.style.paddingRight = ''
    }
  }, [project, onClose])

  if (!project) return null
  return createPortal(
    <div className="modal-overlay" onClick={onClose} data-lenis-prevent>
      <div
        className="modal-panel glass-card"
        role="dialog"
        aria-modal="true"
        aria-label={project.title}
        onClick={(e) => e.stopPropagation()}
      >
        <button ref={closeRef} className="modal-close" onClick={onClose} aria-label="Close project details">
          <i className="ri-close-line" />
        </button>
        <div className="modal-icon" style={{ background: project.glow, color: project.color }}>
          <i className={project.icon} />
        </div>
        <h3 className="modal-title" style={{ color: project.color }}>{project.title}</h3>
        <p className="modal-subtitle">{project.subtitle}</p>
        <p className="modal-desc">{project.description}</p>
        <div className="modal-highlights">
          <p className="modal-highlights-label">Key Features</p>
          <ul>
            {project.highlights.map((h) => (
              <li key={h}>
                <i className="ri-checkbox-circle-line" style={{ color: project.color }} /> {h}
              </li>
            ))}
          </ul>
        </div>
        <div className="modal-tags">
          {project.tags.map((tag) => (
            <span key={tag} className="skill-tag" style={{ borderColor: project.color, color: project.color }}>
              {tag}
            </span>
          ))}
        </div>
        <a
          href={project.github}
          target="_blank"
          rel="noreferrer"
          className="modal-github-btn"
          data-magnetic
          style={{ background: project.color }}
        >
          <i className="ri-github-fill" /> View on GitHub
        </a>
      </div>
    </div>,
    document.body,
  )
}

const ProjectCard = ({ project, index, onClick }) => {
  const cardRef = useRef(null)

  const handleMouseMove = (e) => {
    const card = cardRef.current
    if (!card) return
    const rect = card.getBoundingClientRect()
    const nx = (e.clientX - rect.left) / rect.width - 0.5
    const ny = (e.clientY - rect.top) / rect.height - 0.5
    card.style.setProperty('--mx', `${e.clientX - rect.left}px`)
    card.style.setProperty('--my', `${e.clientY - rect.top}px`)
    gsap.to(card, {
      rotateY: nx * 12,
      rotateX: ny * -12,
      duration: 0.4,
      ease: 'power2.out',
      transformPerspective: 800,
    })
  }

  const handleMouseLeave = () => {
    gsap.to(cardRef.current, { rotateY: 0, rotateX: 0, duration: 0.6, ease: 'power2.out' })
  }

  return (
    <div
      ref={cardRef}
      className="project-card glass-card"
      style={{ '--project-color': project.color, '--project-glow': project.glow }}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      onClick={() => onClick(project)}
      role="button"
      tabIndex={0}
      aria-label={`View details of ${project.title}`}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); onClick(project) }
      }}
    >
      <div className="project-card-glow" />
      <div className="project-card-top">
        <span className="project-icon" style={{ color: project.color, background: `${project.color}1a` }}>
          <i className={project.icon} />
        </span>
        <span className="project-index">0{index + 1}</span>
      </div>
      <h3 className="project-title">{project.title}</h3>
      <p className="project-subtitle">{project.subtitle}</p>
      <p className="project-desc">{project.description.substring(0, 130)}...</p>
      <div className="project-tags">
        {project.tags.slice(0, 3).map((tag) => (
          <span key={tag} className="skill-tag project-tag">{tag}</span>
        ))}
        {project.tags.length > 3 && (
          <span className="skill-tag project-tag">+{project.tags.length - 3}</span>
        )}
      </div>
      <div className="project-card-footer">
        <span className="project-view-btn">
          View Details <i className="ri-arrow-right-line" />
        </span>
      </div>
    </div>
  )
}

const Projects = () => {
  const sectionRef = useRef(null)
  const [activeProject, setActiveProject] = useState(null)

  useGSAP(() => {
    const q = gsap.utils.selector(sectionRef)
    revealHeading(q('.projects-heading')[0])
    revealLines(q('.projects-subheading')[0])

    gsap.from('.project-card', {
      scrollTrigger: { trigger: '.projects-grid', start: 'top 82%', once: true },
      y: 50, opacity: 0, duration: 0.7, stagger: 0.12, ease: 'power3.out',
    })

    q('.project-index').forEach((el) => parallax(el, -28))
  }, { scope: sectionRef })

  return (
    <section id="projects" ref={sectionRef} className="projects-section">
      <div className="section-container">
        <div className="section-label">
          <span className="section-num">02</span>
          <span className="section-label-line" />
          <span>Featured Work</span>
        </div>

        <h2 className="projects-heading section-heading">
          Things I&apos;ve <span className="gradient-text">Built</span>
        </h2>
        <p className="projects-subheading">
          A collection of projects showcasing full-stack development, AI integration, and algorithmic problem solving.
        </p>

        <div className="projects-grid">
          {projects.map((project, i) => (
            <ProjectCard
              key={project.id}
              project={project}
              index={i}
              onClick={setActiveProject}
            />
          ))}
        </div>
      </div>

      {activeProject && (
        <ProjectModal project={activeProject} onClose={() => setActiveProject(null)} />
      )}
    </section>
  )
}

export default Projects
