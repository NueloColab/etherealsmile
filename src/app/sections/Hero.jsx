'use client'

import { useEffect, useRef, useState } from 'react'

export default function Hero() {
  const logoRef = useRef(null)
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    function onScroll() {
      const y = window.scrollY
      setScrolled(y > 50)
      if (logoRef.current) {
        const scale = Math.max(0.4, 1 - y / 1200)
        const translateY = y * 0.15
        logoRef.current.style.transform = `scale(${scale}) translateY(${translateY}px)`
        logoRef.current.style.opacity = Math.max(0, 1 - y / 800)
      }
    }
    window.addEventListener('scroll', onScroll)
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

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
        padding: '6rem 1.5rem 4rem',
        overflow: 'hidden',
      }}
    >
      <div
        ref={logoRef}
        style={{
          maxWidth: '340px',
          width: '100%',
          marginBottom: '2rem',
          transition: 'transform 0.1s linear, opacity 0.1s linear',
          willChange: 'transform, opacity',
        }}
      >
        <img
          src="/brand-card-2.png?v=2"
          alt="Ethereal Smile"
          style={{
            width: '100%',
            height: 'auto',
            borderRadius: '10px',
            display: 'block',
            boxShadow: '0 0 60px rgba(201, 169, 110, 0.15)',
          }}
        />
      </div>

      <h1
        className="animate-fadeInUp"
        style={{
          fontFamily: "'Playfair Display', serif",
          fontSize: 'clamp(1.6rem, 4.5vw, 2.8rem)',
          fontWeight: 500,
          letterSpacing: '0.2em',
          textTransform: 'uppercase',
          textAlign: 'center',
          lineHeight: 1.2,
          color: '#ffffff',
          marginBottom: '0.75rem',
          animationDelay: '0.2s',
          opacity: 0,
        }}
      >
        Ethereal Smile
      </h1>

      <p
        className="animate-fadeInUp"
        style={{
          fontFamily: "'Playfair Display', serif",
          fontStyle: 'italic',
          fontSize: 'clamp(0.8rem, 1.6vw, 1rem)',
          color: '#c9a96e',
          textAlign: 'center',
          letterSpacing: '0.06em',
          marginBottom: '2.5rem',
          animationDelay: '0.4s',
          opacity: 0,
        }}
      >
        Genuine Swarovski & Preciosa Crystal Tooth Gems
      </p>

      <a
        href="#book"
        className="btn btn-primary animate-fadeInUp"
        style={{
          animationDelay: '0.6s',
          opacity: 0,
        }}
      >
        Book Now
      </a>

      <div
        style={{
          position: 'absolute',
          bottom: '2rem',
          left: '50%',
          transform: 'translateX(-50%)',
          opacity: scrolled ? 0 : 0.3,
          transition: 'opacity 0.5s ease',
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
