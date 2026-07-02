import { useEffect, useRef } from 'react'

const ScrollProgress = ({ isPageLoaded = false }) => {
  const barRef = useRef(null)

  useEffect(() => {
    if (!isPageLoaded) return

    let raf = null
    const update = () => {
      const scrollY = window.scrollY
      const scrollHeight = document.documentElement.scrollHeight
      const clientHeight = window.innerHeight
      const max = scrollHeight - clientHeight
      const p = max > 0 ? Math.min(1, Math.max(0, scrollY / max)) : 0
      if (barRef.current) barRef.current.style.transform = `scaleX(${p})`
      raf = null
    }
    const onScroll = () => {
      if (raf === null) raf = requestAnimationFrame(update)
    }
    window.addEventListener('scroll', onScroll, { passive: true })
    window.addEventListener('resize', onScroll, { passive: true })
    update()
    return () => {
      window.removeEventListener('scroll', onScroll)
      window.removeEventListener('resize', onScroll)
      if (raf !== null) cancelAnimationFrame(raf)
    }
  }, [isPageLoaded])

  if (!isPageLoaded) return null

  return (
    <div className="scroll-progress" aria-hidden="true">
      <div ref={barRef} className="scroll-progress-fill" />
    </div>
  )
}

export default ScrollProgress
