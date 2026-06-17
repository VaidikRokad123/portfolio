import { useRef } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { useGSAP } from '@gsap/react'
import { getLenis } from '../../hooks/useLenis'
import { personalInfo } from '../../data/portfolio'

const Preloader = ({ onComplete }) => {
  const rootRef = useRef(null)
  const countRef = useRef(null)

  useGSAP(() => {
    const lenis = getLenis()
    lenis?.stop()
    document.documentElement.classList.add('is-loading')

    const finish = () => {
      document.documentElement.classList.remove('is-loading')
      lenis?.start()
      lenis?.scrollTo(0, { immediate: true })
      ScrollTrigger.refresh()
      onComplete?.()
    }

    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (reduced) {
      gsap.to(rootRef.current, { autoAlpha: 0, duration: 0.3, onComplete: finish })
      return
    }

    const counter = { val: 0 }
    const tl = gsap.timeline({ defaults: { ease: 'power3.out' } })

    tl.from('.preloader-name-line', {
      yPercent: 120,
      duration: 1,
      stagger: 0.12,
      ease: 'power4.out',
    })
      .from('.preloader-meta', { opacity: 0, y: 16, duration: 0.6 }, '-=0.6')
      .to(
        counter,
        {
          val: 100,
          duration: 2.1,
          ease: 'power2.inOut',
          onUpdate: () => {
            if (countRef.current) countRef.current.textContent = Math.round(counter.val)
          },
        },
        0.2,
      )
      .to('.preloader-bar-fill', { scaleX: 1, duration: 2.1, ease: 'power2.inOut' }, 0.2)
      // exit
      .to('.preloader-inner', { opacity: 0, y: -30, duration: 0.5, ease: 'power2.in' }, '+=0.15')
      .to(
        rootRef.current,
        {
          yPercent: -100,
          duration: 1,
          ease: 'power4.inOut',
          onComplete: finish,
        },
        '-=0.1',
      )
  }, [])

  return (
    <div className="preloader" ref={rootRef} aria-hidden="true">
      <div className="preloader-inner">
        <div className="preloader-name">
          <span className="preloader-name-mask">
            <span className="preloader-name-line">{personalInfo.firstName}</span>
          </span>
          <span className="preloader-name-mask">
            <span className="preloader-name-line preloader-name-line--accent">
              {personalInfo.lastName}
            </span>
          </span>
        </div>

        <div className="preloader-meta">
          <span className="preloader-tag">{personalInfo.role[0]}</span>
          <span className="preloader-count">
            <span ref={countRef}>0</span>
            <i>%</i>
          </span>
        </div>

        <div className="preloader-bar">
          <div className="preloader-bar-fill" />
        </div>
      </div>
    </div>
  )
}

export default Preloader
