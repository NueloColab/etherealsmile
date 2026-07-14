'use client'

import Link from 'next/link'

export default function Footer() {
  return (
    <footer
      style={{
        position: 'relative',
        zIndex: 1,
        borderTop: '1px solid rgba(233, 68, 128, 0.1)',
        padding: '3rem 1.5rem 2rem',
      }}
    >
      <div
        style={{
          maxWidth: '1200px',
          margin: '0 auto',
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
          gap: '2rem',
        }}
      >
        <div>
          <img
            src="/ethereal-logo.png"
            alt="Ethereal Smile"
            style={{
              height: '72px',
              width: 'auto',
              display: 'block',
              marginBottom: '0.5rem',
            }}
          />
          <p
            style={{
              fontFamily: "'Inter', sans-serif",
              fontSize: '0.75rem',
              color: 'rgba(255,255,255,0.4)',
              lineHeight: 1.6,
            }}
          >
            Genuine Swarovski & Preciosa Crystal Tooth Gems
          </p>
        </div>

        <div>
          <p
            style={{
              fontFamily: "'Inter', sans-serif",
              fontSize: '0.65rem',
              letterSpacing: '0.15em',
              textTransform: 'uppercase',
              color: 'rgba(255,255,255,0.5)',
              marginBottom: '0.75rem',
            }}
          >
            Follow
          </p>
          <a
            href="https://www.instagram.com/etherealsmilex"
            target="_blank"
            rel="noopener noreferrer"
            style={{
              display: 'block',
              fontFamily: "'Inter', sans-serif",
              fontSize: '0.75rem',
              color: 'rgba(255,255,255,0.5)',
              textDecoration: 'none',
              marginBottom: '0.4rem',
              transition: 'color 0.3s',
            }}
            onMouseEnter={(e) => (e.target.style.color = '#c9a96e')}
            onMouseLeave={(e) => (e.target.style.color = 'rgba(255,255,255,0.5)')}
          >
            Instagram
          </a>
          <a
            href="https://www.tiktok.com/@etherealsmilex"
            target="_blank"
            rel="noopener noreferrer"
            style={{
              display: 'block',
              fontFamily: "'Inter', sans-serif",
              fontSize: '0.75rem',
              color: 'rgba(255,255,255,0.5)',
              textDecoration: 'none',
              transition: 'color 0.3s',
            }}
            onMouseEnter={(e) => (e.target.style.color = '#c9a96e')}
            onMouseLeave={(e) => (e.target.style.color = 'rgba(255,255,255,0.5)')}
          >
            TikTok
          </a>
        </div>

        <div>
          <p
            style={{
              fontFamily: "'Inter', sans-serif",
              fontSize: '0.65rem',
              letterSpacing: '0.15em',
              textTransform: 'uppercase',
              color: 'rgba(255,255,255,0.5)',
              marginBottom: '0.75rem',
            }}
          >
            Links
          </p>
          <a
            href="mailto:etherealsmilex@gmail.com"
            style={{
              display: 'block',
              fontFamily: "'Inter', sans-serif",
              fontSize: '0.75rem',
              color: 'rgba(255,255,255,0.5)',
              textDecoration: 'none',
              marginBottom: '0.4rem',
              transition: 'color 0.3s',
            }}
            onMouseEnter={(e) => (e.target.style.color = '#c9a96e')}
            onMouseLeave={(e) => (e.target.style.color = 'rgba(255,255,255,0.5)')}
          >
            Email Us
          </a>
          <Link
            href="/admin"
            style={{
              display: 'block',
              fontFamily: "'Inter', sans-serif",
              fontSize: '0.7rem',
              color: 'rgba(255,255,255,0.25)',
              textDecoration: 'none',
              marginTop: '1rem',
              transition: 'color 0.3s',
            }}
            onMouseEnter={(e) => (e.target.style.color = '#c9a96e')}
            onMouseLeave={(e) => (e.target.style.color = 'rgba(255,255,255,0.25)')}
          >
            Admin
          </Link>
        </div>
      </div>

      <div
        style={{
          maxWidth: '1200px',
          margin: '0 auto',
          paddingTop: '2rem',
          marginTop: '2rem',
          borderTop: '1px solid rgba(255,255,255,0.05)',
          textAlign: 'center',
        }}
      >
        <p
          style={{
            fontFamily: "'Inter', sans-serif",
            fontSize: '0.6rem',
            color: 'rgba(255,255,255,0.2)',
            letterSpacing: '0.2em',
            textTransform: 'uppercase',
          }}
        >
          by Hattie Clifford
        </p>
      </div>
    </footer>
  )
}
