import { useEffect, useRef } from 'react'

const ScrollProgress = () => {
  const barRef = useRef(null)

  useEffect(() => {
    let raf = null
    const update = () => {
      const doc = document.documentElement
      const max = doc.scrollHeight - doc.clientHeight
      const p = max > 0 ? doc.scrollTop / max : 0
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
  }, [])

  return (
    <div className="scroll-progress" aria-hidden="true">
      <div ref={barRef} className="scroll-progress-fill" />
    </div>
  )
}

export default ScrollProgress
