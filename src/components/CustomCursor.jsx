import { useEffect, useRef } from 'react'
import './CustomCursor.css'

export default function CustomCursor() {
  const dotRef    = useRef(null)
  const ringRef   = useRef(null)
  const mirrorRef = useRef(null)

  useEffect(() => {
    if (window.matchMedia('(hover: none)').matches) return

    const dot    = dotRef.current
    const ring   = ringRef.current
    const mirror = mirrorRef.current
    if (!dot || !ring || !mirror) return

    let mx = 0, my = 0
    let r1x = 0, r1y = 0
    let r2x = 0, r2y = 0
    let raf
    let isHover = false

    const onMove = (e) => {
      mx = e.clientX
      my = e.clientY
      dot.style.transform = `translate(${mx}px, ${my}px)`
    }

    const loop = () => {
      r1x += (mx - r1x) * 0.13
      r1y += (my - r1y) * 0.13
      r2x += (mx - r2x) * 0.07
      r2y += (my - r2y) * 0.07

      ring.style.transform   = `translate(${r1x}px, ${r1y}px)`
      mirror.style.transform = `translate(${r2x}px, ${r2y}px)`

      raf = requestAnimationFrame(loop)
    }

    // Event delegation: captura hover em interativos sem MutationObserver
    const hoverSelectors = 'a, button, [role="button"], .nav-thumb, .mockup-tab'

    const onOver = (e) => {
      if (!isHover && e.target.closest(hoverSelectors)) {
        isHover = true
        dot.classList.add('cursor-dot--hover')
        ring.classList.add('cursor-ring--hover')
        mirror.classList.add('cursor-mirror--hover')
      }
    }
    const onOut = (e) => {
      if (isHover && e.target.closest(hoverSelectors)) {
        // Verifica se relatedTarget não é outro interativo
        if (!e.relatedTarget || !e.relatedTarget.closest?.(hoverSelectors)) {
          isHover = false
          dot.classList.remove('cursor-dot--hover')
          ring.classList.remove('cursor-ring--hover')
          mirror.classList.remove('cursor-mirror--hover')
        }
      }
    }

    window.addEventListener('mousemove', onMove, { passive: true })
    document.addEventListener('mouseover', onOver, { passive: true })
    document.addEventListener('mouseout', onOut, { passive: true })
    raf = requestAnimationFrame(loop)

    return () => {
      window.removeEventListener('mousemove', onMove)
      document.removeEventListener('mouseover', onOver)
      document.removeEventListener('mouseout', onOut)
      cancelAnimationFrame(raf)
    }
  }, [])

  return (
    <>
      <div ref={dotRef}    className="cursor-dot"    aria-hidden="true" />
      <div ref={ringRef}   className="cursor-ring"   aria-hidden="true" />
      <div ref={mirrorRef} className="cursor-mirror" aria-hidden="true" />
    </>
  )
}
