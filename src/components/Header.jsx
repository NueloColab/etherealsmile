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
        borderBottom: scrolled ? '1px solid rgba(201, 169, 110, 0.15)' : '1px solid transparent',
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
          height: '56px',
        }}
      >
        <Link
          href="/"
          style={{
            fontFamily: "'Playfair Display', serif",
            fontSize: '0.9rem',
            letterSpacing: '0.15em',
            textTransform: 'uppercase',
            color: '#c9a96e',
            textDecoration: 'none',
            fontWeight: 500,
          }}
        >
          Ethereal Smile
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
            background: 'none',
            border: 'none',
            color: '#c9a96e',
            cursor: 'pointer',
            display: 'none',
          }}
        >
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
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

      {menuOpen && (
        <div
          className="mobile-nav"
          style={{
            background: 'rgba(0, 0, 0, 0.95)',
            borderBottom: '1px solid rgba(201, 169, 110, 0.15)',
            padding: '1rem 1.5rem',
          }}
        >
          {navLinks.map((link) => (
            <a
              key={link.href}
              href={link.href}
              onClick={() => setMenuOpen(false)}
              style={{
                display: 'block',
                padding: '0.75rem 0',
                fontFamily: "'Inter', sans-serif",
                fontSize: '0.8rem',
                letterSpacing: '0.12em',
                textTransform: 'uppercase',
                color: 'rgba(255,255,255,0.85)',
                textDecoration: 'none',
                borderBottom: '1px solid rgba(255,255,255,0.05)',
              }}
            >
              {link.label}
            </a>
          ))}
        </div>
      )}
    </header>
  )
}
