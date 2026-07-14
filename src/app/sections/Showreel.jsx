'use client'

import { useEffect, useRef, useState } from 'react'

export default function Showreel() {
  const videoRef = useRef(null)
  const [inView, setInView] = useState(false)

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        setInView(entry.isIntersecting)
      },
      { threshold: 0.3 }
    )
    if (videoRef.current) {
      observer.observe(videoRef.current)
    }
    return () => observer.disconnect()
  }, [])

  useEffect(() => {
    const video = videoRef.current
    if (!video) return
    if (inView) {
      video.play().catch(() => {})
    } else {
      video.pause()
    }
  }, [inView])

  return (
    <section
      id="showreel"
      style={{
        position: 'relative',
        width: '100%',
        height: '70vh',
        minHeight: '400px',
        overflow: 'hidden',
        background: '#000000',
      }}
    >
      <video
        ref={videoRef}
        autoPlay
        muted
        loop
        playsInline
        src="/showreel.mp4"
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          objectFit: 'cover',
        }}
      />

      {/* Dark overlay for text readability */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          background: 'linear-gradient(to bottom, rgba(0,0,0,0.2), rgba(0,0,0,0.4))',
        }}
      />

      {/* Centered text */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <p
          style={{
            fontFamily: "'Pirata One', 'Playfair Display', cursive",
            fontSize: 'clamp(1.5rem, 4vw, 2.5rem)',
            fontWeight: 400,
            letterSpacing: '0.15em',
            textTransform: 'uppercase',
            color: '#e94480',
            textShadow: '0 0 30px rgba(233, 68, 128, 0.3)',
            opacity: 0.9,
          }}
        >
          The Art of the Sparkle
        </p>
      </div>
    </section>
  )
}
