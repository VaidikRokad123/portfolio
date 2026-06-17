import { useRef, useState } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { useGSAP } from '@gsap/react'
import { personalInfo } from '../../data/portfolio'
import { revealHeading } from '../../utils/reveal'

gsap.registerPlugin(ScrollTrigger)

const Contact = () => {
  const sectionRef = useRef(null)
  const [form, setForm] = useState({ name: '', email: '', message: '' })
  const [submitted, setSubmitted] = useState(false)

  useGSAP(() => {
    const q = gsap.utils.selector(sectionRef)
    revealHeading(q('.contact-heading')[0])
    gsap.from('.contact-left', {
      scrollTrigger: { trigger: '.contact-grid', start: 'top 82%', once: true },
      x: -50, opacity: 0, duration: 0.9, ease: 'power3.out',
    })
    gsap.from('.contact-right', {
      scrollTrigger: { trigger: '.contact-grid', start: 'top 82%', once: true },
      x: 50, opacity: 0, duration: 0.9, ease: 'power3.out',
    })
  }, { scope: sectionRef })

  const handleSubmit = (e) => {
    e.preventDefault()
    const subject = encodeURIComponent(`Portfolio Contact from ${form.name}`)
    const body = encodeURIComponent(`Name: ${form.name}\nEmail: ${form.email}\n\nMessage:\n${form.message}`)
    window.open(`mailto:${personalInfo.email}?subject=${subject}&body=${body}`)
    setSubmitted(true)
    setTimeout(() => setSubmitted(false), 4000)
  }

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value })

  const footerLinks = [
    { label: 'GitHub', href: personalInfo.github, icon: 'ri-github-fill' },
    { label: 'LinkedIn', href: personalInfo.linkedin, icon: 'ri-linkedin-fill' },
    { label: 'LeetCode', href: 'https://leetcode.com/u/harry0018/', icon: 'ri-trophy-line' },
    { label: 'CodeChef', href: 'https://www.codechef.com/users/harry0018', icon: 'ri-star-line' },
    { label: 'Codeforces', href: 'https://codeforces.com/profile/harry0018', icon: 'ri-code-line' },
    { label: 'Email', href: `mailto:${personalInfo.email}`, icon: 'ri-mail-line' },
  ]

  return (
    <section id="contact" ref={sectionRef} className="contact-section">
      <div className="section-container">
        <div className="contact-grid">
          {/* LEFT — heading + intro + socials */}
          <div className="contact-left">
            <div className="section-label">
              <span className="section-num">05</span>
              <span className="section-label-line" />
              <span>Get In Touch</span>
            </div>

            <h2 className="contact-heading section-heading">
              Let&apos;s <span className="gradient-text">Build</span> Something
            </h2>

            <p className="contact-intro">
              I&apos;m always open to discussing new opportunities, interesting projects,
              or just having a conversation about technology and problem-solving.
              Feel free to reach out!
            </p>

          </div>

          {/* RIGHT — Form */}
          <div className="contact-right">
            <form className="contact-form glass-card" onSubmit={handleSubmit}>
              <h3 className="contact-form-title">Send a Message</h3>

              <div className="form-group">
                <label htmlFor="contact-name">Your Name</label>
                <input
                  id="contact-name"
                  type="text"
                  name="name"
                  value={form.name}
                  onChange={handleChange}
                  placeholder="Vaidik Rokad"
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="contact-email">Your Email</label>
                <input
                  id="contact-email"
                  type="email"
                  name="email"
                  value={form.email}
                  onChange={handleChange}
                  placeholder="vaidikrokad1245@gmail.com"
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="contact-message">Message</label>
                <textarea
                  id="contact-message"
                  name="message"
                  value={form.message}
                  onChange={handleChange}
                  rows={5}
                  placeholder="Let's talk about..."
                  required
                />
              </div>

              <button type="submit" className="contact-submit-btn" data-magnetic disabled={submitted}>
                {submitted ? (
                  <><i className="ri-check-line" /> Message Sent!</>
                ) : (
                  <><i className="ri-send-plane-line" /> Send Message</>
                )}
              </button>
            </form>
          </div>
        </div>
      </div>

      {/* Footer with all links */}
      <div className="contact-footer">
        <div className="footer-links">
          {footerLinks.map((l) => (
            <a key={l.label} href={l.href} target="_blank" rel="noreferrer" className="footer-link">
              <i className={l.icon} /> {l.label}
            </a>
          ))}
        </div>
        <p className="footer-copy">
          Designed &amp; Built by <span className="gradient-text">Vaidik Rokad</span> · {new Date().getFullYear()}
        </p>
      </div>
    </section>
  )
}

export default Contact
