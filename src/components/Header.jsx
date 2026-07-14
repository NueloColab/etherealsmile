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
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    function onScroll() {
      setScrolled(window.scrollY > 40)
    }
    window.addEventListener('scroll', onScroll)
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

  return (
    <header
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100%',
        zIndex: 100,
        transition: 'background 0.4s ease, border-color 0.4s ease',
        background: scrolled ? 'rgba(0, 0, 0, 0.85)' : 'transparent',
        borderBottom: scrolled ? '1px solid rgba(201, 169, 110, 0.2)' : '1px solid transparent',
        backdropFilter: scrolled ? 'blur(8px)' : 'none',
      }}
    >
      <div
        style={{
          maxWidth: '1200px',
          margin: '0 auto',
          padding: '0 1.5rem',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          height: '64px',
        }}
      >
        <Link
          href="/"
          style={{
            display: 'flex',
            alignItems: 'center',
            textDecoration: 'none',
          }}
        >
          <img
            src="/brand-card-2.png?v=3"
            alt="Ethereal Smile"
            style={{
              height: '44px',
              width: 'auto',
              borderRadius: '6px',
              display: 'block',
            }}
          />
        </Link>

        <nav
          style={{
            display: 'flex',
            gap: '1.5rem',
            alignItems: 'center',
          }}
          className="desktop-nav"
        >
          {navLinks.map((link) => (
            <a
              key={link.href}
              href={link.href}
              style={{
                fontFamily: "'Inter', sans-serif",
                fontSize: '0.7rem',
                letterSpacing: '0.12em',
                textTransform: 'uppercase',
                color: 'rgba(255,255,255,0.8)',
                textDecoration: 'none',
                transition: 'color 0.3s ease',
              }}
              onMouseEnter={(e) => (e.target.style.color = '#c9a96e')}
              onMouseLeave={(e) => (e.target.style.color = 'rgba(255,255,255,0.8)')}
            >
              {link.label}
            </a>
          ))}
        </nav>

        <button
          className="mobile-menu-btn"
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label="Toggle menu"
          style={{
            position: 'relative',
            background: 'none',
            border: 'none',
            color: '#c9a96e',
            cursor: 'pointer',
            width: '44px',
            height: '44px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: 0,
          }}
        >
          {/* Gold pulsating circle */}
          <span
            style={{
              position: 'absolute',
              inset: 0,
              borderRadius: '50%',
              border: '1.5px solid #c9a96e',
              animation: 'menuPulse 2s ease-in-out infinite',
              opacity: 0.6,
            }}
          />
          <span
            style={{
              position: 'absolute',
              inset: 0,
              borderRadius: '50%',
              border: '1.5px solid #c9a96e',
              animation: 'menuPulse 2s ease-in-out infinite',
              animationDelay: '0.6s',
              opacity: 0.3,
            }}
          />

          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#c9a96e" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ position: 'relative', zIndex: 1 }}>
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

      {/* Full-screen dark mobile overlay */}
      <div
        className="mobile-nav"
        style={{
          position: 'fixed',
          inset: 0,
          zIndex: 99,
          background: 'rgba(0, 0, 0, 0.95)',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '2rem',
          opacity: menuOpen ? 1 : 0,
          visibility: menuOpen ? 'visible' : 'hidden',
          transition: 'opacity 0.4s ease, visibility 0.4s ease',
          padding: '6rem 2rem',
        }}
      >
        <div
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '64px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <img
            src="/brand-card-2.png?v=3"
            alt="Ethereal Smile"
            style={{
              height: '40px',
              width: 'auto',
              borderRadius: '4px',
              display: 'block',
            }}
          />
        </div>

        {navLinks.map((link, i) => (
          <a
            key={link.href}
            href={link.href}
            onClick={() => setMenuOpen(false)}
            style={{
              display: 'block',
              fontFamily: "'Playfair Display', serif",
              fontSize: 'clamp(1.6rem, 5vw, 2.4rem)',
              letterSpacing: '0.1em',
              textTransform: 'uppercase',
              color: '#ffffff',
              textDecoration: 'none',
              opacity: menuOpen ? 1 : 0,
              transform: menuOpen ? 'translateY(0)' : 'translateY(12px)',
              transition: `opacity 0.4s ease ${0.1 + i * 0.05}s, transform 0.4s ease ${0.1 + i * 0.05}s`,
            }}
          >
            {link.label}
          </a>
        ))}

        <div
          style={{
            position: 'absolute',
            bottom: '2rem',
            left: 0,
            right: 0,
            textAlign: 'center',
            opacity: menuOpen ? 0.5 : 0,
            transition: 'opacity 0.4s ease 0.4s',
          }}
        >
          <p
            style={{
              fontFamily: "'Inter', sans-serif",
              fontSize: '0.65rem',
              letterSpacing: '0.2em',
              textTransform: 'uppercase',
              color: '#ffffff',
            }}
          >
              Ethereal Smile
          </p>
        </div>
      </div>
    </header>
  )
}
