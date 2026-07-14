'use client'

import { useEffect, useState } from 'react'

export default function Hero() {
  const [scrolled, setScrolled] = useState(false)
  const [scrollY, setScrollY] = useState(0)

  useEffect(() => {
    function onScroll() {
      const y = window.scrollY
      setScrollY(y)
      setScrolled(y > 50)
    }
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  // Smooth CSS-driven values
  const logoScale = Math.max(0.5, 1 - scrollY / 2500)
  const logoTranslate = scrollY * 0.08
  const logoOpacity = Math.max(0, 1 - scrollY / 1400)

  return (
    <section
      id="hero"
      style={{
        position: 'relative',
        zIndex: 1,
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '6rem 1.5rem 3rem',
        overflow: 'hidden',
      }}
    >
      {/* Logo card — smooth CSS transform */}
      <div
        style={{
          maxWidth: '540px',
          width: '90%',
          marginBottom: '2rem',
          transition: 'transform 0.6s cubic-bezier(0.16, 1, 0.3, 1), opacity 0.6s cubic-bezier(0.16, 1, 0.3, 1)',
          willChange: 'transform, opacity',
          transform: `scale(${logoScale}) translateY(${logoTranslate}px)`,
          opacity: logoOpacity,
        }}
      >
        <img
          src="/brand-card-2.png?v=4"
          alt="Ethereal Smile"
          style={{
            width: '100%',
            height: 'auto',
            borderRadius: '14px',
            display: 'block',
            boxShadow: '0 0 60px rgba(201, 169, 110, 0.15)',
            outline: '3px solid #000000',
            outlineOffset: '-1px',
          }}
        />
      </div>

      {/* Gothic pink title */}
      <h1
        className="animate-fadeInUp"
        style={{
          fontFamily: "'Pirata One', 'Playfair Display', cursive",
          fontSize: 'clamp(2rem, 6vw, 4rem)',
          fontWeight: 400,
          letterSpacing: '0.15em',
          textTransform: 'uppercase',
          textAlign: 'center',
          lineHeight: 1.1,
          color: '#e94480',
          marginBottom: '2.5rem',
          animationDelay: '0.2s',
          opacity: 0,
          textShadow: '0 0 40px rgba(233, 68, 128, 0.3)',
        }}
      >
        Ethereal Smile
      </h1>

      {/* Semi-transparent pill button — bigger, lower */}
      <a
        href="#book"
        className="animate-fadeInUp"
        style={{
          display: 'inline-flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '0.5rem',
          padding: '1rem 3rem',
          fontFamily: "'Inter', sans-serif",
          fontSize: '0.85rem',
          fontWeight: 500,
          letterSpacing: '0.2em',
          textTransform: 'uppercase',
          textDecoration: 'none',
          borderRadius: '50px',
          cursor: 'pointer',
          transition: 'all 0.3s ease',
          background: 'rgba(233, 68, 128, 0.15)',
          color: '#e94480',
          border: '1px solid rgba(233, 68, 128, 0.4)',
          backdropFilter: 'blur(8px)',
          animationDelay: '0.4s',
          opacity: 0,
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.background = 'rgba(233, 68, 128, 0.25)'
          e.currentTarget.style.borderColor = '#e94480'
          e.currentTarget.style.boxShadow = '0 0 30px rgba(233, 68, 128, 0.2)'
          e.currentTarget.style.transform = 'translateY(-2px)'
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.background = 'rgba(233, 68, 128, 0.15)'
          e.currentTarget.style.borderColor = 'rgba(233, 68, 128, 0.4)'
          e.currentTarget.style.boxShadow = 'none'
          e.currentTarget.style.transform = 'translateY(0)'
        }}
      >
        Book Now
      </a>

      {/* Scroll indicator */}
      <div
        style={{
          position: 'absolute',
          bottom: '2rem',
          left: '50%',
          transform: 'translateX(-50%)',
          opacity: scrolled ? 0 : 0.3,
          transition: 'opacity 0.5s ease',
          color: '#e94480',
        }}
      >
        <svg width="20" height="30" viewBox="0 0 20 30" fill="none" stroke="currentColor" strokeWidth="1.5">
          <rect x="1" y="1" width="18" height="28" rx="9" />
          <circle cx="10" cy="8" r="2" fill="currentColor" stroke="none">
            <animate attributeName="cy" values="8;18;8" dur="2s" repeatCount="indefinite" />
          </circle>
        </svg>
      </div>
    </section>
  )
}
