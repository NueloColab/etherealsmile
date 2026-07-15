'use client'

import { useEffect, useRef, useState } from 'react'
import { useCmsContent } from '../../lib/useCmsContent'

export default function Showreel() {
  const videoRef = useRef(null)
  const sectionRef = useRef(null)
  const [inView, setInView] = useState(false)

  const { content } = useCmsContent('showreel')

  const type = content?.type || 'video'
  const videoUrl = content?.videoUrl || ''
  const fallbackImage = content?.fallbackImage || '/hattie-working.jpg'
  const overlayText = content?.overlayText || 'The Art of the Sparkle'

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        setInView(entry.isIntersecting)
      },
      { threshold: 0.2 }
    )
    if (sectionRef.current) {
      observer.observe(sectionRef.current)
    }
    return () => observer.disconnect()
  }, [])

  useEffect(() => {
    const video = videoRef.current
    if (!video || !inView || type !== 'video' || !videoUrl) return
    video.play().catch(() => {})
  }, [inView, type, videoUrl])

  return (
    <section
      ref={sectionRef}
      id="showreel"
      style={{
        position: 'relative',
        width: '100%',
        height: '70vh',
        minHeight: '400px',
        overflow: 'hidden',
        background: '#0a0a0a',
      }}
    >
      {/* Video mode */}
      {type === 'video' && videoUrl && (
        <video
          ref={videoRef}
          muted
          loop
          playsInline
          preload="auto"
          src={videoUrl}
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            objectFit: 'cover',
          }}
        />
      )}

      {/* Image mode */}
      {type === 'image' && (
        <img
          src={fallbackImage}
          alt={overlayText}
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            objectFit: 'cover',
          }}
        />
      )}

      {/* Light overlay */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          background: 'linear-gradient(to bottom, rgba(0,0,0,0.25), rgba(0,0,0,0.45))',
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
          className="reveal"
          style={{
            fontFamily: "'Pirata One', 'Playfair Display', cursive",
            fontSize: 'clamp(1.5rem, 4vw, 2.5rem)',
            fontWeight: 400,
            letterSpacing: '0.15em',
            textTransform: 'uppercase',
            color: '#e94480',
            textShadow: '0 0 30px rgba(233, 68, 128, 0.4), 0 2px 10px rgba(0,0,0,0.5)',
            opacity: 0.95,
          }}
        >
          {overlayText}
        </p>
      </div>
    </section>
  )
}
