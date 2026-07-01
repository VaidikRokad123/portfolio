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

    // 1. Initially animate name line clip reveal in
    const tl = gsap.timeline({ defaults: { ease: 'power3.out' } })
    
    tl.from('.preloader-name-line', {
      yPercent: 120,
      duration: 0.8,
      stagger: 0.1,
      ease: 'power4.out',
    })
      .from('.preloader-meta', { opacity: 0, y: 12, duration: 0.5 }, '-=0.5')

    // 2. Start a smooth loading progress to 100% over 2.5 seconds
    const counter = { val: 0 }
    
    const updateProgress = () => {
      if (countRef.current) countRef.current.textContent = Math.round(counter.val)
      gsap.set('.preloader-bar-fill', { scaleX: counter.val / 100 })
    }

    const runExitAnimation = () => {
      const exitTl = gsap.timeline({ defaults: { ease: 'power3.out' } })
      exitTl.to('.preloader-inner', { opacity: 0, y: -20, duration: 0.4, ease: 'power2.in' })
        .to(rootRef.current, {
          yPercent: -100,
          duration: 0.8,
          ease: 'power4.inOut',
          onComplete: finish
        }, '-=0.15')
    }

    const mainTween = gsap.to(counter, {
      val: 100,
      duration: 2.5,
      ease: 'power2.inOut',
      onUpdate: () => {
        updateProgress()
        
        // If it reaches 85% but assets/fonts are still loading, pause/hold the tween
        if (counter.val >= 85 && !assetsLoaded) {
          mainTween.pause()
        }
      },
      onComplete: runExitAnimation
    })

    // 3. Define function to finish loading smoothly once everything is ready
    let assetsLoaded = false
    let completed = false
    
    const completeLoading = () => {
      if (completed) return
      completed = true
      
      assetsLoaded = true
      
      // If the main tween is already running and hasn't reached 85%, let it finish normally.
      // If it reached 85% and is paused (or close), smoothly animate the rest to 100% over 0.8s.
      if (counter.val >= 82) {
        mainTween.kill()
        gsap.to(counter, {
          val: 100,
          duration: 0.8,
          ease: 'power2.out',
          onUpdate: updateProgress,
          onComplete: runExitAnimation
        })
      }
    }

    // 4. Wait for BOTH window load event and Google Fonts to be ready
    let windowLoaded = document.readyState === 'complete'
    let fontsReady = false

    const checkAllReady = () => {
      if (windowLoaded && fontsReady) {
        completeLoading()
      }
    }

    // Listen for window load
    if (windowLoaded) {
      checkAllReady()
    } else {
      const handleWindowLoad = () => {
        windowLoaded = true
        checkAllReady()
        window.removeEventListener('load', handleWindowLoad)
      }
      window.addEventListener('load', handleWindowLoad)
    }

    // Listen for fonts ready
    document.fonts.ready.then(() => {
      fontsReady = true
      checkAllReady()
    }).catch(() => {
      // Fallback in case of timeout/failure
      fontsReady = true
      checkAllReady()
    })

    // Safety timeout: force loading complete after 6 seconds
    const safetyTimeout = setTimeout(() => {
      windowLoaded = true
      fontsReady = true
      checkAllReady()
    }, 6000)

    return () => {
      clearTimeout(safetyTimeout)
    }
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
