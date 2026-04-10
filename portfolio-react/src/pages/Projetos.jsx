import { useEffect, useRef, useState, useCallback } from 'react'
import Navbar from '../components/Navbar'
import '../App.css'
import './Projetos.css'

function useTilt(ref) {
  useEffect(() => {
    const el = ref.current
    if (!el) return
    const handleMove = (e) => {
      const rect = el.getBoundingClientRect()
      const x = (e.clientX - rect.left) / rect.width - 0.5
      const y = (e.clientY - rect.top) / rect.height - 0.5
      el.style.transform = `perspective(700px) rotateX(${-y * 7}deg) rotateY(${x * 7}deg) translateY(-4px) scale(1.01)`
    }
    const handleLeave = () => {
      el.style.transform = 'perspective(700px) rotateX(0) rotateY(0) translateY(0) scale(1)'
    }
    el.addEventListener('mousemove', handleMove)
    el.addEventListener('mouseleave', handleLeave)
    return () => {
      el.removeEventListener('mousemove', handleMove)
      el.removeEventListener('mouseleave', handleLeave)
    }
  }, [])
}

function useCounter(target, active, duration = 1200) {
  const [count, setCount] = useState(0)
  useEffect(() => {
    if (!active) return
    let current = 0
    const increment = target / (duration / 16)
    const timer = setInterval(() => {
      current += increment
      if (current >= target) { setCount(target); clearInterval(timer) }
      else setCount(Math.floor(current))
    }, 16)
    return () => clearInterval(timer)
  }, [active, target, duration])
  return count
}

const techColors = {
  'React': { bg: 'rgba(97, 218, 251, 0.08)', color: '#61DAFB', border: 'rgba(97, 218, 251, 0.25)' },
  'Node.js': { bg: 'rgba(104, 160, 99, 0.08)', color: '#68A063', border: 'rgba(104, 160, 99, 0.25)' },
  'TypeScript': { bg: 'rgba(49, 120, 198, 0.08)', color: '#3178C6', border: 'rgba(49, 120, 198, 0.25)' },
  'Figma': { bg: 'rgba(242, 78, 30, 0.08)', color: '#F24E1E', border: 'rgba(242, 78, 30, 0.25)' },
  'UI/UX': { bg: 'rgba(167, 139, 250, 0.08)', color: '#a78bfa', border: 'rgba(167, 139, 250, 0.25)' },
  'Tailwind': { bg: 'rgba(56, 189, 248, 0.08)', color: '#38BDF8', border: 'rgba(56, 189, 248, 0.25)' },
  'Supabase': { bg: 'rgba(62, 207, 142, 0.08)', color: '#3ECF8E', border: 'rgba(62, 207, 142, 0.25)' },
  'Next.js': { bg: 'rgba(255,255,255,0.05)', color: '#fff', border: 'rgba(255,255,255,0.2)' },
  'default': { bg: 'rgba(167, 139, 250, 0.08)', color: '#c084fc', border: 'rgba(167, 139, 250, 0.2)' },
}

const statusColors = {
  'Em produção': { bg: 'rgba(62, 207, 142, 0.12)', color: '#3ECF8E', dot: '#3ECF8E' },
  'Case de Estudo': { bg: 'rgba(56, 189, 248, 0.12)', color: '#38BDF8', dot: '#38BDF8' },
  'MVP': { bg: 'rgba(251, 191, 36, 0.12)', color: '#FBBF24', dot: '#FBBF24' },
  'Em desenvolvimento': { bg: 'rgba(167, 139, 250, 0.12)', color: '#a78bfa', dot: '#a78bfa' },
}

