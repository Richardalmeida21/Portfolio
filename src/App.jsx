import { useEffect, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import Navbar from './components/Navbar'
import './App.css'

function App() {
  const videoRef = useRef(null)
  const heroRef = useRef(null)
  const [videoDuration, setVideoDuration] = useState(0)
  const [videoEnded, setVideoEnded] = useState(false)
  const [mousePos, setMousePos] = useState({ x: 50, y: 50 })
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

    video.addEventListener('loadedmetadata', handleLoadedMetadata)
    video.addEventListener('ended', handleVideoEnded)
    
    if (video.readyState >= 2) {
      setVideoDuration(video.duration)
    }

    return () => {
      video.removeEventListener('loadedmetadata', handleLoadedMetadata)
      video.removeEventListener('ended', handleVideoEnded)
    }
  }, [])

  // Vídeo roda automaticamente, scroll não controla mais

  // Efeito de mouse para gradiente interativo
  useEffect(() => {
    const handleMouseMove = (e) => {
      const x = (e.clientX / window.innerWidth) * 100
      const y = (e.clientY / window.innerHeight) * 100
      setMousePos({ x, y })
    }
    window.addEventListener('mousemove', handleMouseMove)
    return () => window.removeEventListener('mousemove', handleMouseMove)
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
            transition: 'opacity 0.5s ease'
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
        <div 
          className="gradient-bg"
          style={{
            '--mouse-x': `${mousePos.x}%`,
            '--mouse-y': `${mousePos.y}%`
          }}
        ></div>
        
        <div className={`content-overlay ${finalOpacity > 0.5 ? 'animate-in' : ''}`}>
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
