import { useEffect, useRef } from 'react'
import gsap from 'gsap'
import { useGSAP } from '@gsap/react'
import { personalInfo } from '../../data/portfolio'

const Hero = () => {
  const containerRef = useRef(null)
  const roleRef = useRef(null)

  // Letter-by-letter entrance animation
  useGSAP(() => {
    const tl = gsap.timeline({ delay: 0.2 })

    tl.from('.hero-char', {
      y: 120,
      opacity: 0,
      duration: 0.9,
      stagger: 0.025,
      ease: 'power4.out',
    })
      .from('.hero-tag', {
        x: -30,
        opacity: 0,
        duration: 0.6,
        ease: 'power3.out',
      }, '-=0.4')
      .from('.hero-role-wrapper', {
        y: 24,
        opacity: 0,
        duration: 0.6,
        ease: 'power3.out',
      }, '-=0.3')
      .from('.hero-bio', {
        y: 20,
        opacity: 0,
        duration: 0.6,
        ease: 'power3.out',
      }, '-=0.3')
      .from('.hero-btn', {
        y: 20,
        opacity: 0,
        duration: 0.5,
        stagger: 0.12,
        ease: 'power3.out',
      }, '-=0.2')
      .from('.hero-scroll-hint', {
        opacity: 0,
        duration: 0.6,
        ease: 'power2.out',
      }, '-=0.1')
  }, [])

  // Typing effect
  useEffect(() => {
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

    const startTimer = setTimeout(type, 1600)
    return () => { clearTimeout(startTimer); clearTimeout(timer) }
  }, [])

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
            {personalInfo.firstName.split('').map((char, i) => (
              <span key={`f${i}`} className="hero-char hero-char--first">{char}</span>
            ))}
            <br />
            {personalInfo.lastName.split('').map((char, i) => (
              <span key={`l${i}`} className="hero-char hero-char--last">{char}</span>
            ))}
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
              onClick={(e) => { e.preventDefault(); document.querySelector('#projects')?.scrollIntoView({ behavior: 'smooth' }) }}
            >
              View My Work <i className="ri-arrow-right-line" />
            </a>
            <a
              href="#contact"
              className="hero-btn hero-btn--secondary"
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
