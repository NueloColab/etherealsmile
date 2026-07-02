'use client'

export default function Home() {
  const stars = Array.from({ length: 50 }, (_, i) => ({
    id: i,
    left: `${Math.random() * 100}%`,
    top: `${Math.random() * 100}%`,
    duration: `${3 + Math.random() * 5}s`,
    delay: `${Math.random() * 6}s`,
    isGold: i % 6 === 0,
  }))

  return (
    <main style={{ height: '100vh', position: 'relative', overflow: 'hidden', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '2rem 1.5rem' }}>
      {/* Starfield */}
      {stars.map((star) => (
        <div
          key={star.id}
          className={`star ${star.isGold ? 'gold' : ''}`}
          style={{ left: star.left, top: star.top, '--duration': star.duration, '--delay': star.delay }}
        />
      ))}

      {/* Hero image */}
      <div style={{ animation: 'float 7s ease-in-out infinite', maxWidth: '260px', width: '100%', marginBottom: '2rem', animationName: 'float, fadeInUp', animationDuration: '7s, 0.8s', animationTimingFunction: 'ease-in-out, ease-out', animationIterationCount: 'infinite, 1', animationDelay: '0s, 0s', animationFillMode: 'none, both' }}>
        <img src="/logo.jpg" alt="Ethereal Smile" style={{ width: '100%', height: 'auto', borderRadius: '10px', display: 'block' }} />
      </div>

      {/* Heading */}
      <h1 style={{
        fontFamily: "'Playfair Display', serif",
        fontSize: 'clamp(1.5rem, 4.5vw, 2.6rem)',
        fontWeight: 500,
        letterSpacing: '0.2em',
        textTransform: 'uppercase',
        textAlign: 'center',
        lineHeight: 1.2,
        color: '#ffffff',
        animation: 'fadeInUp 0.8s ease-out 0.2s both',
        marginBottom: '0.75rem',
      }}>
        Ethereal Smile
      </h1>

      {/* Tagline */}
      <p style={{
        fontFamily: "'Playfair Display', serif",
        fontStyle: 'italic',
        fontSize: 'clamp(0.75rem, 1.6vw, 0.9rem)',
        color: '#c9a96e',
        textAlign: 'center',
        letterSpacing: '0.06em',
        animation: 'fadeInUp 0.8s ease-out 0.35s both',
        marginBottom: '1.5rem',
      }}>
        Genuine Swarovski &amp; Preciosa Crystal Tooth Gems
      </p>

      {/* Coming Soon */}
      <p style={{
        fontFamily: "'Inter', sans-serif",
        fontSize: 'clamp(0.7rem, 1.5vw, 0.85rem)',
        fontWeight: 300,
        letterSpacing: '0.35em',
        textTransform: 'uppercase',
        color: 'rgba(255,255,255,0.7)',
        animation: 'fadeInUp 0.8s ease-out 0.5s both',
        marginBottom: '0.35rem',
      }}>
        Coming Soon
      </p>

      {/* Subtitle */}
      <p style={{
        fontFamily: "'Inter', sans-serif",
        fontSize: '0.7rem',
        color: 'rgba(255,255,255,0.35)',
        letterSpacing: '0.04em',
        animation: 'fadeInUp 0.8s ease-out 0.6s both',
        marginBottom: '1.5rem',
      }}>
        Follow us for upcoming events and bookings
      </p>

      {/* Social icons */}
      <div style={{ display: 'flex', gap: '1.75rem', animation: 'fadeInUp 0.8s ease-out 0.7s both' }}>
        <a href="https://www.instagram.com/etherealsmilex" target="_blank" rel="noopener noreferrer" aria-label="Instagram" className="social-link">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="2" width="20" height="20" rx="5" ry="5" /><circle cx="12" cy="12" r="5" /><circle cx="17.5" cy="6.5" r="1" fill="currentColor" stroke="none" /></svg>
          <span>Instagram</span>
        </a>
        <a href="https://www.tiktok.com/@etherealsmilex" target="_blank" rel="noopener noreferrer" aria-label="TikTok" className="social-link">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 12a4 4 0 104 4V4a5 5 0 004 2" /></svg>
          <span>TikTok</span>
        </a>
        <a href="mailto:etherealsmilex@gmail.com" aria-label="Email" className="social-link">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="4" width="20" height="16" rx="2" /><path d="M22 4L12 13L2 4" /></svg>
          <span>Email</span>
        </a>
      </div>

      {/* Divider */}
      <div style={{ width: '50px', height: '1px', background: 'rgba(255,255,255,0.15)', marginTop: '1.75rem', animation: 'fadeInUp 0.8s ease-out 0.85s both' }} />

      {/* Footer */}
      <p style={{
        fontFamily: "'Inter', sans-serif",
        fontSize: '0.55rem',
        color: 'rgba(255,255,255,0.2)',
        letterSpacing: '0.2em',
        textTransform: 'uppercase',
        marginTop: '0.6rem',
        animation: 'fadeInUp 0.8s ease-out 0.95s both',
      }}>
        by Hattie Clifford
      </p>
    </main>
  )
}