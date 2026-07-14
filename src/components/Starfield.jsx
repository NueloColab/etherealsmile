'use client'

import { useEffect, useRef, useMemo } from 'react'

export default function Starfield() {
  const canvasRef = useRef(null)
  const animRef = useRef(null)

  const stars = useMemo(() => {
    const arr = []
    for (let i = 0; i < 150; i++) {
      arr.push({
        x: Math.random(),
        y: Math.random(),
        size: 0.5 + Math.random() * 2,
        opacity: 0.2 + Math.random() * 0.8,
        speed: 0.0002 + Math.random() * 0.0005,
        phase: Math.random() * Math.PI * 2,
        isGold: i % 7 === 0,
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

    function resize() {
      w = canvas.width = window.innerWidth
      h = canvas.height = window.innerHeight
    }
    resize()
    window.addEventListener('resize', resize)

    let time = 0
    function draw() {
      ctx.clearRect(0, 0, w, h)
      time += 0.016

      for (const star of stars) {
        const sx = star.x * w
        const sy = (star.y * h + time * 3) % h

        const flicker = 0.5 + 0.5 * Math.sin(time * 2 + star.phase)
        const alpha = star.opacity * flicker

        const gradient = ctx.createRadialGradient(sx, sy, 0, sx, sy, star.size * 2)
        if (star.isGold) {
          gradient.addColorStop(0, `rgba(201, 169, 110, ${alpha})`)
          gradient.addColorStop(1, `rgba(201, 169, 110, 0)`)
        } else {
          gradient.addColorStop(0, `rgba(255, 255, 255, ${alpha})`)
          gradient.addColorStop(1, `rgba(255, 255, 255, 0)`)
        }

        ctx.beginPath()
        ctx.arc(sx, sy, star.size * 2, 0, Math.PI * 2)
        ctx.fillStyle = gradient
        ctx.fill()
      }

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
