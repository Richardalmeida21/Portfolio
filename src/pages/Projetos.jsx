import { useEffect, useRef, useState, useCallback } from 'react'
import Navbar from '../components/Navbar'
import './Projetos.css'

/* ─── Dados ─────────────────────────────────────────────────────────────────── */
const projetos = [
  {
    id: 1,
    title: 'Eora Eyewear',
    subtitle: 'E-commerce · Nuvemshop',
    description: 'Personalização avançada de código-fonte para e-commerce. Customização total do core Liquid/Nuvemshop com implementação de funcionalidades exclusivas via código, eliminando a dependência de apps externos e melhorando o tempo de carregamento.',
    tags: ['Nuvemshop', 'Liquid', 'JavaScript', 'CSS / Sass', 'UX Design'],
    status: 'Em produção',
    statusColor: '#3ECF8E',
    metric: '', metricLabel: '',
    liveUrl: 'https://www.eoraeyewear.com/', codeUrl: '#',
    liveLabel: 'Visitar Loja',
    accent: '#8B5CF6',
    bgGradient: 'radial-gradient(ellipse 80% 60% at 60% 40%, rgba(139,92,246,0.22) 0%, transparent 70%)',
    mockup: 'video',
    video: '/Eora.mp4',
    videoMobile: '/eora_mobile.mp4',
    urlLabel: 'eoraeyewear.com',
  },
  {
    id: 2,
    title: 'Rich Training',
    subtitle: 'SaaS · Full Stack',
    description: 'Uma plataforma pensada para transformar a rotina de treinos em dados acionáveis. Foco em UX minimalista e sem fricção, com fluxo de onboarding intuitivo e sistema de registro de performance pixel-perfect — fazendo da tecnologia uma aliada da alta performance física.',
    tags: ['React', 'TypeScript', 'Supabase', 'PostgreSQL', 'Tailwind CSS'],
    status: 'Em produção',
    statusColor: '#3ECF8E',
    metric: '', metricLabel: '',
    liveUrl: 'https://richtraining.vercel.app/', codeUrl: '#',
    liveLabel: 'Acessar RichTraining',
    accent: '#3ECF8E',
    bgGradient: 'radial-gradient(ellipse 80% 60% at 40% 60%, rgba(62,207,142,0.18) 0%, transparent 70%)',
    mockup: 'video',
    video: '/richtraining.mp4',
    videoMobile: '/richtraining_mobile.mp4',
    urlLabel: 'richtraining.app',
  },
  {
    id: 3,
    title: 'Agenda Maestria',
    subtitle: 'Enterprise Systems · Full Stack',
    description: 'Sistema de agenciamento de alta performance focado em escalabilidade e segurança. Ecossistema completo com Java + Spring Boot para uma API REST robusta em Clean Architecture. O diferencial técnico reside na gestão eficiente de concorrência e integridade dos dados, entregando uma solução de nível corporativo pronta para alta demanda.',
    tags: ['Java', 'Spring Boot', 'React', 'TypeScript', 'REST API', 'PostgreSQL'],
    status: 'Em produção',
    statusColor: '#3ECF8E',
    metric: '', metricLabel: '',
    liveUrl: '#', codeUrl: '#',
    private: true,
    accent: '#38BDF8',
    bgGradient: 'radial-gradient(ellipse 80% 60% at 55% 45%, rgba(56,189,248,0.18) 0%, transparent 70%)',
    mockup: 'image',
    image: '/Agenda.png',
    imageMobile: '/Agenda_mobile.png',
    urlLabel: 'agendamaestria.app',
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
    comingSoon: true,
    accent: '#C084FC',
    bgGradient: 'radial-gradient(ellipse 80% 60% at 50% 50%, rgba(192,132,252,0.2) 0%, transparent 70%)',
    mockup: 'neural',
  },
]

