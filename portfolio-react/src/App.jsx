import { useEffect, useRef, useState } from 'react'
import './App.css'

function App() {
  const videoRef = useRef(null)
  const heroRef = useRef(null)
  const [videoDuration, setVideoDuration] = useState(0)
  const [scrollProgress, setScrollProgress] = useState(0)

  useEffect(() => {
    const video = videoRef.current
    if (!video) return

    const handleLoadedMetadata = () => {
      setVideoDuration(video.duration)
      video.pause()
    }

    video.addEventListener('loadedmetadata', handleLoadedMetadata)
    
    if (video.readyState >= 2) {
      setVideoDuration(video.duration)
      video.pause()
    }

    return () => {
      video.removeEventListener('loadedmetadata', handleLoadedMetadata)
    }
  }, [])

  useEffect(() => {
    const video = videoRef.current
    if (!video || !videoDuration) return

    // Vídeo roda linearmente de 0 a 100% conforme scroll
    const targetTime = scrollProgress * videoDuration
    
    if (Math.abs(video.currentTime - targetTime) > 0.02) {
      video.currentTime = targetTime
    }
  }, [scrollProgress, videoDuration])

  useEffect(() => {
    let ticking = false

    const handleScroll = () => {
      if (!heroRef.current || !videoDuration) return

      if (!ticking) {
        window.requestAnimationFrame(() => {
          const windowHeight = window.innerHeight
          const scrollY = window.scrollY
          
          // Hero tem altura de 300vh para scroll infinito
          const heroHeight = windowHeight * 3
          
          // Calcula progresso do scroll (0 a 1)
          const progress = Math.max(0, Math.min(1, scrollY / (heroHeight - windowHeight)))
          setScrollProgress(progress)
          
          ticking = false
        })
        ticking = true
      }
    }

    window.addEventListener('scroll', handleScroll, { passive: true })
    handleScroll()

    return () => window.removeEventListener('scroll', handleScroll)
  }, [videoDuration])

  // Texto aparece no final do vídeo (85%)
  const textOpacity = scrollProgress > 0.85 
    ? Math.min(1, (scrollProgress - 0.85) / 0.15) 
    : 0
  
  // Botão aparece no final (90%)
  const buttonOpacity = scrollProgress > 0.90 
    ? Math.min(1, (scrollProgress - 0.90) / 0.10) 
    : 0

  const handleClick = () => {
    // Redireciona para outra página
    window.location.href = '/sobre'
  }

  return (
    <section ref={heroRef} className="hero-section">
      <div className="video-wrapper">
        <video
          ref={videoRef}
          className="hero-video"
          muted
          playsInline
          preload="auto"
        >
          <source src="/Video_Fluid.mp4" type="video/mp4" />
        </video>
        <div 
          className="video-overlay" 
          style={{
            opacity: scrollProgress > 0.85 ? 0.95 : 0.2,
            transition: 'opacity 0.5s ease'
          }}
        />
      </div>

      {/* Indicador de scroll inicial */}
      {scrollProgress < 0.1 && (
        <div className="scroll-indicator-initial">
          <div className="mouse">
            <div className="wheel"></div>
          </div>
        </div>
      )}

      {/* Texto e botão aparecem quando vídeo acaba */}
      <div 
        className="hero-text-final"
        style={{ 
          opacity: textOpacity,
          transform: `translateY(${(1 - textOpacity) * 30}px)`,
          transition: 'opacity 0.5s ease, transform 0.5s ease'
        }}
      >
        <h1 className="reveal-text">Olá, eu sou</h1>
        <h2 className="reveal-name">Richard Camargo</h2>
        <p className="reveal-subtitle">Desenvolvedor Full Stack & UI/UX Designer</p>
        
        <div
          className="hero-button-wrapper"
          style={{
            opacity: buttonOpacity,
            transform: `translateY(${(1 - buttonOpacity) * 20}px)`,
            transition: 'opacity 0.5s ease, transform 0.5s ease'
          }}
        >
          <button 
            className="saiba-mais-btn"
            onClick={handleClick}
            style={{ pointerEvents: buttonOpacity > 0.5 ? 'auto' : 'none' }}
          >
            Saiba mais
          </button>
        </div>
      </div>
    </section>
  )
}

export default App
