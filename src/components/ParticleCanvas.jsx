import { useEffect, useRef } from 'react'

const COLORS = ['#8B5CF6', '#A78BFA', '#C084FC', '#D946EF', '#EC4899', '#F472B6']
const REPEL_RADIUS = 140
const REPEL_STRENGTH = 7
const CONNECTION_DIST = 55
const TRAIL_LENGTH = 4

// Zona de exclusão elíptica (área atrás do texto)
function inExclusionZone(x, y, cx, cy, exW, exH) {
  const dx = (x - cx) / exW
  const dy = (y - cy) / exH
  return dx * dx + dy * dy < 1
}

// Detecta hardware fraco (poucos cores lógicos ou tela pequena com touch)
function isLowEnd() {
  const cores = navigator.hardwareConcurrency || 2
  const mem = navigator.deviceMemory || 2  // GB (Chrome only)
  return cores <= 4 || mem <= 4
}

export default function ParticleCanvas({ contentCenterY }) {
  const canvasRef = useRef(null)
  const contentCenterRef = useRef(null)

  useEffect(() => {
    if (contentCenterY) contentCenterRef.current = contentCenterY
  }, [contentCenterY])

  useEffect(() => {
    const canvas = canvasRef.current
    const ctx = canvas.getContext('2d', { alpha: true })
    let animId
    const mouse = { x: -9999, y: -9999 }
    const lowEnd = isLowEnd()

    const onMouseMove = (e) => { mouse.x = e.clientX; mouse.y = e.clientY }
    const onMouseLeave = () => { mouse.x = -9999; mouse.y = -9999 }
    window.addEventListener('mousemove', onMouseMove, { passive: true })
    window.addEventListener('mouseleave', onMouseLeave, { passive: true })

    // Mobile: repulsão apenas em tap, não em arrasto
    const onTouchStart = (e) => {
      const t = e.touches[0]
      mouse.x = t.clientX
      mouse.y = t.clientY
    }
    const onTouchEnd = () => { mouse.x = -9999; mouse.y = -9999 }
    window.addEventListener('touchstart', onTouchStart, { passive: true })
    window.addEventListener('touchend', onTouchEnd, { passive: true })

    let particles = []
    let lastCy = null
    // Pré-computa glow offscreen (substitui shadowBlur por stamp)
    const glowCanvases = COLORS.map(color => {
      const size = 32
      const off = document.createElement('canvas')
      off.width = size; off.height = size
      const octx = off.getContext('2d')
      const grad = octx.createRadialGradient(size / 2, size / 2, 0, size / 2, size / 2, size / 2)
      grad.addColorStop(0, color)
      grad.addColorStop(0.4, color + '88')
      grad.addColorStop(1, 'transparent')
      octx.fillStyle = grad
      octx.fillRect(0, 0, size, size)
      return off
    })

    function initParticles() {
      particles = []
      const cx = canvas.width / 2
      const isMobile = canvas.width < 600
      const cy = contentCenterRef.current ?? canvas.height / 2 + (isMobile ? 38 : 28)
      const isTablet = canvas.width < 1024

      // Contagem adaptativa: muito menos em PCs fracos / mobile
      const count = isMobile
        ? (lowEnd ? 250 : 450)
        : isTablet
          ? (lowEnd ? 400 : 700)
          : (lowEnd ? 600 : 1000)

      const exW = isMobile
        ? canvas.width * 0.44
        : Math.min(320, canvas.width * 0.3)
      const exH = isMobile
        ? canvas.height * 0.26
        : Math.min(175, canvas.height * 0.2)

      const xScale = isMobile ? 1.0 : isTablet ? 1.2 : 1.35
      const yScale = isMobile ? 1.0 : isTablet ? 0.8 : 0.78

      const safeMax = Math.min(cx, cy) * 0.97
      const innerR = Math.min(Math.max(exW, exH) + 8, safeMax - 12)
      const outerR = Math.min(
        isMobile ? safeMax : canvas.width * 0.38,
        safeMax
      )

      for (let i = 0; i < count; i++) {
        const angle = Math.random() * Math.PI * 2
        const t = Math.pow(Math.random(), 0.45)
        const radius = innerR + t * Math.max(outerR - innerR, 20)

        let px = cx + Math.cos(angle) * radius * xScale
        let py = cy + Math.sin(angle) * radius * yScale

        px = Math.max(4, Math.min(canvas.width - 4, px))
        py = Math.max(4, Math.min(canvas.height - 4, py))

        if (inExclusionZone(px, py, cx, cy, exW, exH)) {
          const ddx = px - cx || 1
          const ddy = py - cy || 1
          const dd = Math.sqrt(ddx * ddx + ddy * ddy)
          const pushDist = Math.max(exW, exH) * 1.05
          px = cx + (ddx / dd) * pushDist
          py = cy + (ddy / dd) * pushDist * (exH / exW)
        }

        const speed = 0.0006 + Math.random() * 0.0016
        const dir = Math.random() > 0.5 ? 1 : -1
        const isBright = Math.random() < 0.07
        const isStreamer = Math.random() < 0.04

        particles.push({
          x: px, y: py,
          vx: (Math.random() - 0.5) * 0.4,
          vy: (Math.random() - 0.5) * 0.4,
          baseAngle: angle,
          orbitRadius: radius,
          orbitSpeed: speed * dir,
          xScale, yScale,
          size: isStreamer ? Math.random() * 1.2 + 0.8 : Math.random() * 1.5 + 0.25,
          opacity: Math.random() * 0.6 + 0.25,
          colorIdx: Math.floor(Math.random() * COLORS.length),
          trail: [],
          isBright,
          isStreamer,
          exW, exH,
        })
      }
    }

    // Renderiza em resolução menor no DPR alto ou low-end
    let dpr = Math.min(window.devicePixelRatio || 1, lowEnd ? 1 : 1.5)

    function resize() {
      const w = window.innerWidth
      const h = window.innerHeight
      canvas.width = w * dpr
      canvas.height = h * dpr
      canvas.style.width = w + 'px'
      canvas.style.height = h + 'px'
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
      initParticles()
    }

    // Frame skip: limita a ~30fps em máquinas fracas
    let lastFrameTime = 0
    const frameBudget = lowEnd ? 33 : 16 // ms

    function draw(now) {
      animId = requestAnimationFrame(draw)

      if (now - lastFrameTime < frameBudget) return
      lastFrameTime = now

      const w = canvas.width / dpr
      const h = canvas.height / dpr
      ctx.clearRect(0, 0, w, h)
      const cx = w / 2
      const isMobile = w < 600
      const cy = contentCenterRef.current ?? h / 2 + (isMobile ? 38 : 28)

      if (lastCy !== null && Math.abs(cy - lastCy) > 20) {
        initParticles()
      }
      lastCy = cy

      // ── Update particles ──────────────────────────────
      for (const p of particles) {
        p.trail.push({ x: p.x, y: p.y })
        if (p.trail.length > TRAIL_LENGTH) p.trail.shift()

        p.baseAngle += p.orbitSpeed
        const tx = cx + Math.cos(p.baseAngle) * p.orbitRadius * p.xScale
        const ty = cy + Math.sin(p.baseAngle) * p.orbitRadius * p.yScale

        p.vx += (tx - p.x) * 0.0016
        p.vy += (ty - p.y) * 0.0016

        // Repulsão do mouse
        const dx = p.x - mouse.x
        const dy = p.y - mouse.y
        const distSq = dx * dx + dy * dy
        if (distSq < REPEL_RADIUS * REPEL_RADIUS && distSq > 0) {
          const dist = Math.sqrt(distSq)
          const f = Math.pow(1 - dist / REPEL_RADIUS, 2) * REPEL_STRENGTH
          p.vx += (dx / dist) * f
          p.vy += (dy / dist) * f
        }

        // Empurrão para fora da zona de exclusão
        if (inExclusionZone(p.x, p.y, cx, cy, p.exW, p.exH)) {
          const ddx = p.x - cx
          const ddy = p.y - cy
          const dd = Math.sqrt(ddx * ddx + ddy * ddy) || 1
          const force = w < 600 ? 2.5 : 0.8
          p.vx += (ddx / dd) * force
          p.vy += (ddy / dd) * force
        }

        p.vx *= 0.93
        p.vy *= 0.93
        p.x += p.vx
        p.y += p.vy
      }

      // ── Conexões (a cada 5 partículas — menos checks) ───
      ctx.lineWidth = 0.35
      const connStep = lowEnd ? 8 : 5
      for (let i = 0; i < particles.length; i += connStep) {
        const a = particles[i]
        for (let j = i + connStep; j < particles.length; j += connStep) {
          const b = particles[j]
          const dx = a.x - b.x
          const dy = a.y - b.y
          if (Math.abs(dx) > CONNECTION_DIST || Math.abs(dy) > CONNECTION_DIST) continue
          const dSq = dx * dx + dy * dy
          if (dSq < CONNECTION_DIST * CONNECTION_DIST) {
            const d = Math.sqrt(dSq)
            ctx.beginPath()
            ctx.moveTo(a.x, a.y)
            ctx.lineTo(b.x, b.y)
            ctx.strokeStyle = COLORS[a.colorIdx]
            ctx.globalAlpha = (1 - d / CONNECTION_DIST) * 0.13
            ctx.stroke()
          }
        }
      }

      // ── Trails (só streamers e bright — pula partículas comuns) ──
      for (const p of particles) {
        if ((!p.isStreamer && !p.isBright) || p.trail.length < 2) continue
        ctx.beginPath()
        ctx.moveTo(p.trail[0].x, p.trail[0].y)
        for (let i = 1; i < p.trail.length; i++) ctx.lineTo(p.trail[i].x, p.trail[i].y)
        ctx.strokeStyle = COLORS[p.colorIdx]
        ctx.globalAlpha = p.isStreamer ? 0.25 : 0.18
        ctx.lineWidth = p.size * (p.isStreamer ? 1.2 : 0.5)
        ctx.stroke()
      }

      // ── Partículas (sem shadowBlur — glow via stamp offscreen) ──
      for (let ci = 0; ci < COLORS.length; ci++) {
        const glow = glowCanvases[ci]
        for (const p of particles) {
          if (p.colorIdx !== ci) continue
          const r = p.isBright ? p.size * 2.8 : p.size
          ctx.globalAlpha = p.isBright ? Math.min(p.opacity * 1.7, 1) : p.opacity
          // Stamp glow (substitui shadowBlur caro)
          if (p.isBright || p.isStreamer) {
            const gs = r * 6
            ctx.drawImage(glow, p.x - gs / 2, p.y - gs / 2, gs, gs)
          }
          ctx.beginPath()
          ctx.arc(p.x, p.y, r, 0, Math.PI * 2)
          ctx.fillStyle = COLORS[ci]
          ctx.fill()
        }
      }
      ctx.globalAlpha = 1

      // ── Glow no anel (reforça a coroa de luz) ────────
      const ringR = Math.min(w, h) * 0.28
      const ringGrd = ctx.createRadialGradient(cx, cy, ringR * 0.55, cx, cy, ringR * 1.2)
      ringGrd.addColorStop(0, 'rgba(0, 0, 0, 0)')
      ringGrd.addColorStop(0.4, 'rgba(139, 92, 246, 0.06)')
      ringGrd.addColorStop(0.7, 'rgba(167, 139, 250, 0.04)')
      ringGrd.addColorStop(1, 'rgba(0, 0, 0, 0)')
      ctx.fillStyle = ringGrd
      ctx.fillRect(0, 0, w, h)
    }

    // Debounce resize
    let resizeTimer
    const onResize = () => {
      clearTimeout(resizeTimer)
      resizeTimer = setTimeout(resize, 150)
    }

    window.addEventListener('resize', onResize)
    resize()
    animId = requestAnimationFrame(draw)

    return () => {
      cancelAnimationFrame(animId)
      clearTimeout(resizeTimer)
      window.removeEventListener('mousemove', onMouseMove)
      window.removeEventListener('mouseleave', onMouseLeave)
      window.removeEventListener('touchstart', onTouchStart)
      window.removeEventListener('touchend', onTouchEnd)
      window.removeEventListener('resize', onResize)
    }
  }, [])

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: 'absolute',
        inset: 0,
        width: '100%',
        height: '100%',
        maxWidth: '100vw',
        maxHeight: '100vh',
        zIndex: 0,
        overflow: 'hidden',
      }}
    />
  )
}