/* ─── Mockups ────────────────────────────────────────────────────────────────── */
function MockupVideo({ video, videoMobile, accent, urlLabel }) {
  const [tab, setTab] = useState('desktop')
  const isDesktop = tab === 'desktop'

  return (
    <div className="mockup-video-wrap">
      {/* Tabs */}
      <div className="mockup-tabs">
        <button
          className={`mockup-tab ${isDesktop ? 'active' : ''}`}
          style={isDesktop ? { borderColor: accent, color: accent } : {}}
          onClick={() => setTab('desktop')}
        >
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="2" y="3" width="20" height="14" rx="2"/><line x1="8" y1="21" x2="16" y2="21"/><line x1="12" y1="17" x2="12" y2="21"/></svg>
          Desktop
        </button>
        <button
          className={`mockup-tab ${!isDesktop ? 'active' : ''}`}
          style={!isDesktop ? { borderColor: accent, color: accent } : {}}
          onClick={() => setTab('mobile')}
        >
          <svg width="11" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="5" y="2" width="14" height="20" rx="2"/><circle cx="12" cy="18" r="1" fill="currentColor"/></svg>
          Mobile
        </button>
      </div>

      {/* Ambos renderizados sempre — só esconde o inativo */}
      <div className="frame-desktop" style={!isDesktop ? { display: 'none' } : {}}>
        <div className="frame-desktop-bar">
          <span className="hud-dot" /><span className="hud-dot" /><span className="hud-dot" />
          <span className="hud-url">{urlLabel || 'app'}</span>
        </div>
        <video className="mockup-video-el" src={video} autoPlay muted loop playsInline preload="metadata" />
        <div className="frame-desktop-base" />
      </div>

      <div className="frame-mobile" style={isDesktop ? { display: 'none' } : {}}>
        <div className="frame-mobile-notch" />
        <video className="mockup-video-el mockup-video-el--mobile" src={videoMobile} autoPlay muted loop playsInline preload="metadata" />
        <div className="frame-mobile-home" />
      </div>
    </div>
  )
}

function MockupImage({ image, imageMobile, accent, urlLabel }) {
  const [tab, setTab] = useState('desktop')
  const isDesktop = tab === 'desktop'

  return (
    <div className="mockup-video-wrap">
      <div className="mockup-tabs">
        <button
          className={`mockup-tab ${isDesktop ? 'active' : ''}`}
          style={isDesktop ? { borderColor: accent, color: accent } : {}}
          onClick={() => setTab('desktop')}
        >
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="2" y="3" width="20" height="14" rx="2"/><line x1="8" y1="21" x2="16" y2="21"/><line x1="12" y1="17" x2="12" y2="21"/></svg>
          Desktop
        </button>
        <button
          className={`mockup-tab ${!isDesktop ? 'active' : ''}`}
          style={!isDesktop ? { borderColor: accent, color: accent } : {}}
          onClick={() => setTab('mobile')}
        >
          <svg width="11" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="5" y="2" width="14" height="20" rx="2"/><circle cx="12" cy="18" r="1" fill="currentColor"/></svg>
          Mobile
        </button>
      </div>

      <div className="frame-desktop" style={!isDesktop ? { display: 'none' } : {}}>
        <div className="frame-desktop-bar">
          <span className="hud-dot" /><span className="hud-dot" /><span className="hud-dot" />
          <span className="hud-url">{urlLabel || 'app'}</span>
        </div>
        <img className="mockup-video-el" src={image} alt="Desktop preview" />
        <div className="frame-desktop-base" />
      </div>

      <div className="frame-mobile" style={isDesktop ? { display: 'none' } : {}}>
        <div className="frame-mobile-notch" />
        <img className="mockup-video-el mockup-video-el--mobile" src={imageMobile} alt="Mobile preview" />
        <div className="frame-mobile-home" />
      </div>
    </div>
  )
}

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

const mockupMap = { video: MockupVideo, image: MockupImage, dashboard: MockupDashboard, shop: MockupShop, terminal: MockupTerminal, neural: MockupNeural }


