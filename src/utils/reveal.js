import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { SplitText } from 'gsap/SplitText'

gsap.registerPlugin(ScrollTrigger, SplitText)

const prefersReduced =
  typeof window !== 'undefined' &&
  window.matchMedia &&
  window.matchMedia('(prefers-reduced-motion: reduce)').matches

/**
 * Mask-style reveal for headings. Uses clip-path so nested gradient-text
 * spans keep their background-clip (a SplitText word/line split would break it).
 */
export function revealHeading(el, vars = {}) {
  if (!el || prefersReduced) return
  return gsap.from(el, {
    clipPath: 'inset(0 0 110% 0)',
    yPercent: 8,
    duration: 1.1,
    ease: 'power4.out',
    scrollTrigger: { trigger: el, start: 'top 88%', once: true },
    ...vars,
  })
}

/**
 * Line-by-line reveal for body copy. SplitText 3.13 `autoSplit` waits for web
 * fonts and re-splits on resize, re-running the animation each time.
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
      return gsap.from(self.lines, {
        yPercent: 110,
        duration: 0.9,
        stagger: 0.09,
        ease: 'power4.out',
        scrollTrigger: { trigger: el, start: 'top 85%', once: true },
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
