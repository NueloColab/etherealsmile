'use client'

import Link from 'next/link'
import { useState, useEffect } from 'react'

const navLinks = [
  { label: 'About', href: '#about' },
  { label: 'Who\'s Hattie', href: '#hattie' },
  { label: 'Book', href: '#book' },
  { label: 'Services', href: '#services' },
  { label: 'Gallery', href: '#gallery' },
  { label: 'Journal', href: '#journal' },
  { label: 'Contact', href: '#contact' },
]

export default function Header() {
  const [menuOpen, setMenuOpen] = useState(false)
  const [circleMode, setCircleMode] = useState(false)

  useEffect(() => {
    function onScroll() {
      const y = window.scrollY
      const heroHeight = window.innerHeight * 0.8
      setCircleMode(y > heroHeight)
    }
    window.addEventListener('scroll', onScroll)
    onScroll()
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => {
    if (menuOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = ''
    }
    return () => { document.body.style.overflow = '' }
  }, [menuOpen])

  function handleNavClick(e, href) {
    e.preventDefault()
    setMenuOpen(false)
    const el = document.querySelector(href)
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' })
    }
  }

  return (
    <>
      {/* === FULL HEADER BAR === */}
      <header
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: '100%',
          zIndex: 100,
          transition: 'opacity 0.5s ease, transform 0.5s ease',
          opacity: circleMode ? 0 : 1,
          transform: circleMode ? 'translateY(-20px)' : 'translateY(0)',
          pointerEvents: circleMode ? 'none' : 'auto',
          background: 'rgba(0, 0, 0, 0.6)',
          borderBottom: '1px solid rgba(201, 169, 110, 0.15)',
          backdropFilter: 'blur(12px)',
        }}
      >
        <div
          style={{
            maxWidth: '1400px',
            margin: '0 auto',
            padding: '0 2rem',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            height: '100px',
          }}
        >
          {/* Logo */}
          <Link
            href="/"
            style={{
              display: 'flex',
              alignItems: 'center',
              textDecoration: 'none',
            }}
          >
            <img
              src="/ethereal-logo.png"
              alt="Ethereal Smile"
              style={{
                height: '100px',
                width: 'auto',
                display: 'block',
              }}
            />
          </Link>

          {/* Desktop Nav */}
          <nav
            className="desktop-nav"
            style={{
              display: 'flex',
              gap: '2rem',
              alignItems: 'center',
            }}
          >
            {navLinks.map((link) => (
              <a
                key={link.href}
                href={link.href}
                onClick={(e) => handleNavClick(e, link.href)}
                style={{
                  fontFamily: "'Pirata One', 'Playfair Display', cursive",
                  fontSize: '0.9rem',
                  letterSpacing: '0.12em',
                  textTransform: 'uppercase',
                  color: 'rgba(255,255,255,0.85)',
                  textDecoration: 'none',
                  transition: 'color 0.3s ease',
                  padding: '0.5rem 0',
                }}
                onMouseEnter={(e) => (e.target.style.color = '#e94480')}
                onMouseLeave={(e) => (e.target.style.color = 'rgba(255,255,255,0.85)')}
              >
                {link.label}
              </a>
            ))}
          </nav>

          {/* Mobile hamburger */}
          <button
            className="mobile-menu-btn"
            onClick={() => setMenuOpen(!menuOpen)}
            aria-label="Toggle menu"
            style={{
              background: 'none',
              border: 'none',
              color: '#e94480',
              cursor: 'pointer',
              display: 'none',
              padding: '0.5rem',
            }}
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              {menuOpen ? (
                <>
                  <line x1="18" y1="6" x2="6" y2="18" />
                  <line x1="6" y1="6" x2="18" y2="18" />
                </>
              ) : (
                <>
                  <line x1="3" y1="6" x2="21" y2="6" />
                  <line x1="3" y1="12" x2="21" y2="12" />
                  <line x1="3" y1="18" x2="21" y2="18" />
                </>
              )}
            </svg>
          </button>
        </div>
      </header>

      {/* === PINK PULSATING CIRCLE (scroll mode) === */}
      <button
        onClick={() => setMenuOpen(!menuOpen)}
        aria-label="Open menu"
        style={{
          position: 'fixed',
          top: '1.5rem',
          right: '1.5rem',
          zIndex: 101,
          width: '56px',
          height: '56px',
          borderRadius: '50%',
          background: 'rgba(0, 0, 0, 0.7)',
          border: '2px solid #e94480',
          cursor: 'pointer',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          transition: 'opacity 0.5s ease, transform 0.5s ease, box-shadow 0.3s ease',
          opacity: circleMode ? 1 : 0,
          transform: circleMode ? 'scale(1)' : 'scale(0.6)',
          pointerEvents: circleMode ? 'auto' : 'none',
          boxShadow: '0 0 20px rgba(233, 68, 128, 0.3)',
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.boxShadow = '0 0 30px rgba(233, 68, 128, 0.5)'
          e.currentTarget.style.transform = 'scale(1.05)'
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.boxShadow = '0 0 20px rgba(233, 68, 128, 0.3)'
          e.currentTarget.style.transform = 'scale(1)'
        }}
      >
        {/* Pulsating rings */}
        <span
          style={{
            position: 'absolute',
            inset: '-4px',
            borderRadius: '50%',
            border: '2px solid #e94480',
            animation: 'eth-pulse 2s ease-out infinite',
            opacity: 0.6,
          }}
        />
        <span
          style={{
            position: 'absolute',
            inset: '-8px',
            borderRadius: '50%',
            border: '1px solid #e94480',
            animation: 'eth-pulse 2s ease-out infinite',
            animationDelay: '0.5s',
            opacity: 0.3,
          }}
        />

        {/* Menu icon or close icon */}
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#e94480" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{ position: 'relative', zIndex: 2 }}>
          {menuOpen ? (
            <>
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </>
          ) : (
            <>
              <line x1="3" y1="6" x2="21" y2="6" />
              <line x1="3" y1="12" x2="21" y2="12" />
              <line x1="3" y1="18" x2="21" y2="18" />
            </>
          )}
        </svg>
      </button>

      {/* === FULLSCREEN MENU OVERLAY === */}
      <div
        style={{
          position: 'fixed',
          inset: 0,
          zIndex: 99,
          background: 'linear-gradient(180deg, #e94480 0%, #c73e6e 50%, #a8325c 100%)',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'flex-start',
          gap: '2rem',
          opacity: menuOpen ? 1 : 0,
          visibility: menuOpen ? 'visible' : 'hidden',
          transition: 'opacity 0.6s ease, visibility 0.6s ease',
          padding: '7rem 2rem 4rem',
          overflowY: 'auto',
        }}
      >
        {/* Close button */}
        <button
          onClick={() => setMenuOpen(false)}
          style={{
            position: 'absolute',
            top: '1.5rem',
            right: '1.5rem',
            width: '48px',
            height: '48px',
            borderRadius: '50%',
            background: 'none',
            border: '2px solid #e94480',
            color: '#e94480',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '1.5rem',
          }}
        >
          &times;
        </button>

        {/* Logo in overlay */}
        <img
          src="/ethereal-logo.png"
          alt="Ethereal Smile"
          style={{
            height: '140px',
            width: 'auto',
            marginBottom: '1rem',
            opacity: menuOpen ? 1 : 0,
            transform: menuOpen ? 'translateY(0)' : 'translateY(20px)',
            transition: 'opacity 0.5s ease 0.1s, transform 0.5s ease 0.1s',
          }}
        />

        {/* Nav links */}
        {navLinks.map((link, i) => (
          <a
            key={link.href}
            href={link.href}
            onClick={(e) => handleNavClick(e, link.href)}
            style={{
              display: 'block',
              fontFamily: "'Pirata One', 'Playfair Display', cursive",
              fontSize: 'clamp(1.8rem, 5vw, 2.6rem)',
              letterSpacing: '0.12em',
              textTransform: 'uppercase',
              color: '#ffffff',
              textDecoration: 'none',
              opacity: menuOpen ? 1 : 0,
              transform: menuOpen ? 'translateY(0)' : 'translateY(20px)',
              transition: `opacity 0.5s ease ${0.15 + i * 0.06}s, transform 0.5s ease ${0.15 + i * 0.06}s, color 0.3s ease`,
            }}
            onMouseEnter={(e) => (e.target.style.color = '#e94480')}
            onMouseLeave={(e) => (e.target.style.color = '#ffffff')}
          >
            {link.label}
          </a>
        ))}

        {/* Bottom credit */}
        <div
          style={{
            marginTop: 'auto',
            paddingTop: '1rem',
            textAlign: 'center',
            opacity: menuOpen ? 0.5 : 0,
            transition: 'opacity 0.5s ease 0.5s',
          }}
        >
          <p
            style={{
              fontFamily: "'Inter', sans-serif",
              fontSize: '0.7rem',
              letterSpacing: '0.2em',
              textTransform: 'uppercase',
              color: '#ffffff',
            }}
          >
            Ethereal Smile
          </p>
        </div>
      </div>
    </>
  )
}
