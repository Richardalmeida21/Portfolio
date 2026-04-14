import { useEffect, useRef } from 'react'
import Navbar from '../components/Navbar'
import '../App.css'

/* ─── Tilt 3D ──────────────────────────────────────────────────────────────── */
function TiltCard({ className, children, style }) {
  const ref = useRef(null)
  useEffect(() => {
    const el = ref.current
    if (!el) return
    const glare = el.querySelector('.card-glare')
    const onMove = (e) => {
      const r = el.getBoundingClientRect()
      const x = (e.clientX - r.left) / r.width - 0.5
      const y = (e.clientY - r.top) / r.height - 0.5
      el.style.transition = 'transform 0.08s ease-out, border-color 0.3s ease, box-shadow 0.3s ease'
      el.style.transform = `perspective(900px) rotateX(${-y * 9}deg) rotateY(${x * 9}deg) translateZ(6px)`
      if (glare) glare.style.background = `radial-gradient(circle at ${(x + 0.5) * 100}% ${(y + 0.5) * 100}%, rgba(255,255,255,0.07) 0%, transparent 65%)`
    }
    const onLeave = () => {
      el.style.transition = 'transform 0.5s ease, border-color 0.3s ease, box-shadow 0.3s ease, opacity 0.65s ease'
      el.style.transform = 'perspective(900px) rotateX(0deg) rotateY(0deg) translateZ(0px)'
      if (glare) glare.style.background = 'transparent'
    }
    el.addEventListener('mousemove', onMove)
    el.addEventListener('mouseleave', onLeave)
    return () => { el.removeEventListener('mousemove', onMove); el.removeEventListener('mouseleave', onLeave) }
  }, [])
  return (
    <div ref={ref} className={className} style={style}>
      <div className="card-glare" aria-hidden="true" />
      {children}
    </div>
  )
}

/* ─── Número sólido "4+" ─────────────────────────────────────────────────── */
function YearsDisplay() {
  return (
    <div className="years-display">
      <span className="years-number">4<sup className="years-plus">+</sup></span>
      <span className="years-label">anos de<br />experiência</span>
    </div>
  )
}

/* ─── SVG Icons ────────────────────────────────────────────────────────────── */
const IconCode = () => (
  <svg className="card-svg-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <polyline points="16 18 22 12 16 6"/><polyline points="8 6 2 12 8 18"/>
  </svg>
)
const IconShop = () => (
  <svg className="card-svg-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d="M20.59 13.41l-7.17 7.17a2 2 0 0 1-2.83 0L2 12V2h10l8.59 8.59a2 2 0 0 1 0 2.82z"/>
    <line x1="7" y1="7" x2="7.01" y2="7"/>
  </svg>
)
const IconServer = () => (
  <svg className="card-svg-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <rect x="2" y="2" width="20" height="8" rx="2" ry="2"/><rect x="2" y="14" width="20" height="8" rx="2" ry="2"/>
    <line x1="6" y1="6" x2="6.01" y2="6"/><line x1="6" y1="18" x2="6.01" y2="18"/>
  </svg>
)
const IconNeural = () => (
  <svg className="card-svg-icon ia-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <circle cx="12" cy="12" r="2"/>
    <circle cx="4" cy="6" r="1.5"/><circle cx="20" cy="6" r="1.5"/>
    <circle cx="4" cy="18" r="1.5"/><circle cx="20" cy="18" r="1.5"/>
    <line x1="5.5" y1="7" x2="10" y2="11"/><line x1="18.5" y1="7" x2="14" y2="11"/>
    <line x1="5.5" y1="17" x2="10" y2="13"/><line x1="18.5" y1="17" x2="14" y2="13"/>
  </svg>
)

