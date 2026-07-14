'use client'

import Link from 'next/link'

function EmailIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/>
      <polyline points="22,6 12,13 2,6"/>
    </svg>
  )
}

function InstagramIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <rect x="2" y="2" width="20" height="20" rx="5" ry="5"/>
      <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/>
      <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"/>
    </svg>
  )
}

function TikTokIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" stroke="none">
      <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1-.1z"/>
    </svg>
  )
}

export default function Footer() {
  const email = 'etherealsmilex@gmail.com'
  const instagram = '@etherealsmilex'
  const tiktok = '@etherealsmilex'

  const socials = [
    { href: `mailto:${email}`, icon: <EmailIcon />, label: 'Email' },
    { href: `https://instagram.com/${instagram.replace('@', '')}`, icon: <InstagramIcon />, label: 'Instagram' },
    { href: `https://tiktok.com/@${tiktok.replace('@', '')}`, icon: <TikTokIcon />, label: 'TikTok' },
  ]

  return (
    <footer
      style={{
        position: 'relative',
        zIndex: 1,
        background: '#e94480',
        padding: '4rem 1.5rem 2.5rem',
      }}
    >
      {/* Main footer grid */}
      <div
        style={{
          maxWidth: '1000px',
          margin: '0 auto',
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
          gap: '3rem',
          alignItems: 'start',
        }}
      >
        {/* Left: Logo + tagline + Powered by */}
        <div style={{ textAlign: 'center' }}>
          <img
            src="/ethereal-logo-transparent.png"
            alt="Ethereal Smile"
            style={{
              height: '120px',
              width: 'auto',
              display: 'block',
              margin: '0 auto 1rem',
            }}
          />
          <p
            style={{
              fontFamily: "'Inter', sans-serif",
              fontSize: '0.75rem',
              color: 'rgba(255,255,255,0.85)',
              lineHeight: 1.6,
              marginBottom: '1.5rem',
            }}
          >
            Genuine Swarovski &amp; Preciosa Crystal Tooth Gems
          </p>
          <p
            style={{
              fontFamily: "'Inter', sans-serif",
              fontSize: '0.65rem',
              color: 'rgba(255,255,255,0.7)',
              letterSpacing: '0.15em',
              textTransform: 'uppercase',
            }}
          >
            Powered by Nuelo CoLab
          </p>
        </div>

        {/* Right: Social icons + links */}
        <div style={{ textAlign: 'center' }}>
          <p
            style={{
              fontFamily: "'Pirata One', 'Playfair Display', cursive",
              fontSize: '1.1rem',
              color: 'white',
              letterSpacing: '0.1em',
              marginBottom: '1.5rem',
            }}
          >
            Follow Us
          </p>

          {/* Pink icon row */}
          <div
            style={{
              display: 'flex',
              gap: '1rem',
              justifyContent: 'center',
              flexWrap: 'wrap',
              marginBottom: '2rem',
            }}
          >
            {socials.map((social) => (
              <a
                key={social.label}
                href={social.href}
                target={social.href.startsWith('http') ? '_blank' : undefined}
                rel={social.href.startsWith('http') ? 'noopener noreferrer' : undefined}
                aria-label={social.label}
                style={{
                  width: '56px',
                  height: '56px',
                  borderRadius: '14px',
                  border: '1.5px solid rgba(255,255,255,0.4)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: 'white',
                  background: 'rgba(0,0,0,0.1)',
                  transition: 'all 0.35s cubic-bezier(0.16,1,0.3,1)',
                  cursor: 'pointer',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = 'rgba(0,0,0,0.25)'
                  e.currentTarget.style.borderColor = 'rgba(255,255,255,0.8)'
                  e.currentTarget.style.transform = 'translateY(-4px) scale(1.08)'
                  e.currentTarget.style.boxShadow = '0 8px 24px rgba(0,0,0,0.15)'
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = 'rgba(0,0,0,0.1)'
                  e.currentTarget.style.borderColor = 'rgba(255,255,255,0.4)'
                  e.currentTarget.style.transform = 'translateY(0) scale(1)'
                  e.currentTarget.style.boxShadow = 'none'
                }}
              >
                <div style={{ width: '22px', height: '22px' }}>{social.icon}</div>
              </a>
            ))}
          </div>

          {/* Link row */}
          <div
            style={{
              display: 'flex',
              gap: '1.5rem',
              justifyContent: 'center',
              flexWrap: 'wrap',
            }}
          >
            <a
              href="mailto:etherealsmilex@gmail.com"
              style={{
                fontFamily: "'Inter', sans-serif",
                fontSize: '0.7rem',
                color: 'rgba(255,255,255,0.7)',
                textDecoration: 'none',
                letterSpacing: '0.1em',
                textTransform: 'uppercase',
                transition: 'color 0.3s',
              }}
              onMouseEnter={(e) => (e.target.style.color = 'white')}
              onMouseLeave={(e) => (e.target.style.color = 'rgba(255,255,255,0.7)')}
            >
              Email Us
            </a>
            <a
              href="https://www.instagram.com/etherealsmilex"
              target="_blank"
              rel="noopener noreferrer"
              style={{
                fontFamily: "'Inter', sans-serif",
                fontSize: '0.7rem',
                color: 'rgba(255,255,255,0.7)',
                textDecoration: 'none',
                letterSpacing: '0.1em',
                textTransform: 'uppercase',
                transition: 'color 0.3s',
              }}
              onMouseEnter={(e) => (e.target.style.color = 'white')}
              onMouseLeave={(e) => (e.target.style.color = 'rgba(255,255,255,0.7)')}
            >
              Instagram
            </a>
            <a
              href="https://www.tiktok.com/@etherealsmilex"
              target="_blank"
              rel="noopener noreferrer"
              style={{
                fontFamily: "'Inter', sans-serif",
                fontSize: '0.7rem',
                color: 'rgba(255,255,255,0.7)',
                textDecoration: 'none',
                letterSpacing: '0.1em',
                textTransform: 'uppercase',
                transition: 'color 0.3s',
              }}
              onMouseEnter={(e) => (e.target.style.color = 'white')}
              onMouseLeave={(e) => (e.target.style.color = 'rgba(255,255,255,0.7)')}
            >
              TikTok
            </a>
            <Link
              href="/admin"
              style={{
                fontFamily: "'Inter', sans-serif",
                fontSize: '0.65rem',
                color: 'rgba(255,255,255,0.4)',
                textDecoration: 'none',
                letterSpacing: '0.1em',
                textTransform: 'uppercase',
                transition: 'color 0.3s',
              }}
              onMouseEnter={(e) => (e.target.style.color = 'rgba(255,255,255,0.7)')}
              onMouseLeave={(e) => (e.target.style.color = 'rgba(255,255,255,0.4)')}
            >
              Admin
            </Link>
          </div>
        </div>
      </div>

      {/* Bottom bar */}
      <div
        style={{
          maxWidth: '1000px',
          margin: '3rem auto 0',
          paddingTop: '1.5rem',
          borderTop: '1px solid rgba(255,255,255,0.2)',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '0.5rem',
        }}
      >
        <p
          style={{
            fontFamily: "'Inter', sans-serif",
            fontSize: '0.6rem',
            color: 'rgba(255,255,255,0.6)',
            letterSpacing: '0.2em',
            textTransform: 'uppercase',
          }}
        >
          &copy; {new Date().getFullYear()} Ethereal Smile
        </p>
        <p
          style={{
            fontFamily: "'Inter', sans-serif",
            fontSize: '0.6rem',
            color: 'rgba(255,255,255,0.6)',
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
