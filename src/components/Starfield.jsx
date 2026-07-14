'use client'

import { useEffect, useRef, useMemo } from 'react'

export default function Starfield() {
  const canvasRef = useRef(null)
  const animRef = useRef(null)

  const stars = useMemo(() => {
    const arr = []
    const count = 350
    for (let i = 0; i < count; i++) {
      arr.push({
        x: Math.random(),
        y: Math.random(),
        size: 0.5 + Math.random() * 2.5,
        baseOpacity: 0.3 + Math.random() * 0.7,
        speed: 0.0001 + Math.random() * 0.0003,
        phase: Math.random() * Math.PI * 2,
        isGold: i % 5 === 0,
        twinkleSpeed: 2 + Math.random() * 4,
        sparkleChance: 0.005 + Math.random() * 0.01,
        sparkleTimer: Math.random() * 100,
        isSparkling: false,
        sparkleDuration: 0,
      })
    }
    return arr
  }, [])

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    let w = 0
    let h = 0
    const dpr = Math.min(window.devicePixelRatio || 1, 2)

    function resize() {
      w = window.innerWidth
      h = window.innerHeight
      canvas.width = w * dpr
      canvas.height = h * dpr
      canvas.style.width = w + 'px'
      canvas.style.height = h + 'px'
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
    }
    resize()
    window.addEventListener('resize', resize)

    let time = 0
    function draw() {
      ctx.clearRect(0, 0, w, h)
      time += 0.016

      for (const star of stars) {
        const sx = star.x * w
        const sy = (star.y * h + time * 2) % h

        // Sparkle logic - occasional bright flash
        star.sparkleTimer += 1
        if (!star.isSparkling && Math.random() < star.sparkleChance) {
          star.isSparkling = true
          star.sparkleDuration = 15 + Math.random() * 25
        }
        if (star.isSparkling) {
          star.sparkleDuration -= 1
          if (star.sparkleDuration <= 0) {
            star.isSparkling = false
          }
        }

        let alpha
        if (star.isSparkling) {
          // Sharp sparkle - goes to full brightness then fades
          const progress = 1 - (star.sparkleDuration / 40)
          alpha = star.baseOpacity * (1.5 + Math.sin(progress * Math.PI) * 0.8)
        } else {
          const flicker = 0.5 + 0.5 * Math.sin(time * star.twinkleSpeed + star.phase)
          alpha = star.baseOpacity * flicker
        }

        alpha = Math.min(1, Math.max(0.1, alpha))

        const s = star.size

        if (star.isGold) {
          ctx.fillStyle = '#c9a96e'
          ctx.strokeStyle = '#c9a96e'
        } else {
          ctx.fillStyle = '#ffffff'
          ctx.strokeStyle = '#ffffff'
        }

        // Glow for larger/brighter stars
        if (s > 1.5 || star.isSparkling) {
          const glowSize = star.isSparkling ? s * 3 : s * 2
          const gradient = ctx.createRadialGradient(sx, sy, 0, sx, sy, glowSize)
          if (star.isGold) {
            gradient.addColorStop(0, `rgba(201, 169, 110, ${alpha * 0.6})`)
            gradient.addColorStop(0.5, `rgba(201, 169, 110, ${alpha * 0.15})`)
            gradient.addColorStop(1, 'rgba(201, 169, 110, 0)')
          } else {
            gradient.addColorStop(0, `rgba(255, 255, 255, ${alpha * 0.5})`)
            gradient.addColorStop(0.5, `rgba(255, 255, 255, ${alpha * 0.1})`)
            gradient.addColorStop(1, 'rgba(255, 255, 255, 0)')
          }
          ctx.globalAlpha = 1
          ctx.fillStyle = gradient
          ctx.beginPath()
          ctx.arc(sx, sy, glowSize, 0, Math.PI * 2)
          ctx.fill()

          if (star.isGold) {
            ctx.fillStyle = '#c9a96e'
            ctx.strokeStyle = '#c9a96e'
          } else {
            ctx.fillStyle = '#ffffff'
            ctx.strokeStyle = '#ffffff'
          }
        }

        ctx.globalAlpha = alpha

        if (s < 1) {
          ctx.fillRect(Math.floor(sx), Math.floor(sy), 1, 1)
        } else if (s < 2) {
          ctx.beginPath()
          ctx.arc(sx, sy, s * 0.4, 0, Math.PI * 2)
          ctx.fill()
        } else {
          // Cross sparkle for bright stars
          const half = Math.max(1, s * 0.5)
          ctx.lineWidth = 0.8
          ctx.beginPath()
          ctx.moveTo(sx - half, sy)
          ctx.lineTo(sx + half, sy)
          ctx.moveTo(sx, sy - half)
          ctx.lineTo(sx, sy + half)
          ctx.stroke()

          // Center dot
          ctx.beginPath()
          ctx.arc(sx, sy, s * 0.2, 0, Math.PI * 2)
          ctx.fill()
        }
      }

      ctx.globalAlpha = 1
      animRef.current = requestAnimationFrame(draw)
    }
    animRef.current = requestAnimationFrame(draw)

    return () => {
      window.removeEventListener('resize', resize)
      if (animRef.current) cancelAnimationFrame(animRef.current)
    }
  }, [stars])

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        zIndex: 0,
        pointerEvents: 'none',
      }}
    />
  )
}