const projetos = [
  {
    id: 1, featured: true, mockupType: 'dashboard',
    title: 'Projeto Principal',
    description: 'Aplicação full stack com foco em performance e UX. Arquitetura escalável, auth, real-time.',
    tags: ['React', 'Node.js', 'TypeScript', 'Supabase'],
    status: 'Em produção',
    metric: 40, metricLabel: 'de retenção',
    liveUrl: '#', codeUrl: '#',
    color: 'rgba(139, 92, 246, 0.2)',
  },
  {
    id: 2, mockupType: 'design',
    title: 'UI/UX Case Study',
    description: 'Redesign orientado a dados. Pesquisa, wireframes, prototipagem e testes com usuários reais.',
    tags: ['Figma', 'UI/UX'],
    status: 'Case de Estudo',
    liveUrl: '#', codeUrl: '#',
    color: 'rgba(236, 72, 153, 0.15)',
  },
  {
    id: 3, mockupType: 'mobile',
    title: 'App Mobile',
    description: 'MVP de aplicativo React Native. Foco em conversão e fluxo de onboarding intuitivo.',
    tags: ['React', 'Tailwind'],
    status: 'MVP',
    metric: 28, metricLabel: 'de conversão',
    liveUrl: '#', codeUrl: '#',
    color: 'rgba(56, 189, 248, 0.15)',
  },
  {
    id: 4, mockupType: 'terminal',
    title: 'API & Backend',
    description: 'Arquitetura de microserviços com filas, workers e deploy automatizado via CI/CD.',
    tags: ['Node.js', 'TypeScript'],
    status: 'Em desenvolvimento',
    liveUrl: '#', codeUrl: '#',
    color: 'rgba(62, 207, 142, 0.12)',
  },
]

