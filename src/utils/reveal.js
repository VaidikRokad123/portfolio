import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { SplitText } from 'gsap/SplitText'

gsap.registerPlugin(ScrollTrigger, SplitText)

const prefersReduced =
  typeof window !== 'undefined' &&
  window.matchMedia &&
  window.matchMedia('(prefers-reduced-motion: reduce)').matches

/**
 * Mask-style 3D & Blur reveal for headings (Apple-Event Style).
 * Combines vertical clip-path swipe, soft camera blur, and a 3D hinge rotation.
 */
export function revealHeading(el, vars = {}) {
  if (!el || prefersReduced) return

  // Set up 3D perspective on parent for deep rotateX effect
  if (el.parentElement) {
    gsap.set(el.parentElement, { perspective: 1000 })
  }

  // Set starting values to prevent flashes
  gsap.set(el, {
    transformOrigin: '50% 100% -30px',
    filter: 'blur(12px)',
    opacity: 0,
    scale: 0.95,
    rotateX: -20,
    clipPath: 'inset(100% 0 0 0)'
  })

  return gsap.to(el, {
    clipPath: 'inset(0% 0 0 0)',
    rotateX: 0,
    scale: 1,
    opacity: 1,
    filter: 'blur(0px)',
    duration: 1.25,
    ease: 'power4.out',
    scrollTrigger: {
      trigger: el,
      start: 'top 88%',
      once: true,
    },
    ...vars,
  })
}

/**
 * Line-by-line smooth fade & camera-focus blur reveal for body text.
 */
export function revealLines(el, vars = {}) {
  if (!el) return
  if (prefersReduced) return
  return SplitText.create(el, {
    type: 'lines',
    mask: 'lines',
    autoSplit: true,
    linesClass: 'split-line',
    onSplit(self) {
      // Set initial values
      gsap.set(self.lines, {
        y: 16,
        opacity: 0,
        filter: 'blur(6px)'
      })

      return gsap.to(self.lines, {
        y: 0,
        opacity: 1,
        filter: 'blur(0px)',
        duration: 1.0,
        stagger: 0.08,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: el,
          start: 'top 88%',
          once: true,
        },
        ...vars,
      })
    },
  })
}

/** Subtle scroll parallax — moves an element as it travels through the viewport. */
export function parallax(el, amount = 60, vars = {}) {
  if (!el || prefersReduced) return
  return gsap.to(el, {
    yPercent: amount,
    ease: 'none',
    scrollTrigger: {
      trigger: el,
      start: 'top bottom',
      end: 'bottom top',
      scrub: true,
    },
    ...vars,
  })
}
