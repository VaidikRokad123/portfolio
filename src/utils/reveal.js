import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

const prefersReduced =
  typeof window !== 'undefined' &&
  window.matchMedia &&
  window.matchMedia('(prefers-reduced-motion: reduce)').matches

// Helper: Recursively split text nodes into individual character spans (keeps gradients/styling intact)
function splitIntoSpans(el, spanClass, initialStyles = {}) {
  if (!el) return []
  
  function traverse(node) {
    if (node.nodeType === 3) { // Text node
      const text = node.textContent
      const parent = node.parentNode
      const fragment = document.createDocumentFragment()
      
      for (let i = 0; i < text.length; i++) {
        const char = text[i]
        if (char === ' ') {
          fragment.appendChild(document.createTextNode(' '))
        } else {
          const span = document.createElement('span')
          span.className = spanClass
          span.style.display = 'inline-block'
          Object.assign(span.style, initialStyles)
          span.textContent = char
          fragment.appendChild(span)
        }
      }
      parent.replaceChild(fragment, node)
    } else if (node.nodeType === 1) { // Element node
      if (!node.classList.contains(spanClass)) {
        const children = Array.from(node.childNodes)
        children.forEach(traverse)
      }
    }
  }

  traverse(el)
  return el.querySelectorAll('.' + spanClass)
}

/** 1. Bouncy Baseline (About Heading) */
export function revealBouncy(el, vars = {}) {
  if (!el || prefersReduced) return
  gsap.set(el, { y: -45, opacity: 0 })
  return gsap.to(el, {
    y: 0,
    opacity: 1,
    duration: 1.2,
    ease: "elastic.out(1.0, 0.72)",
    scrollTrigger: { trigger: el, start: 'top 88%', once: true },
    ...vars,
  })
}

/** 2. Cascading Letters - Stagger (Skills Heading) */
export function revealCharsStagger(el, vars = {}) {
  if (!el || prefersReduced) return
  
  const chars = splitIntoSpans(el, 'stagger-char', {
    transform: 'translateY(110%)',
    opacity: '0'
  })

  // Ensure parent has overflow hidden so letters rise up cleanly
  gsap.set(el, { overflow: 'hidden', paddingBottom: '0.06em' })

  return gsap.to(chars, {
    transform: 'translateY(0%)',
    opacity: 1,
    duration: 0.8,
    stagger: 0.035,
    ease: 'power4.out',
    scrollTrigger: { trigger: el, start: 'top 88%', once: true },
    ...vars,
  })
}

/** 3. Departures Board 3D Flip (Projects Heading) */
export function revealDepartures(el, vars = {}) {
  if (!el || prefersReduced) return

  // Set up 3D perspective
  if (el.parentElement) {
    gsap.set(el.parentElement, { perspective: 1000 })
  }

  const chars = splitIntoSpans(el, 'flip-char', {
    transform: 'rotateX(-95deg) translateZ(-20px)',
    opacity: '0'
  })

  return gsap.to(chars, {
    transform: 'rotateX(0deg) translateZ(0px)',
    opacity: 1,
    duration: 0.95,
    stagger: 0.045,
    ease: 'back.out(2.2)',
    scrollTrigger: { trigger: el, start: 'top 88%', once: true },
    ...vars,
  })
}

/** 4. Typewriter with blinking Cursor (Achievements Heading) */
export function revealTypewriter(el, vars = {}) {
  if (!el || prefersReduced) return

  const chars = splitIntoSpans(el, 'type-char', {
    display: 'none'
  })

  // Create typing cursor element
  const cursor = document.createElement('span')
  cursor.className = 'typewriter-cursor'
  cursor.textContent = '|'
  cursor.style.display = 'inline-block'
  cursor.style.color = '#c084fc' // var(--accent)
  cursor.style.marginLeft = '2px'
  el.appendChild(cursor)

  // Blink cursor infinitely
  const blink = gsap.to(cursor, {
    opacity: 0,
    ease: 'steps(1)',
    repeat: -1,
    duration: 0.6
  })

  const tl = gsap.timeline({
    scrollTrigger: { trigger: el, start: 'top 88%', once: true }
  })

  tl.to(chars, {
    display: 'inline-block',
    stagger: 0.065,
    duration: 0.05
  })
  .to(cursor, {
    opacity: 0,
    scale: 0,
    duration: 0.35,
    onComplete: () => {
      blink.kill()
      cursor.remove()
    }
  }, '+=0.2') // Wait 200ms after typing before removing cursor

  return tl
}

/** 5. Word Cascade (Contact Heading) */
export function revealWordCascade(el, vars = {}) {
  if (!el || prefersReduced) return

  let words = el.querySelectorAll('.contact-word, .word-span')
  if (words.length === 0) {
    const text = el.textContent.trim()
    el.innerHTML = text.split(' ').map(w => `<span class="word-span" style="display:inline-block; opacity:0; transform:translateY(35px);">${w}</span>`).join(' ')
    words = el.querySelectorAll('.word-span')
  } else {
    gsap.set(words, { y: 35, opacity: 0 })
  }

  return gsap.to(words, {
    y: 0,
    opacity: 1,
    duration: 0.8,
    stagger: 0.12,
    ease: 'power3.out',
    scrollTrigger: { trigger: el, start: 'top 88%', once: true },
    ...vars,
  })
}

/** Line-by-line smooth fade & camera-focus blur reveal for body text. */
export function revealLines(el, vars = {}) {
  if (!el) return
  if (prefersReduced) return

  // Fallback if SplitText is not available
  if (typeof SplitText === 'undefined') {
    return gsap.from(el, {
      y: 16,
      opacity: 0,
      filter: 'blur(6px)',
      duration: 0.9,
      ease: 'power3.out',
      scrollTrigger: { trigger: el, start: 'top 88%', once: true },
      ...vars,
    })
  }

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
