import { useEffect, useRef } from 'react'
import gsap from 'gsap'
import { useGSAP } from '@gsap/react'
import { personalInfo } from '../../data/portfolio'

const HIDE_TARGETS = [
  '.hero-tag',
  '.hero-role-wrapper',
  '.hero-bio',
  '.hero-btn',
  '.hero-socials',
  '.hero-scroll-hint',
]

const Hero = ({ loaded = true }) => {
  const containerRef = useRef(null)
  const roleRef = useRef(null)

  const reduced =
    typeof window !== 'undefined' &&
    window.matchMedia('(prefers-reduced-motion: reduce)').matches

  // Hide hero content on first paint so it never shows behind the preloader
  useGSAP(() => {
    if (reduced) return
    gsap.set('.hero-char', { 
      yPercent: 70, 
      opacity: 0,
      filter: 'blur(8px)',
      rotateX: -30,
      transformOrigin: '50% 100% -20px'
    })
    gsap.set(HIDE_TARGETS, { y: 20, opacity: 0 })
    gsap.set('.hero-tag', { x: -30, y: 0 })
  }, { scope: containerRef })

  // Entrance — runs once the preloader hands off
  useGSAP(() => {
    if (!loaded) return
    if (reduced) {
      gsap.set(['.hero-char', ...HIDE_TARGETS], { clearProps: 'all' })
      return
    }
    
    // Set 3D perspective on name containers for rotateX
    gsap.set('.hero-name-row', { perspective: 1000 })

    const tl = gsap.timeline({ delay: 0.1 })
    tl.to('.hero-char', {
      yPercent: 0,
      opacity: 1,
      filter: 'blur(0px)',
      rotateX: 0,
      duration: 1.1,
      stagger: 0.03,
      ease: 'power4.out',
    })
      .to('.hero-tag', { x: 0, opacity: 1, duration: 0.6, ease: 'power3.out' }, '-=0.4')
      .to('.hero-role-wrapper', { y: 0, opacity: 1, duration: 0.6, ease: 'power3.out' }, '-=0.3')
      .to('.hero-bio', { y: 0, opacity: 1, duration: 0.6, ease: 'power3.out' }, '-=0.3')
      .to('.hero-btn', { y: 0, opacity: 1, duration: 0.5, stagger: 0.12, ease: 'power3.out' }, '-=0.2')
      .to('.hero-socials', { y: 0, opacity: 1, duration: 0.5, ease: 'power3.out' }, '-=0.3')
      .to('.hero-scroll-hint', { y: 0, opacity: 1, duration: 0.6, ease: 'power2.out' }, '-=0.1')
  }, { scope: containerRef, dependencies: [loaded] })

  // Typing effect — starts after the intro completes
  useEffect(() => {
    if (!loaded) return
    const roles = personalInfo.role
    let roleIndex = 0
    let charIndex = 0
    let isDeleting = false
    let timer

    const type = () => {
      const current = roles[roleIndex]
      if (roleRef.current) {
        roleRef.current.textContent = isDeleting
          ? current.substring(0, charIndex - 1)
          : current.substring(0, charIndex + 1)
      }
      isDeleting ? charIndex-- : charIndex++

      if (!isDeleting && charIndex === current.length) {
        timer = setTimeout(() => { isDeleting = true; type() }, 1800)
        return
      }
      if (isDeleting && charIndex === 0) {
        isDeleting = false
        roleIndex = (roleIndex + 1) % roles.length
      }
      timer = setTimeout(type, isDeleting ? 45 : 90)
    }

    const startTimer = setTimeout(type, 600)
    return () => { clearTimeout(startTimer); clearTimeout(timer) }
  }, [loaded])

  return (
    <section id="hero" ref={containerRef} className="hero-section">
      <div className="hero-content">
        <div className="hero-left">

          {/* Availability badge */}
          <div className="hero-tag">
            <span className="hero-tag-pulse" />
            <span>Open to opportunities</span>
          </div>

          {/* Animated name */}
          <h1 className="hero-name" aria-label={personalInfo.name}>
            <span className="hero-name-row">
              {personalInfo.firstName.split('').map((char, i) => (
                <span key={`f${i}`} className="hero-char hero-char--first">{char}</span>
              ))}
            </span>
            <span className="hero-name-row">
              {personalInfo.lastName.split('').map((char, i) => (
                <span key={`l${i}`} className="hero-char hero-char--last">{char}</span>
              ))}
            </span>
          </h1>

          {/* Typing role text */}
          <div className="hero-role-wrapper">
            <span className="hero-role-prefix">I&apos;m a&nbsp;</span>
            <span className="hero-role-typed">
              <span ref={roleRef} className="hero-role-text" />
              <span className="hero-cursor">|</span>
            </span>
          </div>

          {/* Bio */}
          <p className="hero-bio">{personalInfo.bio}</p>

          {/* CTAs */}
          <div className="hero-btns">
            <a
              href="#projects"
              className="hero-btn hero-btn--primary"
              data-magnetic
              onClick={(e) => { e.preventDefault(); document.querySelector('#projects')?.scrollIntoView({ behavior: 'smooth' }) }}
            >
              View My Work <i className="ri-arrow-right-line" />
            </a>
            <a
              href="#contact"
              className="hero-btn hero-btn--secondary"
              data-magnetic
              onClick={(e) => { e.preventDefault(); document.querySelector('#contact')?.scrollIntoView({ behavior: 'smooth' }) }}
            >
              Get In Touch
            </a>
          </div>

          {/* Social quick links */}
          <div className="hero-socials">
            <a href={personalInfo.github} target="_blank" rel="noreferrer" className="hero-social-link">
              <i className="ri-github-fill" /> GitHub
            </a>
            <a href={personalInfo.linkedin} target="_blank" rel="noreferrer" className="hero-social-link">
              <i className="ri-linkedin-fill" /> LinkedIn
            </a>
            <a href={`mailto:${personalInfo.email}`} className="hero-social-link">
              <i className="ri-mail-line" /> Email
            </a>
          </div>
        </div>
      </div>

      {/* Scroll indicator */}
      <div className="hero-scroll-hint">
        <span className="scroll-hint-label">Scroll to explore</span>
        <div className="scroll-hint-bar">
          <div className="scroll-hint-fill" />
        </div>
      </div>

      {/* Decorative lines (matching original DogStudio feel) */}
      <div className="hero-deco-line hero-deco-line--1" />
      <div className="hero-deco-line hero-deco-line--2" />
    </section>
  )
}

export default Hero
