import { useEffect, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import Navbar from './components/Navbar'
import ParticleCanvas from './components/ParticleCanvas'
import './App.css'

function App() {
  const videoRef = useRef(null)
  const heroRef = useRef(null)
  const contentRef = useRef(null)
  const [videoDuration, setVideoDuration] = useState(0)
  const [videoEnded, setVideoEnded] = useState(false)
  const [videoObjPos, setVideoObjPos] = useState('50% center')
  const [contentCenterY, setContentCenterY] = useState(null)
  const navigate = useNavigate()

  useEffect(() => {
    const video = videoRef.current
    if (!video) return

    const handleLoadedMetadata = () => {
      setVideoDuration(video.duration)
    }

    const handleVideoEnded = () => {
      setVideoEnded(true)
    }

    const handleTimeUpdate = () => {
      if (!video.duration || window.innerWidth >= 768) return
      const t = video.currentTime / video.duration
      if (t <= 0.25) {
        setVideoObjPos('50% center')
      } else if (t <= 0.55) {
        const progress = (t - 0.25) / 0.30
        const pos = 50 + progress * 25
        setVideoObjPos(`${pos.toFixed(1)}% center`)
      } else {
        setVideoObjPos('75% center')
      }
    }

    video.addEventListener('loadedmetadata', handleLoadedMetadata)
    video.addEventListener('ended', handleVideoEnded)
    video.addEventListener('timeupdate', handleTimeUpdate)
    
    if (video.readyState >= 2) {
      setVideoDuration(video.duration)
    }

    return () => {
      video.removeEventListener('loadedmetadata', handleLoadedMetadata)
      video.removeEventListener('ended', handleVideoEnded)
      video.removeEventListener('timeupdate', handleTimeUpdate)
    }
  }, [])

  // Mede o centro real do bloco de texto continuamente para sincronia com zoom
  useEffect(() => {
    if (!videoEnded || !contentRef.current) return
    const measure = () => {
      const rect = contentRef.current?.getBoundingClientRect()
      if (rect) setContentCenterY(rect.top + rect.height / 2)
    }
    measure() // mede imediatamente
    const interval = setInterval(measure, 100) // recalcula a cada 100ms para acompanhar zoom
    return () => clearInterval(interval)
  }, [videoEnded])

  // Bloqueia scroll e bounce no mobile (home é sempre full-screen)
  useEffect(() => {
    if (window.innerWidth >= 768) return
    const prev = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    document.documentElement.style.overflow = 'hidden'
    const prevent = (e) => e.preventDefault()
    document.addEventListener('touchmove', prevent, { passive: false })
    return () => {
      document.body.style.overflow = prev
      document.documentElement.style.overflow = ''
      document.removeEventListener('touchmove', prevent)
    }
  }, [])

  // Quando vídeo acaba, mostra a seção final
  const finalOpacity = videoEnded ? 1 : 0

  const handleClick = () => {
    navigate('/sobre')
  }

  return (
    <>
    <Navbar />
    <section ref={heroRef} className="hero-section">
      {/* Vídeo com wrapper que some quando termina */}
      <div 
        className="video-wrapper"
        style={{
          opacity: videoEnded ? 0 : 1,
          transition: 'opacity 0.5s ease'
        }}
      >
        <video
          ref={videoRef}
          className="hero-video"
          muted
          playsInline
          preload="auto"
          autoPlay
          playbackRate={2.0}
          style={{
            opacity: videoEnded ? 0 : 1,
            transition: 'opacity 0.5s ease, object-position 0.4s ease-out',
            objectPosition: videoObjPos
          }}
        >
          <source src="/Video_Fundo_Portfolio.mp4" type="video/mp4" />
        </video>
      </div>
      
      {/* Fundo preto aparece quando vídeo termina */}
      <div 
        className="dark-overlay"
        style={{
          opacity: videoEnded ? 1 : 0,
          transition: 'opacity 0.5s ease'
        }}
      />

      {/* Animação que aparece quando vídeo termina */}
      <div 
        className="wave-animation"
        style={{ 
          opacity: finalOpacity,
          transition: 'opacity 0.8s ease'
        }}
      >
        <ParticleCanvas contentCenterY={contentCenterY} />
        
        <div ref={contentRef} className={`content-overlay ${finalOpacity > 0.5 ? 'animate-in' : ''}`}>
          <h2 className="anim-name">Richard Camargo</h2>
          <p className="anim-subtitle">Transformando ideias e códigos em experiências incríveis</p>
          <span className="anim-tag">Full Stack Developer | UI/UX Designer</span>
          <button className="anim-btn" onClick={handleClick}>
            Saiba mais
            <svg className="btn-arrow" width="16" height="16" viewBox="0 0 16 16" fill="none">
              <path d="M3 8H13M13 8L9 4M13 8L9 12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </button>
        </div>
      </div>
    </section>
    
    </>
  )
}

export default App
