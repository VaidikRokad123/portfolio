import { useEffect, useRef, useState } from 'react'
import gsap from 'gsap'
import { personalInfo } from '../../data/portfolio'

const Navbar = () => {
  const navRef = useRef(null)
  const [scrolled, setScrolled] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)

  const navLinks = [
    { label: 'Home', href: '#hero' },
    { label: 'About', href: '#about' },
    { label: 'Projects', href: '#projects' },
    { label: 'Skills', href: '#skills' },
    { label: 'Achievements', href: '#achievements' },
    { label: 'Contact', href: '#contact' },
  ]

  useEffect(() => {
    // Animate navbar in on mount
    gsap.from(navRef.current, {
      y: -80,
      opacity: 0,
      duration: 1,
      delay: 0.3,
      ease: 'power3.out',
    })

    const handleScroll = () => setScrolled(window.scrollY > 60)
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const handleNavClick = (e, href) => {
    e.preventDefault()
    const target = document.querySelector(href)
    if (target) target.scrollIntoView({ behavior: 'smooth' })
    setMenuOpen(false)
  }

  useEffect(() => {
    // Close menu on outside click
    if (!menuOpen) return
    const handler = () => setMenuOpen(false)
    setTimeout(() => document.addEventListener('click', handler), 0)
    return () => document.removeEventListener('click', handler)
  }, [menuOpen])

  return (
    <nav ref={navRef} className={`navbar ${scrolled ? 'navbar--scrolled' : ''}`}>
      <div className="nav-logo">
        <span className="nav-logo-text">VR</span>
        <span className="nav-logo-dot" />
      </div>

      <ul className={`nav-links ${menuOpen ? 'nav-links--open' : ''}`}>
        {navLinks.map((link) => (
          <li key={link.label}>
            <a
              href={link.href}
              className="nav-link"
              onClick={(e) => handleNavClick(e, link.href)}
            >
              {link.label}
            </a>
          </li>
        ))}
      </ul>

      <a
        href="/resume.pdf"
        download="Vaidik_Rokad_Resume.pdf"
        className="nav-resume-btn"
      >
        Resume <i className="ri-download-line" />
      </a>

      <button
        className={`nav-hamburger ${menuOpen ? 'nav-hamburger--open' : ''}`}
        onClick={(e) => { e.stopPropagation(); setMenuOpen(!menuOpen) }}
        aria-label="Toggle menu"
      >
        <span /><span /><span />
      </button>
    </nav>
  )
}

export default Navbar