/* ─── Página ────────────────────────────────────────────────────────────────── */
function Sobre() {
  const sectionRef = useRef(null)

  useEffect(() => {
    document.body.style.overflow = 'auto'
    document.body.style.height = 'auto'
    const root = document.getElementById('root')
    if (root) { root.style.overflow = 'auto'; root.style.height = 'auto' }
    return () => {
      document.body.style.overflow = 'hidden'
      document.body.style.height = '100vh'
      if (root) { root.style.overflow = 'hidden'; root.style.height = '100vh' }
    }
  }, [])

  useEffect(() => {
    const el = sectionRef.current
    if (!el) return
    const onMove = (e) => {
      const r = el.getBoundingClientRect()
      el.style.setProperty('--spot-x', `${e.clientX - r.left}px`)
      el.style.setProperty('--spot-y', `${e.clientY - r.top}px`)
    }
    window.addEventListener('mousemove', onMove)
    return () => window.removeEventListener('mousemove', onMove)
  }, [])

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => entries.forEach(e => e.isIntersecting && e.target.classList.add('card-visible')),
      { threshold: 0.1 }
    )
    document.querySelectorAll('.bento-card').forEach(c => observer.observe(c))
    return () => observer.disconnect()
  }, [])

  const skills = [
    'React', 'Node.js', 'TypeScript', 'Java', 'Spring Boot',
    'SQL', 'Liquid', 'Nuvemshop', 'Python', 'IA / LLMs',
  ]

  return (
    <>
      <Navbar />
      <section className="sobre-section visible" ref={sectionRef}>
        <div className="sobre-blob sobre-blob--1" aria-hidden="true" />
        <div className="sobre-blob sobre-blob--2" aria-hidden="true" />
        <div className="sobre-spotlight" aria-hidden="true" />
        <div className="bento-wrapper">
          <h2 className="sobre-title">Minha Trajetória</h2>
          <div className="bento-grid">

            {/* Intro */}
            <TiltCard className="bento-card bento-card-intro">
              <div className="card-icon-row">
                <IconCode />
                <p className="card-overline">Dev Full Stack</p>
              </div>
              <p className="card-body">
                Desenvolvedor com <span className="grad-text">4 anos</span> de experiência em
                software e web, focado em criar soluções que unem{' '}
                <span className="grad-text">performance</span> e arquitetura de código sólida.
              </p>
            </TiltCard>

            {/* Anos */}
            <TiltCard className="bento-card bento-card-years">
              <YearsDisplay />
            </TiltCard>

            {/* Nuvemshop */}
            <TiltCard className="bento-card bento-card-nuvem">
              <div className="card-icon-row">
                <IconShop />
                <p className="card-icon-label">Nuvemshop</p>
              </div>
              <p className="card-body">
                Especialista no desenvolvimento de{' '}
                <span className="grad-text">código-fonte</span> para lojas personalizadas,
                manipulando o core da plataforma para criar layouts e funcionalidades exclusivas.
              </p>
              <div className="nuvem-code-tag" aria-hidden="true">
                <span className="nuvem-bracket nuvem-bracket--open">&lt;</span>
                <span className="nuvem-slash">/</span>
                <span className="nuvem-bracket nuvem-bracket--close">&gt;</span>
              </div>
            </TiltCard>

            {/* SEFAZ */}
            <TiltCard className="bento-card bento-card-sefaz">
              <div className="card-icon-row">
                <IconServer />
                <p className="card-icon-label">Sistemas Públicos</p>
              </div>
              <p className="card-body">
                Atuo na <span className="grad-text">Castgroup</span> com suporte técnico
                especializado para os sistemas da{' '}
                <span className="grad-text">SEFAZ-SP</span>, lidando com fluxos críticos e
                alta demanda governamental.
              </p>
              <div className="sefaz-bars" aria-hidden="true">
                {[8, 14, 20, 12, 18, 10].map((h, i) => (
                  <span key={i} className="sefaz-bar" style={{ '--h': `${h}px`, '--n': i }} />
                ))}
              </div>
            </TiltCard>

            {/* IA */}
            <TiltCard className="bento-card bento-card-ia">
              <div className="ia-ring" aria-hidden="true" />
              <div className="ia-ring ia-ring--delayed" aria-hidden="true" />
              <div className="card-icon-row">
                <IconNeural />
                <p className="card-icon-label ia-label">Inovação em IA</p>
              </div>
              <p className="card-body">
                Especializando-me em{' '}
                <span className="grad-text">Engenharia de IA</span>, integrando inteligência
                generativa e automação avançada ao desenvolvimento{' '}
                <span className="grad-text">Full Stack</span>.
              </p>
              <div className="ia-brain" aria-hidden="true">
                <svg viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg" className="ia-brain-svg">
                  <circle cx="20" cy="20" r="4" stroke="currentColor" strokeWidth="1"/>
                  <circle cx="8" cy="12" r="2.5" stroke="currentColor" strokeWidth="1"/>
                  <circle cx="32" cy="12" r="2.5" stroke="currentColor" strokeWidth="1"/>
                  <circle cx="8" cy="28" r="2.5" stroke="currentColor" strokeWidth="1"/>
                  <circle cx="32" cy="28" r="2.5" stroke="currentColor" strokeWidth="1"/>
                  <circle cx="20" cy="5" r="2" stroke="currentColor" strokeWidth="1"/>
                  <circle cx="20" cy="35" r="2" stroke="currentColor" strokeWidth="1"/>
                  <line x1="10.2" y1="13.8" x2="16.5" y2="18" stroke="currentColor" strokeWidth="0.8"/>
                  <line x1="29.8" y1="13.8" x2="23.5" y2="18" stroke="currentColor" strokeWidth="0.8"/>
                  <line x1="10.2" y1="26.2" x2="16.5" y2="22" stroke="currentColor" strokeWidth="0.8"/>
                  <line x1="29.8" y1="26.2" x2="23.5" y2="22" stroke="currentColor" strokeWidth="0.8"/>
                  <line x1="20" y1="7" x2="20" y2="16" stroke="currentColor" strokeWidth="0.8"/>
                  <line x1="20" y1="24" x2="20" y2="33" stroke="currentColor" strokeWidth="0.8"/>
                  <circle cx="8" cy="12" r="1" fill="currentColor" className="ia-node"/>
                  <circle cx="32" cy="12" r="1" fill="currentColor" className="ia-node ia-node--d1"/>
                  <circle cx="8" cy="28" r="1" fill="currentColor" className="ia-node ia-node--d2"/>
                  <circle cx="32" cy="28" r="1" fill="currentColor" className="ia-node ia-node--d3"/>
                  <circle cx="20" cy="5" r="1" fill="currentColor" className="ia-node ia-node--d4"/>
                  <circle cx="20" cy="35" r="1" fill="currentColor" className="ia-node ia-node--d5"/>
                </svg>
              </div>
            </TiltCard>

          </div>

          <div className="skills-marquee-wrap" aria-label="Tecnologias">
            <div className="skills-marquee-track">
              {[...skills, ...skills].map((tag, i) => (
                <span className="skill-tag" key={i}>{tag}</span>
              ))}
            </div>
          </div>
        </div>
      </section>
    </>
  )
}

export default Sobre
