import { useEffect, useRef, useCallback } from 'react'

/**
 * Aurora – React Bits style
 * Full-canvas aurora borealis animation rendered behind the hero section.
 * Uses layered noise-based gradient bands with smooth time-based animation.
 */

const AURORA_COLORS = [
  { r: 0,   g: 255, b: 200, a: 0.18 }, // cyan-teal
  { r: 0,   g: 180, b: 255, a: 0.14 }, // sky blue
  { r: 50,  g: 120, b: 255, a: 0.12 }, // deep blue
  { r: 0,   g: 255, b: 140, a: 0.10 }, // green aurora
  { r: 120, g: 80,  b: 255, a: 0.08 }, // violet
  { r: 0,   g: 220, b: 180, a: 0.15 }, // teal glow
]

function simplex(x, y, t) {
  return (
    Math.sin(x * 0.003 + t * 0.4) *
    Math.cos(y * 0.004 + t * 0.25) +
    Math.sin(x * 0.006 - t * 0.3) *
    Math.cos(y * 0.003 + t * 0.5) * 0.5 +
    Math.sin(x * 0.002 + y * 0.002 + t * 0.2) * 0.3
  )
}

const Aurora = ({ className = '' }) => {
  const canvasRef = useRef(null)
  const rafRef = useRef(null)
  const timeRef = useRef(0)

  const draw = useCallback((canvas, ctx, t) => {
    const W = canvas.width
    const H = canvas.height

    ctx.clearRect(0, 0, W, H)

    // Night sky base gradient
    const bg = ctx.createLinearGradient(0, 0, 0, H)
    bg.addColorStop(0,   'rgba(4, 8, 28, 1)')
    bg.addColorStop(0.4, 'rgba(8, 15, 40, 1)')
    bg.addColorStop(0.7, 'rgba(11, 19, 43, 1)')
    bg.addColorStop(1,   'rgba(11, 19, 43, 1)')
    ctx.fillStyle = bg
    ctx.fillRect(0, 0, W, H)

    // Stars layer
    const starSeed = 42
    for (let i = 0; i < 220; i++) {
      const sx = ((i * 137.508 + starSeed) % 1) * W
      const sy = ((i * 97.31 + starSeed) % 0.65) * H
      const flicker = 0.3 + 0.7 * Math.abs(Math.sin(t * 1.5 + i * 2.3))
      const sr = 0.4 + (i % 3) * 0.4
      ctx.beginPath()
      ctx.arc(
        Math.abs(Math.sin(i * 0.7137)) * W,
        Math.abs(Math.cos(i * 0.5231)) * H * 0.6,
        sr,
        0, Math.PI * 2
      )
      ctx.fillStyle = `rgba(200, 220, 255, ${flicker * 0.9})`
      ctx.fill()
    }

    // Bright star clusters
    for (let i = 0; i < 12; i++) {
      const sx = Math.abs(Math.sin(i * 1.618)) * W
      const sy = Math.abs(Math.cos(i * 2.718)) * H * 0.5
      const pulse = 0.6 + 0.4 * Math.sin(t * 0.8 + i)
      ctx.beginPath()
      ctx.arc(sx, sy, 1.5 + (i % 2) * 0.5, 0, Math.PI * 2)
      const gstar = ctx.createRadialGradient(sx, sy, 0, sx, sy, 6)
      gstar.addColorStop(0, `rgba(180, 220, 255, ${pulse})`)
      gstar.addColorStop(1, 'rgba(180,220,255,0)')
      ctx.fillStyle = gstar
      ctx.fill()
    }

    // Moon glow
    const moonX = W * 0.82
    const moonY = H * 0.12
    const moonGlow = ctx.createRadialGradient(moonX, moonY, 0, moonX, moonY, 120)
    moonGlow.addColorStop(0,   'rgba(180, 210, 240, 0.25)')
    moonGlow.addColorStop(0.3, 'rgba(91, 192, 190, 0.08)')
    moonGlow.addColorStop(1,   'rgba(0,0,0,0)')
    ctx.fillStyle = moonGlow
    ctx.fillRect(0, 0, W, H)

    // Moon disc
    ctx.beginPath()
    ctx.arc(moonX, moonY, 22, 0, Math.PI * 2)
    const moonDisc = ctx.createRadialGradient(moonX - 4, moonY - 4, 0, moonX, moonY, 22)
    moonDisc.addColorStop(0, 'rgba(200, 225, 255, 0.85)')
    moonDisc.addColorStop(0.5, 'rgba(160, 200, 240, 0.6)')
    moonDisc.addColorStop(1, 'rgba(91, 192, 190, 0.2)')
    ctx.fillStyle = moonDisc
    ctx.fill()

    // ---- AURORA BANDS ----
    ctx.save()

    // Layer each aurora color as a flowing horizontal band
    const numBands = AURORA_COLORS.length
    for (let bi = 0; bi < numBands; bi++) {
      const col = AURORA_COLORS[bi]
      const bandOffset = (bi / numBands) * W * 0.5 - W * 0.1
      const bandY = H * (0.05 + bi * 0.07)
      const bandH = H * (0.12 + bi * 0.03)
      const speed = 0.15 + bi * 0.04
      const xShift = Math.sin(t * speed + bi * 1.2) * W * 0.15

      const segments = 80
      const pts = []
      for (let si = 0; si <= segments; si++) {
        const px = (si / segments) * W
        const noise = simplex(px + xShift + bandOffset, bandY, t + bi * 0.7)
        const py = bandY + noise * bandH * 0.8
        pts.push({ x: px, y: py })
      }

      // Draw aurora band as a filled shape
      ctx.beginPath()
      ctx.moveTo(pts[0].x, 0)

      // Top wavy edge
      ctx.moveTo(pts[0].x, pts[0].y)
      for (let si = 1; si < pts.length; si++) {
        const prev = pts[si - 1]
        const curr = pts[si]
        const cx = (prev.x + curr.x) / 2
        ctx.quadraticCurveTo(prev.x, prev.y, cx, (prev.y + curr.y) / 2)
      }

      // Bottom edge with secondary wave
      for (let si = pts.length - 1; si >= 0; si--) {
        const px2 = (si / segments) * W
        const noise2 = simplex(px2 - xShift * 0.5 + bandOffset, bandY + bandH * 1.2, t * 0.8 + bi * 1.3 + 10)
        const py2 = bandY + bandH * 1.5 + noise2 * bandH * 0.5
        if (si === pts.length - 1) {
          ctx.lineTo(px2, py2)
        } else {
          ctx.lineTo(px2, py2)
        }
      }
      ctx.closePath()

      // Aurora gradient fill - vertical sweep
      const auroraTop = bandY - bandH * 0.3
      const auroraBottom = bandY + bandH * 2.2
      const ag = ctx.createLinearGradient(0, auroraTop, 0, auroraBottom)
      const { r, g, b, a } = col
      const alphaBoost = 0.7 + 0.3 * Math.sin(t * 0.6 + bi * 0.8)
      ag.addColorStop(0,   `rgba(${r},${g},${b},0)`)
      ag.addColorStop(0.2, `rgba(${r},${g},${b},${a * alphaBoost * 1.5})`)
      ag.addColorStop(0.5, `rgba(${r},${g},${b},${a * alphaBoost})`)
      ag.addColorStop(0.8, `rgba(${r},${g},${b},${a * alphaBoost * 0.4})`)
      ag.addColorStop(1,   `rgba(${r},${g},${b},0)`)

      ctx.fillStyle = ag
      ctx.fill()

      // Horizontal shimmer sweep
      const shimmerX = ((t * 30 * (bi % 2 === 0 ? 1 : -1) + bi * 200) % (W + 200)) - 100
      const shimmerGrad = ctx.createLinearGradient(shimmerX - 80, 0, shimmerX + 80, 0)
      shimmerGrad.addColorStop(0,   'rgba(255,255,255,0)')
      shimmerGrad.addColorStop(0.5, `rgba(${r},${g},${b},${a * 0.5 * alphaBoost})`)
      shimmerGrad.addColorStop(1,   'rgba(255,255,255,0)')
      ctx.fillStyle = shimmerGrad
      ctx.fill()
    }

    ctx.restore()

    // Vignette overlay
    const vignette = ctx.createRadialGradient(W / 2, H * 0.3, H * 0.1, W / 2, H * 0.5, H * 0.9)
    vignette.addColorStop(0, 'rgba(0,0,0,0)')
    vignette.addColorStop(0.7, 'rgba(0,0,0,0)')
    vignette.addColorStop(1, 'rgba(4, 8, 28, 0.7)')
    ctx.fillStyle = vignette
    ctx.fillRect(0, 0, W, H)

    // Bottom fade to site background
    const bottomFade = ctx.createLinearGradient(0, H * 0.6, 0, H)
    bottomFade.addColorStop(0, 'rgba(11,19,43,0)')
    bottomFade.addColorStop(1, 'rgba(11,19,43,1)')
    ctx.fillStyle = bottomFade
    ctx.fillRect(0, 0, W, H)
  }, [])

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')

    const resize = () => {
      canvas.width = window.innerWidth
      canvas.height = window.innerHeight
    }
    resize()
    window.addEventListener('resize', resize)

    let last = 0
    const animate = (ts) => {
      const dt = (ts - last) / 1000
      last = ts
      timeRef.current += dt * 0.5
      draw(canvas, ctx, timeRef.current)
      rafRef.current = requestAnimationFrame(animate)
    }
    rafRef.current = requestAnimationFrame(animate)

    return () => {
      cancelAnimationFrame(rafRef.current)
      window.removeEventListener('resize', resize)
    }
  }, [draw])

  return (
    <canvas
      ref={canvasRef}
      className={`absolute inset-0 w-full h-full pointer-events-none ${className}`}
      style={{ zIndex: 0 }}
    />
  )
}

export default Aurora
