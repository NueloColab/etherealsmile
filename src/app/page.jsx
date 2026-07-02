'use client'

export default function Home() {
  const stars = Array.from({ length: 40 }, (_, i) => ({
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

      {/* Subtle radial glow */}
      <div style={{
        position: 'absolute',
        top: '35%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        width: '500px',
        height: '500px',
        background: 'radial-gradient(circle, rgba(139,0,70,0.1) 0%, transparent 70%)',
        pointerEvents: 'none',
      }} />

      {/* Content - centred, minimal */}
      <div style={{
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '2rem 1.5rem',
        position: 'relative',
        zIndex: 1,
        gap: '1.5rem',
      }}>
        {/* Mouth logo - the illustrated brand card */}
        <div style={{
          animation: 'float 6s ease-in-out infinite',
          maxWidth: '360px',
          width: '100%',
        }}>
          <img
            src="/brand-card-2.png"
            alt="Ethereal Smile"
            style={{
              width: '100%',
              height: 'auto',
              borderRadius: '12px',
            }}
          />
        </div>

        {/* Brand name */}
        <h1 style={{
          fontFamily: "'Playfair Display', serif",
          fontSize: 'clamp(2rem, 5vw, 3.2rem)',
          fontWeight: 700,
          letterSpacing: '0.15em',
          textTransform: 'uppercase',
          textAlign: 'center',
          lineHeight: 1.1,
          color: '#ffffff',
          animation: 'fadeInUp 1s ease-out 0.3s both',
        }}>
          Ethereal Smile
        </h1>

        {/* Tagline */}
        <p style={{
          fontFamily: "'Playfair Display', serif",
          fontStyle: 'italic',
          fontSize: 'clamp(0.9rem, 2vw, 1.05rem)',
          color: '#c9a96e',
          textAlign: 'center',
          letterSpacing: '0.08em',
          animation: 'fadeInUp 1s ease-out 0.5s both',
        }}>
          Genuine Swarovski &amp; Preciosa Crystal Tooth Gems
        </p>

        {/* Coming Soon */}
        <p style={{
          fontFamily: "'Inter', sans-serif",
          fontSize: 'clamp(0.9rem, 2vw, 1.1rem)',
          fontWeight: 300,
          letterSpacing: '0.35em',
          textTransform: 'uppercase',
          color: 'rgba(255,255,255,0.7)',
          animation: 'fadeInUp 1s ease-out 0.7s both',
          marginTop: '0.5rem',
        }}>
          Coming Soon
        </p>

        {/* Social links */}
        <div style={{
          display: 'flex',
          gap: '2rem',
          animation: 'fadeInUp 1s ease-out 0.9s both',
          marginTop: '0.5rem',
        }}>
          <a
            href="https://www.instagram.com/etherealsmilex"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Instagram"
            className="social-link"
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
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
            <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
              <path d="M19.59 6.69a4.83 4.83 0 01-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 01-2.88 2.5 2.89 2.89 0 01-2.89-2.89 2.89 2.89 0 012.89-2.89c.28 0 .54.04.79.1v-3.5a6.37 6.37 0 00-.79-.05A6.34 6.34 0 003.15 15.2a6.34 6.34 0 006.34 6.34 6.34 6.34 0 006.34-6.34V8.57a8.27 8.27 0 004.76 1.5V6.69h-1z"/>
            </svg>
            <span>TikTok</span>
          </a>

          <a
            href="mailto:etherealsmilex@gmail.com"
            aria-label="Email"
            className="social-link"
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
              <rect x="2" y="4" width="20" height="16" rx="2" />
              <path d="M22 4L12 13L2 4" />
            </svg>
            <span>Email</span>
          </a>
        </div>

        {/* by Hattie Clifford */}
        <p style={{
          fontFamily: "'Inter', sans-serif",
          fontSize: '0.7rem',
          color: 'rgba(255,255,255,0.3)',
          letterSpacing: '0.2em',
          textTransform: 'uppercase',
          animation: 'fadeInUp 1s ease-out 1.1s both',
        }}>
          by Hattie Clifford
        </p>
      </div>
    </main>
  )
}