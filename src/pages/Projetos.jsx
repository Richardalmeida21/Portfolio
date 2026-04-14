import { useEffect, useRef, useState } from 'react'
import Navbar from '../components/Navbar'
import './Projetos.css'

/* ─── Dados ─────────────────────────────────────────────────────────────────── */
const projetos = [
  {
    id: 1,
    title: 'Projeto Principal',
    subtitle: 'Full Stack · SaaS',
    description: 'Aplicação full stack com foco em performance e UX. Arquitetura escalável, auth real em tempo real e design system próprio.',
    tags: ['React', 'Node.js', 'TypeScript', 'Supabase'],
    status: 'Em produção',
    statusColor: '#3ECF8E',
    metric: '+40%', metricLabel: 'retenção de usuários',
    liveUrl: '#', codeUrl: '#',
    accent: '#8B5CF6',
    bgGradient: 'radial-gradient(ellipse 80% 60% at 60% 40%, rgba(139,92,246,0.22) 0%, transparent 70%)',
    mockup: 'dashboard',
  },
  {
    id: 2,
    title: 'Lojas Nuvemshop',
    subtitle: 'E-commerce · Liquid',
    description: 'Desenvolvimento de código-fonte personalizado para lojas, manipulando o core da plataforma para layouts e funcionalidades exclusivas.',
    tags: ['Liquid', 'JavaScript', 'CSS', 'Nuvemshop'],
    status: 'Em produção',
    statusColor: '#3ECF8E',
    metric: '+20%', metricLabel: 'conversão',
    liveUrl: '#', codeUrl: '#',
    accent: '#F472B6',
    bgGradient: 'radial-gradient(ellipse 80% 60% at 40% 60%, rgba(244,114,182,0.18) 0%, transparent 70%)',
    mockup: 'shop',
  },
  {
    id: 3,
    title: 'Sistemas SEFAZ-SP',
    subtitle: 'Gov · Backend',
    description: 'Suporte técnico especializado para sistemas críticos da SEFAZ-SP na Castgroup, lidando com alta demanda governamental.',
    tags: ['Java', 'Spring Boot', 'SQL', 'Oracle'],
    status: 'Em produção',
    statusColor: '#38BDF8',
    metric: '99.9%', metricLabel: 'uptime',
    liveUrl: '#', codeUrl: '#',
    accent: '#38BDF8',
    bgGradient: 'radial-gradient(ellipse 80% 60% at 55% 45%, rgba(56,189,248,0.18) 0%, transparent 70%)',
    mockup: 'terminal',
  },
  {
    id: 4,
    title: 'Engenharia de IA',
    subtitle: 'LLMs · Automação',
    description: 'Integração de inteligência generativa e automação avançada ao desenvolvimento Full Stack. Pipelines de IA em produção.',
    tags: ['Python', 'LangChain', 'OpenAI', 'FastAPI'],
    status: 'Em desenvolvimento',
    statusColor: '#a78bfa',
    metric: 'GPT-4o', metricLabel: 'integrado',
    liveUrl: '#', codeUrl: '#',
    accent: '#C084FC',
    bgGradient: 'radial-gradient(ellipse 80% 60% at 50% 50%, rgba(192,132,252,0.2) 0%, transparent 70%)',
    mockup: 'neural',
  },
]