/* ─── Fundo reativo (canvas de partículas) ──────────────────────────────────── */
function ReactiveBackground({ accent, bgGradient }) {
  const canvasRef = useRef(null)
  const accentRef = useRef(accent)
  const rafRef = useRef()

  useEffect(() => { accentRef.current = accent }, [accent])

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d', { alpha: true })

    let resizeTimer
    const resize = () => {
      canvas.width = canvas.offsetWidth
      canvas.height = canvas.offsetHeight
    }
    resize()
    const onResize = () => { clearTimeout(resizeTimer); resizeTimer = setTimeout(resize, 150) }
    window.addEventListener('resize', onResize)

    // partículas flutuantes — reduzidas
    const count = window.innerWidth < 600 ? 20 : 35
    const particles = Array.from({ length: count }, () => ({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      vx: (Math.random() - 0.5) * 0.3,
      vy: (Math.random() - 0.5) * 0.3,
      r: Math.random() * 1.5 + 0.3,
      opacity: Math.random() * 0.4 + 0.1,
    }))

    let lastFrame = 0
    const draw = (now) => {
      rafRef.current = requestAnimationFrame(draw)
      if (now - lastFrame < 33) return  // ~30fps
      lastFrame = now

      ctx.clearRect(0, 0, canvas.width, canvas.height)
      const color = accentRef.current
      for (const p of particles) {
        p.x += p.vx; p.y += p.vy
        if (p.x < 0) p.x = canvas.width
        if (p.x > canvas.width) p.x = 0
        if (p.y < 0) p.y = canvas.height
        if (p.y > canvas.height) p.y = 0
        ctx.beginPath()
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2)
        ctx.fillStyle = color
        ctx.globalAlpha = p.opacity
        ctx.fill()
      }
      ctx.globalAlpha = 1
    }
    rafRef.current = requestAnimationFrame(draw)
    return () => { cancelAnimationFrame(rafRef.current); clearTimeout(resizeTimer); window.removeEventListener('resize', onResize) }
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

  // swipe vertical no mobile → desativado (navegação pelos cards abaixo)
  useEffect(() => {
    if (window.innerWidth >= 860) {
      const THRESHOLD = 40
      let touchStartY = 0
      const onTouchStart = (e) => { touchStartY = e.touches[0].clientY }
      const onTouchEnd = (e) => {
        const dy = e.changedTouches[0].clientY - touchStartY
        if (Math.abs(dy) < THRESHOLD) return
        if (dy < 0) setActive(a => Math.min(a + 1, projetos.length - 1))
        else        setActive(a => Math.max(a - 1, 0))
      }
      window.addEventListener('touchstart', onTouchStart, { passive: true })
      window.addEventListener('touchend', onTouchEnd, { passive: true })
      return () => {
        window.removeEventListener('touchstart', onTouchStart)
        window.removeEventListener('touchend', onTouchEnd)
      }
    }
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

      {/* Layout principal */}
      <div className="showroom-stage">

        {/* Lado esquerdo — HUD de info */}
        <div className="hud-panel" key={active}>
          <p className="hud-subtitle">{projeto.subtitle}</p>
          <h2 className="hud-title" style={{ '--accent': projeto.accent }}>{projeto.title}</h2>
          <p className="hud-desc">{projeto.description}</p>

          {projeto.metric && (
          <div className="hud-metric">
            <span className="hud-metric-value" style={{ color: projeto.accent }}>{projeto.metric}</span>
            <span className="hud-metric-label">{projeto.metricLabel}</span>
          </div>
          )}

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
            {projeto.private ? (
              <span className="hud-private-badge">
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
                  <path d="M7 11V7a5 5 0 0 1 10 0v4" />
                </svg>
                Acesso Restrito
              </span>
            ) : projeto.comingSoon ? (
              <span className="hud-btn hud-btn--primary" style={{ background: projeto.accent + '44', color: projeto.accent, cursor: 'default' }}>
                Em breve
              </span>
            ) : (
              <a href={projeto.liveUrl} target="_blank" rel="noopener noreferrer" className="hud-btn hud-btn--primary" style={{ background: projeto.accent, color: '#0a1a0a' }}>
                {projeto.liveLabel || 'Live Demo'}
              </a>
            )}
          </div>
        </div>

        {/* Lado direito — Mockup */}
        <div className="mockup-stage" key={`m-${active}`}>
          <div className={['video','image'].includes(projeto.mockup) ? 'mockup-static' : 'mockup-float'}>
            {!['video','image'].includes(projeto.mockup) && <div className="mockup-shadow" style={{ background: projeto.accent }} />}
            <MockupComp accent={projeto.accent} video={projeto.video} videoMobile={projeto.videoMobile} image={projeto.image} imageMobile={projeto.imageMobile} urlLabel={projeto.urlLabel} />
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
