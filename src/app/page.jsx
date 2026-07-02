'use client'

export default function Home() {
  const stars = Array.from({ length: 30 }, (_, i) => ({
    id: i,
    left: `${Math.random() * 100}%`,
    top: `${Math.random() * 100}%`,
    duration: `${2 + Math.random() * 4}s`,
    delay: `${Math.random() * 5}s`,
    isGold: i % 5 === 0,
  }))

  return (
    <main style={{ minHeight: '100vh', maxHeight: '100vh', position: 'relative', overflow: 'hidden', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '1rem 1.25rem' }}>
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

      {/* Subtle glow */}
      <div style={{ position: 'absolute', top: '40%', left: '50%', transform: 'translate(-50%, -50%)', width: '400px', height: '400px', background: 'radial-gradient(circle, rgba(139,0,70,0.08) 0%, transparent 70%)', pointerEvents: 'none' }} />

      {/* Logo */}
      <div style={{ animation: 'float 6s ease-in-out infinite', maxWidth: '240px', width: '100%', marginBottom: '0.75rem' }}>
        <img src="/logo.jpg" alt="Ethereal Smile" style={{ width: '100%', height: 'auto', borderRadius: '10px' }} />
      </div>

      {/* Brand name */}
      <h1 style={{ fontFamily: "'Playfair Display', serif", fontSize: 'clamp(1.6rem, 4.5vw, 2.8rem)', fontWeight: 700, letterSpacing: '0.15em', textTransform: 'uppercase', textAlign: 'center', lineHeight: 1.1, color: '#ffffff', animation: 'fadeInUp 0.8s ease-out 0.2s both', margin: 0 }}>
        Ethereal Smile
      </h1>

      {/* Tagline */}
      <p style={{ fontFamily: "'Playfair Display', serif", fontStyle: 'italic', fontSize: 'clamp(0.8rem, 1.8vw, 0.95rem)', color: '#c9a96e', textAlign: 'center', letterSpacing: '0.06em', animation: 'fadeInUp 0.8s ease-out 0.4s both', margin: '0.4rem 0 0' }}>
        Genuine Swarovski &amp; Preciosa Crystal Tooth Gems
      </p>

      {/* Coming Soon */}
      <p style={{ fontFamily: "'Inter', sans-serif", fontSize: 'clamp(0.75rem, 1.8vw, 0.9rem)', fontWeight: 300, letterSpacing: '0.3em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.6)', animation: 'fadeInUp 0.8s ease-out 0.5s both', margin: '0.6rem 0 0' }}>
        Coming Soon
      </p>

      {/* Social links */}
      <div style={{ display: 'flex', gap: '1.5rem', animation: 'fadeInUp 0.8s ease-out 0.6s both', marginTop: '0.6rem' }}>
        <a href="https://www.instagram.com/etherealsmilex" target="_blank" rel="noopener noreferrer" aria-label="Instagram" className="social-link">
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="2" width="20" height="20" rx="5" ry="5" /><circle cx="12" cy="12" r="5" /><circle cx="17.5" cy="6.5" r="1" fill="currentColor" stroke="none" /></svg>
          <span>Instagram</span>
        </a>
        <a href="https://www.tiktok.com/@etherealsmilex" target="_blank" rel="noopener noreferrer" aria-label="TikTok" className="social-link">
          <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor"><path d="M19.59 6.69a4.83 4.83 0 01-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 01-2.88 2.5 2.89 2.89 0 01-2.89-2.89 2.89 2.89 0 012.89-2.89c.28 0 .54.04.79.1v-3.5a6.37 6.37 0 00-.79-.05A6.34 6.34 0 003.15 15.2a6.34 6.34 0 006.34 6.34 6.34 6.34 0 006.34-6.34V8.57a8.27 8.27 0 004.76 1.5V6.69h-1z" /></svg>
          <span>TikTok</span>
        </a>
        <a href="mailto:etherealsmilex@gmail.com" aria-label="Email" className="social-link">
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="4" width="20" height="16" rx="2" /><path d="M22 4L12 13L2 4" /></svg>
          <span>Email</span>
        </a>
      </div>

      {/* by Hattie Clifford */}
      <p style={{ fontFamily: "'Inter', sans-serif", fontSize: '0.6rem', color: 'rgba(255,255,255,0.25)', letterSpacing: '0.2em', textTransform: 'uppercase', animation: 'fadeInUp 0.8s ease-out 0.7s both', marginTop: '0.6rem' }}>
        by Hattie Clifford
      </p>
    </main>
  )
}