/* ─── Mockups ────────────────────────────────────────────────────────────────── */
function MockupDashboard({ accent }) {
  return (
    <div className="hud-mockup hud-mockup--dashboard">
      <div className="hud-bar">
        <span className="hud-dot" /><span className="hud-dot" /><span className="hud-dot" />
        <span className="hud-url">dashboard.app</span>
      </div>
      <div className="hud-body">
        <div className="hud-sidebar">
          {[1,1,1,1].map((_,i) => <div key={i} className="hud-nav" style={{ opacity: i===0?1:0.3, background: i===0 ? accent : undefined }} />)}
        </div>
        <div className="hud-main">
          <div className="hud-stats-row">
            {['#3ECF8E','#38BDF8',accent].map((c,i) => (
              <div key={i} className="hud-stat-card" style={{ borderColor: c+'44' }}>
                <div className="hud-stat-fill" style={{ background: c, width: `${[70,55,85][i]}%` }} />
              </div>
            ))}
          </div>
          <div className="hud-chart">
            {[30,50,40,70,55,80,65,45].map((h,i) => (
              <div key={i} className="hud-bar-item" style={{ height:`${h}%`, background: accent+'55', animationDelay:`${i*0.1}s` }} />
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

function MockupShop({ accent }) {
  return (
    <div className="hud-mockup hud-mockup--shop">
      <div className="hud-bar">
        <span className="hud-dot" /><span className="hud-dot" /><span className="hud-dot" />
        <span className="hud-url">loja.nuvemshop.com</span>
      </div>
      <div className="shop-body">
        <div className="shop-header" style={{ borderColor: accent+'33' }}>
          <div className="shop-logo" style={{ background: accent+'22', borderColor: accent+'44' }} />
          <div className="shop-nav-items">
            {[1,1,1].map((_,i) => <div key={i} className="shop-nav-line" style={{ opacity: i===0?0.7:0.25 }} />)}
          </div>
          <div className="shop-cart" style={{ background: accent+'22', borderColor: accent+'44' }} />
        </div>
        <div className="shop-products">
          {[accent+'22',accent+'18',accent+'14'].map((bg,i) => (
            <div key={i} className="shop-product" style={{ background: bg, borderColor: accent+'33' }}>
              <div className="shop-product-img" style={{ background: accent+'30' }} />
              <div className="shop-product-lines">
                <div className="shop-line" style={{ width:'80%' }} />
                <div className="shop-line" style={{ width:'55%', background: accent+'88' }} />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

function MockupTerminal({ accent }) {
  const lines = ['$ mvn spring-boot:run', '  .   ____          _', '  Started Application', '> DB connected :5432', '$ curl /api/nfe/status', '  {"status":"OK"}']
  return (
    <div className="hud-mockup hud-mockup--terminal">
      <div className="hud-bar terminal-bar">
        <span className="hud-dot" style={{ background:'#ff5f57' }} />
        <span className="hud-dot" style={{ background:'#febc2e' }} />
        <span className="hud-dot" style={{ background:'#28c840' }} />
        <span className="hud-url">sefaz-api ~ bash</span>
      </div>
      <div className="terminal-lines">
        {lines.map((l,i) => (
          <div key={i} className="terminal-line" style={{ animationDelay:`${i*0.25}s`, color: l.startsWith('$') ? accent : l.includes('OK') ? '#3ECF8E' : 'rgba(255,255,255,0.5)' }}>
            {l}
          </div>
        ))}
        <div className="terminal-cursor" style={{ background: accent }} />
      </div>
    </div>
  )
}

function MockupNeural({ accent }) {
  const nodes = [
    [50,15],[20,40],[80,40],[35,65],[65,65],[50,88],
    [10,60],[90,60],
  ]
  const edges = [[0,1],[0,2],[1,3],[2,4],[3,5],[4,5],[1,6],[2,7]]
  return (
    <div className="hud-mockup hud-mockup--neural">
      <svg viewBox="0 0 100 100" className="neural-svg">
        {edges.map(([a,b],i) => (
          <line key={i}
            x1={nodes[a][0]} y1={nodes[a][1]}
            x2={nodes[b][0]} y2={nodes[b][1]}
            stroke={accent} strokeWidth="0.6" strokeOpacity="0.35"
            className="neural-edge"
            style={{ animationDelay: `${i*0.2}s` }}
          />
        ))}
        {nodes.map(([cx,cy],i) => (
          <circle key={i} cx={cx} cy={cy} r="3" fill={accent} opacity="0.7" className="neural-node" style={{ animationDelay:`${i*0.15}s` }} />
        ))}
      </svg>
      <div className="neural-label" style={{ color: accent }}>GPT-4o · LangChain</div>
    </div>
  )
}

const mockupMap = { dashboard: MockupDashboard, shop: MockupShop, terminal: MockupTerminal, neural: MockupNeural }

/* ─── Fundo reativo (canvas de partículas) ──────────────────────────────────── */
function ReactiveBackground({ accent, bgGradient }) {
  const canvasRef = useRef(null)
  const accentRef = useRef(accent)
  const rafRef = useRef()

  useEffect(() => { accentRef.current = accent }, [accent])

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')

    const resize = () => {
      canvas.width = canvas.offsetWidth
      canvas.height = canvas.offsetHeight
    }
    resize()
    window.addEventListener('resize', resize)

    // partículas flutuantes
    const particles = Array.from({ length: 55 }, () => ({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      vx: (Math.random() - 0.5) * 0.3,
      vy: (Math.random() - 0.5) * 0.3,
      r: Math.random() * 1.5 + 0.3,
      opacity: Math.random() * 0.4 + 0.1,
    }))

    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height)
      particles.forEach(p => {
        p.x += p.vx; p.y += p.vy
        if (p.x < 0) p.x = canvas.width
        if (p.x > canvas.width) p.x = 0
        if (p.y < 0) p.y = canvas.height
        if (p.y > canvas.height) p.y = 0
        ctx.beginPath()
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2)
        ctx.fillStyle = accentRef.current
        ctx.globalAlpha = p.opacity
        ctx.fill()
      })
      ctx.globalAlpha = 1
      rafRef.current = requestAnimationFrame(draw)
    }
    draw()
    return () => { cancelAnimationFrame(rafRef.current); window.removeEventListener('resize', resize) }
  }, [])

  return (
    <div className="reactive-bg" style={{ background: bgGradient }}>
      <canvas ref={canvasRef} className="reactive-canvas" />
    </div>
  )
}

/* ─── Página principal ──────────────────────────────────────────────────────── */
function Projetos() {
  const [active, setActive] = useState(0)
  const trackRef = useRef(null)
  const isDragging = useRef(false)
  const startX = useRef(0)
  const scrollLeft = useRef(0)

  const projeto = projetos[active]

  // libera scroll da página
  useEffect(() => {
    document.body.style.overflow = 'hidden'
    document.body.style.height = '100vh'
    const root = document.getElementById('root')
    if (root) { root.style.overflow = 'hidden'; root.style.height = '100vh' }
    return () => {
      document.body.style.overflow = 'hidden'
      document.body.style.height = '100vh'
      if (root) { root.style.overflow = 'hidden'; root.style.height = '100vh' }
    }
  }, [])

  // roda do mouse → navega projetos
  useEffect(() => {
    const onWheel = (e) => {
      e.preventDefault()
      if (e.deltaY > 30) setActive(a => Math.min(a + 1, projetos.length - 1))
      else if (e.deltaY < -30) setActive(a => Math.max(a - 1, 0))
    }
    window.addEventListener('wheel', onWheel, { passive: false })
    return () => window.removeEventListener('wheel', onWheel)
  }, [])

  // teclado
  useEffect(() => {
    const onKey = (e) => {
      if (e.key === 'ArrowRight' || e.key === 'ArrowDown') setActive(a => Math.min(a + 1, projetos.length - 1))
      if (e.key === 'ArrowLeft'  || e.key === 'ArrowUp')   setActive(a => Math.max(a - 1, 0))
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [])

  // touch/drag na track dos thumbnails
  const onMouseDown = (e) => { isDragging.current = true; startX.current = e.pageX - trackRef.current.offsetLeft; scrollLeft.current = trackRef.current.scrollLeft }
  const onMouseMove = (e) => { if (!isDragging.current) return; const x = e.pageX - trackRef.current.offsetLeft; trackRef.current.scrollLeft = scrollLeft.current - (x - startX.current) }
  const onMouseUp = () => { isDragging.current = false }

  const MockupComp = mockupMap[projeto.mockup]

  return (
    <div className="showroom-root">
      <Navbar />

      {/* Fundo reativo */}
      <ReactiveBackground key={active} accent={projeto.accent} bgGradient={projeto.bgGradient} />

      {/* Linha de progresso */}
      <div className="progress-bar">
        <div className="progress-fill" style={{ width: `${((active + 1) / projetos.length) * 100}%`, background: projeto.accent }} />
      </div>

      {/* Contador */}
      <div className="project-counter">
        <span style={{ color: projeto.accent }}>{String(active + 1).padStart(2,'0')}</span>
        <span className="counter-sep">/</span>
        <span>{String(projetos.length).padStart(2,'0')}</span>
      </div>

      {/* Layout principal */}
      <div className="showroom-stage">

        {/* Lado esquerdo — HUD de info */}
        <div className="hud-panel" key={active}>
          <p className="hud-subtitle">{projeto.subtitle}</p>
          <h2 className="hud-title" style={{ '--accent': projeto.accent }}>{projeto.title}</h2>
          <p className="hud-desc">{projeto.description}</p>

          <div className="hud-metric">
            <span className="hud-metric-value" style={{ color: projeto.accent }}>{projeto.metric}</span>
            <span className="hud-metric-label">{projeto.metricLabel}</span>
          </div>

          <div className="hud-tags">
            {projeto.tags.map(t => (
              <span key={t} className="hud-tag" style={{ borderColor: projeto.accent+'55', color: projeto.accent }}>{t}</span>
            ))}
          </div>

          <div className="hud-status">
            <span className="hud-status-dot" style={{ background: projeto.statusColor }} />
            <span style={{ color: projeto.statusColor }}>{projeto.status}</span>
          </div>

          <div className="hud-actions">
            <a href={projeto.liveUrl} className="hud-btn hud-btn--primary" style={{ background: projeto.accent }}>
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M18 13v6a2 2 0 01-2 2H5a2 2 0 01-2-2V8a2 2 0 012-2h6"/><polyline points="15 3 21 3 21 9"/><line x1="10" y1="14" x2="21" y2="3"/></svg>
              Live Demo
            </a>
            <a href={projeto.codeUrl} className="hud-btn hud-btn--ghost" style={{ borderColor: projeto.accent+'66', color: projeto.accent }}>
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="16 18 22 12 16 6"/><polyline points="8 6 2 12 8 18"/></svg>
              Ver Código
            </a>
          </div>
        </div>

        {/* Lado direito — Mockup 3D flutuante */}
        <div className="mockup-stage" key={`m-${active}`}>
          <div className="mockup-float">
            <div className="mockup-shadow" style={{ background: projeto.accent }} />
            <MockupComp accent={projeto.accent} />
          </div>
        </div>

      </div>

      {/* Thumbnails / nav inferior */}
      <div
        className="showroom-nav"
        ref={trackRef}
        onMouseDown={onMouseDown}
        onMouseMove={onMouseMove}
        onMouseUp={onMouseUp}
        onMouseLeave={onMouseUp}
      >
        {projetos.map((p, i) => (
          <button
            key={p.id}
            className={`nav-thumb ${i === active ? 'active' : ''}`}
            style={{ '--acc': p.accent }}
            onClick={() => setActive(i)}
          >
            <span className="nav-thumb-title">{p.title}</span>
            <span className="nav-thumb-sub">{p.subtitle}</span>
          </button>
        ))}
      </div>

      {/* Hint de navegação */}
      <div className="scroll-hint">
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M17 8l4 4-4 4M3 12h18"/></svg>
        scroll ou ← →
      </div>
    </div>
  )
}

export default Projetos
