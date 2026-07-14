'use client'

import { useEffect, useRef, useMemo } from 'react'

export default function Starfield() {
  const canvasRef = useRef(null)
  const animRef = useRef(null)

  const stars = useMemo(() => {
    const arr = []
    // Denser, smaller, sharper stars - like the original holding page
    const count = 200
    for (let i = 0; i < count; i++) {
      arr.push({
        x: Math.random(),
        y: Math.random(),
        size: 0.3 + Math.random() * 1.2,     // smaller: 0.3 to 1.5 px
        opacity: 0.15 + Math.random() * 0.7, // more subtle
        speed: 0.0001 + Math.random() * 0.0003,
        phase: Math.random() * Math.PI * 2,
        isPink: i % 6 === 0,                 // pink stars instead of gold
        twinkleSpeed: 1.5 + Math.random() * 2.5,
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

        const flicker = 0.5 + 0.5 * Math.sin(time * star.twinkleSpeed + star.phase)
        const alpha = star.opacity * flicker

        // Crisp single-pixel or tiny-cross stars, no blur
        const s = star.size
        ctx.globalAlpha = alpha

        if (star.isPink) {
          ctx.fillStyle = '#e94480'
        } else {
          ctx.fillStyle = '#ffffff'
        }

        // Draw a sharp point - tiny filled rect or circle
        if (s < 1) {
          // Single pixel crisp point
          ctx.fillRect(Math.floor(sx), Math.floor(sy), 1, 1)
        } else if (s < 1.8) {
          // Slightly larger but still crisp
          ctx.beginPath()
          ctx.arc(sx, sy, s * 0.4, 0, Math.PI * 2)
          ctx.fill()
        } else {
          // Tiny cross sparkle for the brightest ones
          const half = Math.max(1, s * 0.35)
          ctx.lineWidth = 0.6
          ctx.strokeStyle = star.isPink ? '#e94480' : '#ffffff'
          ctx.beginPath()
          ctx.moveTo(sx - half, sy)
          ctx.lineTo(sx + half, sy)
          ctx.moveTo(sx, sy - half)
          ctx.lineTo(sx, sy + half)
          ctx.stroke()
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