function MockupDashboard() {
  return (
    <div className="mockup-screen">
      <div className="mockup-bar"><span></span><span></span><span></span></div>
      <div className="mockup-dashboard">
        <div className="dash-sidebar">
          {[80,50,65,40].map((h,i) => <div key={i} className="dash-nav-item" style={{opacity: i===0?1:0.4}}></div>)}
        </div>
        <div className="dash-main">
          <div className="dash-stats">
            {['#a78bfa','#3ECF8E','#38BDF8'].map((c,i) => (
              <div key={i} className="dash-stat" style={{borderColor: c+'44'}}>
                <div className="dash-stat-bar" style={{background:c, width:`${[70,45,85][i]}%`}}></div>
              </div>
            ))}
          </div>
          <div className="dash-chart">
            {[30,50,40,70,55,80,65].map((h,i) => (
              <div key={i} className="chart-bar" style={{height:`${h}%`, background:'rgba(167,139,250,0.3)', animationDelay:`${i*0.1}s`}}></div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

function MockupDesign() {
  return (
    <div className="mockup-screen mockup-design">
      <div className="mockup-bar"><span></span><span></span><span></span></div>
      <div className="design-canvas">
        <div className="design-frame">
          <div className="frame-header" style={{background:'rgba(242,78,30,0.15)'}}></div>
          <div className="frame-body">
            <div className="frame-block large" style={{background:'rgba(242,78,30,0.08)'}}></div>
            <div className="frame-row">
              <div className="frame-block" style={{background:'rgba(242,78,30,0.06)'}}></div>
              <div className="frame-block" style={{background:'rgba(242,78,30,0.06)'}}></div>
            </div>
          </div>
        </div>
        <div className="design-tools">
          {['#F24E1E','#a78bfa','#38BDF8','#3ECF8E'].map((c,i) => (
            <div key={i} className="tool-dot" style={{background:c, opacity: i===0?1:0.4}}></div>
          ))}
        </div>
      </div>
    </div>
  )
}

function MockupMobile() {
  return (
    <div className="mockup-mobile">
      <div className="mobile-notch"></div>
      <div className="mobile-screen">
        <div className="mobile-header" style={{background:'rgba(56,189,248,0.12)'}}></div>
        <div className="mobile-list">
          {[1,2,3].map(i => (
            <div key={i} className="mobile-item">
              <div className="mobile-avatar" style={{background:`rgba(56,189,248,${0.1+i*0.05})`}}></div>
              <div className="mobile-lines">
                <div style={{width:'70%', height:4, borderRadius:2, background:'rgba(255,255,255,0.12)'}}></div>
                <div style={{width:'45%', height:3, borderRadius:2, background:'rgba(255,255,255,0.06)'}}></div>
              </div>
            </div>
          ))}
        </div>
        <div className="mobile-btn" style={{background:'rgba(56,189,248,0.25)'}}></div>
      </div>
    </div>
  )
}

function MockupTerminal() {
  const lines = ['$ npm run build', '✓ compiled in 234ms', '> api listening :3000', '$ docker compose up']
  return (
    <div className="mockup-screen mockup-terminal">
      <div className="mockup-bar"><span style={{background:'#ff5f57'}}></span><span style={{background:'#febc2e'}}></span><span style={{background:'#28c840'}}></span></div>
      <div className="terminal-body">
        {lines.map((l,i) => (
          <div key={i} className="terminal-line" style={{animationDelay:`${i*0.3}s`}}>
            <span className="terminal-prompt" style={{color: l.startsWith('$') ? '#3ECF8E' : l.startsWith('✓') ? '#68A063' : '#a78bfa'}}>
              {l}
            </span>
          </div>
        ))}
        <div className="terminal-cursor"></div>
      </div>
    </div>
  )
}

const mockupMap = { dashboard: MockupDashboard, design: MockupDesign, mobile: MockupMobile, terminal: MockupTerminal }

function ProjetoCard({ projeto, index }) {
  const cardRef = useRef(null)
  const [inView, setInView] = useState(false)
  useTilt(cardRef)
  const counter = useCounter(projeto.metric || 0, inView)

  useEffect(() => {
    const card = cardRef.current
    if (!card) return
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) { card.classList.add('in-view'); setInView(true) } },
      { threshold: 0.1 }
    )
    observer.observe(card)
    return () => observer.disconnect()
  }, [])

  const status = statusColors[projeto.status] || statusColors['MVP']
  const MockupComponent = mockupMap[projeto.mockupType] || MockupDashboard

  return (
    <div
      ref={cardRef}
      className={`projeto-card ${projeto.featured ? 'featured' : ''}`}
      style={{ '--card-color': projeto.color, '--delay': `${index * 0.12}s` }}
    >
      <div className="card-glow" style={{ background: projeto.color }}></div>

      <div className="card-mockup">
        <MockupComponent />
        <div className="card-hover-overlay">
          <a href={projeto.liveUrl} className="cta-btn primary" onClick={e => e.stopPropagation()}>
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M18 13v6a2 2 0 01-2 2H5a2 2 0 01-2-2V8a2 2 0 012-2h6"/>
              <polyline points="15 3 21 3 21 9"/><line x1="10" y1="14" x2="21" y2="3"/>
            </svg>
            Live Demo
          </a>
          <a href={projeto.codeUrl} className="cta-btn secondary" onClick={e => e.stopPropagation()}>
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <polyline points="16 18 22 12 16 6"/><polyline points="8 6 2 12 8 18"/>
            </svg>
            Ver Código
          </a>
        </div>
      </div>

      <div className="card-info">
        <div className="card-header">
          <h3 className="card-title">{projeto.title}</h3>
          <span className="status-badge" style={{ background: status.bg, color: status.color }}>
            <span className="status-dot" style={{ background: status.dot }}></span>
            {projeto.status}
          </span>
        </div>
        <p className="card-desc">{projeto.description}</p>

        {projeto.metric && (
          <div className="metric-pill">
            <span className="metric-value">+{counter}%</span>
            <span className="metric-label">{projeto.metricLabel}</span>
          </div>
        )}

        <div className="card-tags">
          {projeto.tags.map((t) => {
            const tc = techColors[t] || techColors['default']
            return <span key={t} className="tech-tag" style={{ background: tc.bg, color: tc.color, borderColor: tc.border }}>{t}</span>
          })}
        </div>
      </div>
    </div>
  )
}

function Projetos() {
  return (
    <>
      <Navbar />
      <div className="projetos-page">
        {/* Blobs atmosféricos */}
        <div className="blob blob-1"></div>
        <div className="blob blob-2"></div>
        <div className="blob blob-3"></div>

        <div className="projetos-header">
          <h2 className="projetos-title">Projetos</h2>
          <p className="projetos-subtitle">Uma seleção do que já construí</p>
        </div>
        <div className="bento-grid">
          {projetos.map((p, i) => (
            <ProjetoCard key={p.id} projeto={p} index={i} />
          ))}
        </div>
      </div>
    </>
  )
}

export default Projetos
