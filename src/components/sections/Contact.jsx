import { useRef, useState } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { useGSAP } from '@gsap/react'
import { personalInfo } from '../../data/portfolio'
import { revealWordCascade } from '../../utils/reveal'

gsap.registerPlugin(ScrollTrigger)

const Contact = () => {
  const sectionRef = useRef(null)
  const [form, setForm] = useState({ name: '', email: '', message: '' })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const [errorMessage, setErrorMessage] = useState('')

  useGSAP(() => {
    const q = gsap.utils.selector(sectionRef)
    
    revealWordCascade(q('.contact-heading')[0])

    gsap.from('.contact-left', {
      scrollTrigger: { trigger: '.contact-grid', start: 'top 82%', once: true },
      x: -50, opacity: 0, duration: 0.9, ease: 'cubic-bezier(0.23, 1, 0.32, 1)',
    })
    gsap.from('.contact-right', {
      scrollTrigger: { trigger: '.contact-grid', start: 'top 82%', once: true },
      x: 50, opacity: 0, duration: 0.9, ease: 'cubic-bezier(0.23, 1, 0.32, 1)',
    })
  }, { scope: sectionRef })

  const handleSubmit = async (e) => {
    e.preventDefault()
    setIsSubmitting(true)
    setErrorMessage('')

    const accessKey = import.meta.env.VITE_WEB3FORMS_ACCESS_KEY

    if (!accessKey) {
      setErrorMessage("Access key missing. Please check VITE_WEB3FORMS_ACCESS_KEY in your env file.")
      setIsSubmitting(false)
      return
    }

    try {
      const response = await fetch("https://api.web3forms.com/submit", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json"
        },
        body: JSON.stringify({
          access_key: accessKey,
          name: form.name,
          email: form.email,
          message: form.message,
        })
      })

      const data = await response.json()

      if (data.success) {
        setSubmitted(true)
        setForm({ name: '', email: '', message: '' })
        setTimeout(() => setSubmitted(false), 5000)
      } else {
        setErrorMessage(data.message || "Failed to send message. Please try again.")
      }
    } catch (err) {
      setErrorMessage("Network error. Please check your internet connection and try again.")
      console.error("Submission error:", err)
    } finally {
      setIsSubmitting(false)
    }
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
            <h2 className="contact-heading section-heading">
              <span className="contact-word word-1">Let&apos;s</span>{' '}
              <span className="contact-word word-2 serif-italic">Build</span>{' '}
              <span className="contact-word word-3">Something</span>
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

              {errorMessage && (
                <div className="contact-error-msg">
                  <i className="ri-error-warning-line" /> {errorMessage}
                </div>
              )}

              <button type="submit" className="contact-submit-btn" data-magnetic disabled={isSubmitting || submitted}>
                {isSubmitting ? (
                  <><i className="ri-loader-4-line" style={{ display: 'inline-block', animation: 'spin-anim 1s linear infinite' }} /> Sending...</>
                ) : submitted ? (
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
