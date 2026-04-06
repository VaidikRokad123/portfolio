import { useRef, useState } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { useGSAP } from '@gsap/react'
import { personalInfo } from '../../data/portfolio'

gsap.registerPlugin(ScrollTrigger)

const Contact = () => {
  const sectionRef = useRef(null)
  const [form, setForm] = useState({ name: '', email: '', message: '' })
  const [submitted, setSubmitted] = useState(false)

  useGSAP(() => {
    gsap.from('.contact-heading', {
      scrollTrigger: { trigger: '.contact-heading', start: 'top 85%' },
      y: 60, opacity: 0, duration: 0.8, ease: 'power3.out',
    })
    gsap.from('.contact-left', {
      scrollTrigger: { trigger: '.contact-grid', start: 'top 80%' },
      x: -60, opacity: 0, duration: 0.9, ease: 'power3.out',
    })
    gsap.from('.contact-right', {
      scrollTrigger: { trigger: '.contact-grid', start: 'top 80%' },
      x: 60, opacity: 0, duration: 0.9, ease: 'power3.out',
    })
    gsap.from('.contact-social-link', {
      scrollTrigger: { trigger: '.contact-socials', start: 'top 85%' },
      y: 30, opacity: 0, duration: 0.5, stagger: 0.12, ease: 'power3.out',
    })
  }, { scope: sectionRef })

  const handleSubmit = (e) => {
    e.preventDefault()
    // Open mailto with form values
    const subject = encodeURIComponent(`Portfolio Contact from ${form.name}`)
    const body = encodeURIComponent(`Name: ${form.name}\nEmail: ${form.email}\n\nMessage:\n${form.message}`)
    window.open(`mailto:${personalInfo.email}?subject=${subject}&body=${body}`)
    setSubmitted(true)
    setTimeout(() => setSubmitted(false), 4000)
  }

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value })

  const socials = [
    { label: 'GitHub', href: personalInfo.github, icon: 'ri-github-fill', color: '#e2e8f0' },
    { label: 'LinkedIn', href: personalInfo.linkedin, icon: 'ri-linkedin-fill', color: '#0ea5e9' },
    { label: 'Email', href: `mailto:${personalInfo.email}`, icon: 'ri-mail-line', color: '#6366f1' },
  ]

  return (
    <section id="contact" ref={sectionRef} className="contact-section">
      <div className="section-container">
        <div className="section-label">
          <span className="section-label-line" />
          <span>Get In Touch</span>
        </div>

        <h2 className="contact-heading section-heading">
          Let&apos;s <span className="gradient-text">Build</span> Something
        </h2>

        <div className="contact-grid">
          {/* LEFT */}
          <div className="contact-left">
            <p className="contact-intro">
              I&apos;m always open to discussing new opportunities, interesting projects, 
              or just having a conversation about technology and problem-solving. 
              Feel free to reach out!
            </p>

            <div className="contact-socials">
              {socials.map((s) => (
                <a
                  key={s.label}
                  href={s.href}
                  target={s.href.startsWith('http') ? '_blank' : undefined}
                  rel="noreferrer"
                  className="contact-social-link glass-card"
                  style={{ '--social-color': s.color }}
                >
                  <i className={s.icon} style={{ color: s.color }} />
                  <div>
                    <p className="contact-social-label">{s.label}</p>
                    <p className="contact-social-value">
                      {s.label === 'Email' ? personalInfo.email
                        : s.label === 'GitHub' ? 'VaidikRokad123'
                        : 'vaidik-rokad-6bbb56303'}
                    </p>
                  </div>
                  <i className="ri-arrow-right-up-line contact-social-arrow" />
                </a>
              ))}
            </div>

            <a
              href="/resume.pdf"
              download="Vaidik_Rokad_Resume.pdf"
              className="contact-resume-btn"
            >
              <i className="ri-file-download-line" /> Download Resume
            </a>
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
                  placeholder="John Doe"
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
                  placeholder="john@example.com"
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

              <button type="submit" className="contact-submit-btn">
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

      {/* Footer */}
      <div className="contact-footer">
        <p>Designed &amp; Built by <span className="gradient-text">Vaidik Rokad</span> · 2024</p>
      </div>
    </section>
  )
}

export default Contact
