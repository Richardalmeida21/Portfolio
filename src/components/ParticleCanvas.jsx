import { useEffect, useRef } from 'react'

const COLORS = ['#8B5CF6', '#A78BFA', '#C084FC', '#D946EF', '#EC4899', '#F472B6']
const REPEL_RADIUS = 140
const REPEL_STRENGTH = 7
const CONNECTION_DIST = 55
const TRAIL_LENGTH = 7

// Zona de exclusão elíptica (área atrás do texto)
function inExclusionZone(x, y, cx, cy, exW, exH) {
  const dx = (x - cx) / exW
  const dy = (y - cy) / exH
  return dx * dx + dy * dy < 1
}

export default function ParticleCanvas({ contentCenterY }) {
  const canvasRef = useRef(null)
  const contentCenterRef = useRef(null)

  useEffect(() => {
    if (contentCenterY) contentCenterRef.current = contentCenterY
  }, [contentCenterY])

  useEffect(() => {
    const canvas = canvasRef.current
    const ctx = canvas.getContext('2d')
    let animId
    const mouse = { x: -9999, y: -9999 }

    const onMouseMove = (e) => { mouse.x = e.clientX; mouse.y = e.clientY }
    const onMouseLeave = () => { mouse.x = -9999; mouse.y = -9999 }
    window.addEventListener('mousemove', onMouseMove)
    window.addEventListener('mouseleave', onMouseLeave)

    let particles = []
    let lastCy = null

    function initParticles() {
      particles = []
      const cx = canvas.width / 2
      const isMobile = canvas.width < 600
      // Usa o centro medido do bloco de texto se disponível, senão fallback
      const cy = contentCenterRef.current ?? canvas.height / 2 + (isMobile ? 38 : 28)
      const isTablet = canvas.width < 1024

      // Partículas: menos em mobile para performance
      const count = isMobile ? 800 : isTablet ? 1200 : 1800

      // Zona de exclusão adaptada ao tamanho da tela
      const exW = isMobile
        ? canvas.width * 0.44          // cobre a largura do texto
        : Math.min(320, canvas.width * 0.3)
      const exH = isMobile
        ? canvas.height * 0.26         // cobre todo o bloco + margem para descendentes
        : Math.min(175, canvas.height * 0.2)

      // Mobile: órbita circular (texto é largo, sem distorção elíptica horizontal)
      // Desktop/tablet: órbita elíptica mais larga
      const xScale = isMobile ? 1.0 : isTablet ? 1.2 : 1.35
      const yScale = isMobile ? 1.0 : isTablet ? 0.8 : 0.78

      // Raio seguro que não ultrapassa a tela
      const safeMax = Math.min(cx, cy) * 0.97
      // innerR: logo após a borda da ellipse de exclusão (usa o maior eixo)
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

        // Clamp dentro da tela com margem
        px = Math.max(4, Math.min(canvas.width - 4, px))
        py = Math.max(4, Math.min(canvas.height - 4, py))

        // Empurrar para fora da zona de exclusão se necessário
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

    function resize() {
      canvas.width = window.innerWidth
      canvas.height = window.innerHeight
      initParticles()
    }

    function draw() {
      ctx.clearRect(0, 0, canvas.width, canvas.height)
      const cx = canvas.width / 2
      const isMobile = canvas.width < 600
      const cy = contentCenterRef.current ?? canvas.height / 2 + (isMobile ? 38 : 28)

      // Se centro mudou significativamente, reinicializa partículas para nova órbita
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
        const dist = Math.sqrt(dx * dx + dy * dy)
        if (dist < REPEL_RADIUS && dist > 0) {
          const f = Math.pow(1 - dist / REPEL_RADIUS, 2) * REPEL_STRENGTH
          p.vx += (dx / dist) * f
          p.vy += (dy / dist) * f
        }

        // Empurrão para fora da zona de exclusão (mais forte em mobile)
        if (inExclusionZone(p.x, p.y, cx, cy, p.exW, p.exH)) {
          const ddx = p.x - cx
          const ddy = p.y - cy
          const dd = Math.sqrt(ddx * ddx + ddy * ddy) || 1
          const force = canvas.width < 600 ? 2.5 : 0.8
          p.vx += (ddx / dd) * force
          p.vy += (ddy / dd) * force
        }

        p.vx *= 0.93
        p.vy *= 0.93
        p.x += p.vx
        p.y += p.vy
      }

      // ── Conexões (a cada 3 partículas) ───────────────
      ctx.lineWidth = 0.35
      for (let i = 0; i < particles.length; i += 3) {
        const a = particles[i]
        for (let j = i + 3; j < particles.length; j += 3) {
          const b = particles[j]
          const dx = a.x - b.x
          const dy = a.y - b.y
          if (Math.abs(dx) > CONNECTION_DIST || Math.abs(dy) > CONNECTION_DIST) continue
          const d = Math.sqrt(dx * dx + dy * dy)
          if (d < CONNECTION_DIST) {
            ctx.beginPath()
            ctx.moveTo(a.x, a.y)
            ctx.lineTo(b.x, b.y)
            ctx.strokeStyle = COLORS[a.colorIdx]
            ctx.globalAlpha = (1 - d / CONNECTION_DIST) * 0.13
            ctx.stroke()
          }
        }
      }

      // ── Trails ───────────────────────────────────────
      for (const p of particles) {
        if (p.trail.length < 2) continue
        ctx.beginPath()
        ctx.moveTo(p.trail[0].x, p.trail[0].y)
        for (let i = 1; i < p.trail.length; i++) ctx.lineTo(p.trail[i].x, p.trail[i].y)
        ctx.strokeStyle = COLORS[p.colorIdx]
        ctx.globalAlpha = p.isStreamer ? 0.25 : p.isBright ? 0.18 : 0.05
        ctx.lineWidth = p.size * (p.isStreamer ? 1.2 : 0.5)
        ctx.stroke()
      }

      // ── Partículas (agrupadas por cor para batch shadow) ──
      for (let ci = 0; ci < COLORS.length; ci++) {
        ctx.shadowBlur = 7
        ctx.shadowColor = COLORS[ci]
        for (const p of particles) {
          if (p.colorIdx !== ci) continue
          ctx.beginPath()
          const r = p.isBright ? p.size * 2.8 : p.size
          ctx.arc(p.x, p.y, r, 0, Math.PI * 2)
          ctx.fillStyle = COLORS[ci]
          ctx.globalAlpha = p.isBright ? Math.min(p.opacity * 1.7, 1) : p.opacity
          ctx.fill()
        }
      }
      ctx.shadowBlur = 0
      ctx.globalAlpha = 1

      // ── Glow no anel (reforça a coroa de luz) ────────
      const ringR = Math.min(canvas.width, canvas.height) * 0.28
      const ringGrd = ctx.createRadialGradient(cx, cy, ringR * 0.55, cx, cy, ringR * 1.2)
      ringGrd.addColorStop(0, 'rgba(0, 0, 0, 0)')
      ringGrd.addColorStop(0.4, 'rgba(139, 92, 246, 0.06)')
      ringGrd.addColorStop(0.7, 'rgba(167, 139, 250, 0.04)')
      ringGrd.addColorStop(1, 'rgba(0, 0, 0, 0)')
      ctx.fillStyle = ringGrd
      ctx.fillRect(0, 0, canvas.width, canvas.height)

      animId = requestAnimationFrame(draw)
    }

    window.addEventListener('resize', resize)
    resize()
    draw()

    return () => {
      cancelAnimationFrame(animId)
      window.removeEventListener('mousemove', onMouseMove)
      window.removeEventListener('mouseleave', onMouseLeave)
      window.removeEventListener('resize', resize)
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
