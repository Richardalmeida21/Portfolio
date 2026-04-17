import { useEffect, useRef } from 'react'

const COLORS = ['#f472b6', '#a78bfa', '#38bdf8', '#ffffff', '#c084fc']
// Pré-calcula cores com alpha para evitar concatenação de string a cada frame
const COLORS_MID = COLORS.map(c => c + '33')
const COLORS_HEAD = COLORS.map(c => c + 'cc')

function rand(a, b) { return a + Math.random() * (b - a) }

export default function ShootingStars() {
  const canvasRef = useRef(null)

  useEffect(() => {
    const canvas = canvasRef.current
    const ctx = canvas.getContext('2d', { alpha: true })

    let animId
    let stars = []
    let lastSpawnTime = 0
    let nextSpawnDelay = rand(800, 2000)
    let lastFrameTime = 0

    function resize() {
      canvas.width  = window.innerWidth
      canvas.height = window.innerHeight
    }

    function spawnStar() {
      const angle = rand(20, 45) * (Math.PI / 180)
      const speed = rand(500, 900)
      const length = rand(100, 220)
      const colorIdx = Math.floor(Math.random() * COLORS.length)
      const fromTop = Math.random() > 0.35
      const x = fromTop ? rand(0, canvas.width * 0.75) : rand(-150, 0)
      const y = fromTop ? rand(-60, -10) : rand(0, canvas.height * 0.45)
      stars.push({ x, y, angle, speed, length, colorIdx, alpha: 0, age: 0 })
    }

    function frame(now) {
      const dt = lastFrameTime ? Math.min((now - lastFrameTime) / 1000, 0.05) : 0.016
      lastFrameTime = now

      // Spawn
      if (now - lastSpawnTime >= nextSpawnDelay) {
        spawnStar()
        if (Math.random() < 0.2) spawnStar()
        lastSpawnTime = now
        nextSpawnDelay = rand(1500, 3500)
      }

      ctx.clearRect(0, 0, canvas.width, canvas.height)

      const alive = []
      for (const s of stars) {
        s.age += dt
        if (s.age < 0.12)       s.alpha = s.age / 0.12
        else if (s.age < 0.55)  s.alpha = 1
        else                    s.alpha = Math.max(0, 1 - (s.age - 0.55) / 0.35)

        if (s.alpha <= 0 && s.age > 0.55) continue

        s.x += Math.cos(s.angle) * s.speed * dt
        s.y += Math.sin(s.angle) * s.speed * dt
        alive.push(s)

        const tailX = s.x - Math.cos(s.angle) * s.length
        const tailY = s.y - Math.sin(s.angle) * s.length

        const grad = ctx.createLinearGradient(tailX, tailY, s.x, s.y)
        grad.addColorStop(0, 'rgba(0,0,0,0)')
        grad.addColorStop(0.5, COLORS_MID[s.colorIdx])
        grad.addColorStop(1,   COLORS_HEAD[s.colorIdx])

        ctx.save()
        ctx.globalAlpha = s.alpha
        ctx.strokeStyle = grad
        ctx.lineWidth = 1.5
        // Sem shadowBlur — usa linha mais grossa como glow fake
        ctx.beginPath()
        ctx.moveTo(tailX, tailY)
        ctx.lineTo(s.x, s.y)
        ctx.stroke()

        // Glow trail sutil (segunda linha mais larga e transparente)
        ctx.globalAlpha = s.alpha * 0.3
        ctx.lineWidth = 4
        ctx.stroke()

        // Cabeça brilhante (sem shadowBlur)
        ctx.globalAlpha = s.alpha
        ctx.beginPath()
        ctx.arc(s.x, s.y, 2, 0, Math.PI * 2)
        ctx.fillStyle = '#fff'
        ctx.fill()
        // Glow da cabeça via círculo maior
        ctx.beginPath()
        ctx.arc(s.x, s.y, 6, 0, Math.PI * 2)
        ctx.fillStyle = COLORS[s.colorIdx] + '30'
        ctx.fill()
        ctx.restore()
      }
      stars = alive

      animId = requestAnimationFrame(frame)
    }

    resize()
    let resizeTimer
    const onResize = () => { clearTimeout(resizeTimer); resizeTimer = setTimeout(resize, 150) }
    window.addEventListener('resize', onResize)
    spawnStar()
    lastSpawnTime = performance.now()
    animId = requestAnimationFrame(frame)

    return () => {
      cancelAnimationFrame(animId)
      clearTimeout(resizeTimer)
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
        pointerEvents: 'none',
        zIndex: 5,
      }}
      aria-hidden="true"
    />
  )
}
