'use client'

export default function Home() {
  const stars = Array.from({ length: 60 }, (_, i) => ({
    id: i,
    left: `${Math.random() * 100}%`,
    top: `${Math.random() * 100}%`,
    duration: `${2 + Math.random() * 4}s`,
    delay: `${Math.random() * 5}s`,
    isGold: i % 5 === 0,
  }))

  return (
    <main style={{ minHeight: '100vh', position: 'relative', overflow: 'hidden' }}>
      {/* Stars background */}
      {stars.map((star) => (
        <div
          key={star.id}
          className={`star ${star.isGold ? 'gold' : ''}`}
          style={{
            left: star.left,
            top: star.top,
            '--duration': star.duration,
            '--delay': star.delay,
          }}
        />
      ))}

      {/* Radial glow */}
      <div style={{
        position: 'absolute',
        top: '30%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        width: '600px',
        height: '600px',
        background: 'radial-gradient(circle, rgba(139,0,70,0.15) 0%, transparent 70%)',
        pointerEvents: 'none',
      }} />

      {/* Content */}
      <div style={{
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '2rem 1.5rem',
        position: 'relative',
        zIndex: 1,
        gap: '2rem',
      }}>
        {/* Logo */}
        <div style={{
          animation: 'float 6s ease-in-out infinite',
          maxWidth: '320px',
          width: '100%',
        }}>
          <img
            src="/logo.jpg"
            alt="Ethereal Smile - Crystal Tooth Gems"
            style={{
              width: '100%',
              height: 'auto',
              borderRadius: '12px',
              filter: 'drop-shadow(0 0 40px rgba(139,0,70,0.3))',
            }}
          />
        </div>

        {/* Brand name */}
        <h1 style={{
          fontFamily: "'Playfair Display', serif",
          fontSize: 'clamp(2rem, 5vw, 3.5rem)',
          fontWeight: 700,
          letterSpacing: '0.15em',
          textTransform: 'uppercase',
          textAlign: 'center',
          lineHeight: 1.1,
          animation: 'fadeInUp 1s ease-out 0.3s both',
        }}>
          Ethereal Smile
        </h1>

        {/* Tagline */}
        <p style={{
          fontFamily: "'Playfair Display', serif",
          fontStyle: 'italic',
          fontSize: 'clamp(0.9rem, 2vw, 1.1rem)',
          color: '#c9a96e',
          textAlign: 'center',
          letterSpacing: '0.1em',
          animation: 'fadeInUp 1s ease-out 0.6s both',
        }}>
          Genuine Swarovski &amp; Preciosa Crystal Tooth Gems
        </p>

        {/* Coming Soon */}
        <div style={{
          animation: 'fadeInUp 1s ease-out 0.9s both',
          textAlign: 'center',
        }}>
          <p style={{
            fontFamily: "'Inter', sans-serif",
            fontSize: 'clamp(1rem, 2.5vw, 1.3rem)',
            fontWeight: 300,
            letterSpacing: '0.3em',
            textTransform: 'uppercase',
            marginBottom: '0.5rem',
          }}>
            Coming Soon
          </p>
          <p style={{
            fontFamily: "'Inter', sans-serif",
            fontSize: '0.85rem',
            color: 'rgba(255,255,255,0.5)',
            letterSpacing: '0.05em',
          }}>
            Follow us for upcoming events and bookings
          </p>
        </div>

        {/* Social links */}
        <div style={{
          display: 'flex',
          gap: '2rem',
          animation: 'fadeInUp 1s ease-out 1.2s both',
        }}>
          <a
            href="https://www.instagram.com/etherealsmilex"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Instagram"
            className="social-link"
          >
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
              <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
              <circle cx="12" cy="12" r="5" />
              <circle cx="17.5" cy="6.5" r="1" fill="currentColor" stroke="none" />
            </svg>
            <span>Instagram</span>
          </a>

          <a
            href="https://www.tiktok.com/@etherealsmilex"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="TikTok"
            className="social-link"
          >
            <svg width="28" height="28" viewBox="0 0 24 24" fill="currentColor">
              <path d="M19.59 6.69a4.83 4.83 0 01-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 01-2.88 2.5 2.89 2.89 0 01-2.89-2.89 2.89 2.89 0 012.89-2.89c.28 0 .54.04.79.1v-3.5a6.37 6.37 0 00-.79-.05A6.34 6.34 0 003.15 15.2a6.34 6.34 0 006.34 6.34 6.34 6.34 0 006.34-6.34V8.57a8.27 8.27 0 004.76 1.5V6.69h-1z"/>
            </svg>
            <span>TikTok</span>
          </a>

          <a
            href="mailto:etherealsmilex@gmail.com"
            aria-label="Email"
            className="social-link"
          >
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
              <rect x="2" y="4" width="20" height="16" rx="2" />
              <path d="M22 4L12 13L2 4" />
            </svg>
            <span>Email</span>
          </a>
        </div>

        {/* Decorative line */}
        <div style={{
          width: '60px',
          height: '1px',
          background: 'linear-gradient(90deg, transparent, #c9a96e, transparent)',
          marginTop: '1rem',
          animation: 'fadeInUp 1s ease-out 1.5s both',
        }} />

        {/* Hattie Clifford */}
        <p style={{
          fontFamily: "'Inter', sans-serif",
          fontSize: '0.7rem',
          color: 'rgba(255,255,255,0.3)',
          letterSpacing: '0.2em',
          textTransform: 'uppercase',
          animation: 'fadeInUp 1s ease-out 1.7s both',
        }}>
          by Hattie Clifford
        </p>
      </div>
    </main>
  )
}
