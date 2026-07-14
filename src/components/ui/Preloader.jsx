import { useRef } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { useGSAP } from '@gsap/react'
import { getLenis } from '../../hooks/useLenis'
import { personalInfo } from '../../data/portfolio'
import * as THREE from 'three'

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

    // 2. Setup progress state and display updating function
    const progressState = { val: 0 }
    
    const updateProgressDisplay = () => {
      const rounded = Math.round(progressState.val)
      if (countRef.current) countRef.current.textContent = rounded
      gsap.set('.preloader-bar-fill', { scaleX: progressState.val / 100 })
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

    // 3. Keep track of actual loaded fractions
    let windowLoaded = document.readyState === 'complete'
    let fontsReady = false
    let threeJsProgress = 0
    let maxThreeJsProgress = 0
    let maxCalculatedProgress = 0
    let hasThreeJsStarted = false
    let completed = false

    const calculateCurrentProgress = () => {
      const winPart = windowLoaded ? 15 : 0
      const fontPart = fontsReady ? 15 : 0
      const threePart = threeJsProgress // Ranges 0 to 70
      const current = Math.min(100, winPart + fontPart + threePart)
      if (current > maxCalculatedProgress) {
        maxCalculatedProgress = current
      }
      return maxCalculatedProgress
    }

    const checkAndAnimateProgress = () => {
      if (completed) return
      
      const targetVal = calculateCurrentProgress()
      
      // Smoothly animate the progress number and bar to the true target value
      gsap.to(progressState, {
        val: targetVal,
        duration: 0.5,
        ease: 'power2.out',
        onUpdate: updateProgressDisplay,
        onComplete: () => {
          if (targetVal === 100 && !completed) {
            completed = true
            runExitAnimation()
          }
        },
        overwrite: 'auto'
      })
    }

    // Listen for window load
    if (windowLoaded) {
      checkAndAnimateProgress()
    } else {
      const handleWindowLoad = () => {
        windowLoaded = true
        checkAndAnimateProgress()
        window.removeEventListener('load', handleWindowLoad)
      }
      window.addEventListener('load', handleWindowLoad)
    }

    // Listen for Google fonts and web fonts ready
    document.fonts.ready.then(() => {
      fontsReady = true
      checkAndAnimateProgress()
    }).catch(() => {
      // Fallback in case of font load timeout/error
      fontsReady = true
      checkAndAnimateProgress()
    })

    // Listen for Three.js asset loading managers (gltf dog models & textures)
    THREE.DefaultLoadingManager.onStart = () => {
      hasThreeJsStarted = true
      // Don't reset if it's already higher
      checkAndAnimateProgress()
    }

    THREE.DefaultLoadingManager.onProgress = (url, itemsLoaded, itemsTotal) => {
      hasThreeJsStarted = true
      if (itemsTotal > 0) {
        const computed = (itemsLoaded / itemsTotal) * 70
        if (computed > maxThreeJsProgress) {
          maxThreeJsProgress = computed
        }
      }
      threeJsProgress = maxThreeJsProgress
      checkAndAnimateProgress()
    }

    THREE.DefaultLoadingManager.onLoad = () => {
      maxThreeJsProgress = 70
      threeJsProgress = 70
      checkAndAnimateProgress()
    }

    // Fallback: If Three.js doesn't trigger onStart within 400ms (already loaded / cached / no model), auto-complete R3F portion
    const threeJsTimeout = setTimeout(() => {
      if (!hasThreeJsStarted) {
        threeJsProgress = 70
        checkAndAnimateProgress()
      }
    }, 400)

    // Safety timeout: force preloader completion after 12 seconds in case a CDN asset/font gets stuck
    const safetyTimeout = setTimeout(() => {
      windowLoaded = true
      fontsReady = true
      threeJsProgress = 70
      checkAndAnimateProgress()
    }, 12000)

    return () => {
      clearTimeout(threeJsTimeout)
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
