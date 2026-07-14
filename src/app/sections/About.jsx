'use client'

export default function About() {
  return (
    <section
      id="about"
      className="section"
      style={{
        background: 'linear-gradient(to bottom, transparent, rgba(0,0,0,0.5) 10%, rgba(0,0,0,0.5) 90%, transparent)',
        paddingTop: '6rem',
        paddingBottom: '6rem',
      }}
    >
      <div className="section-inner">
        <div className="section-divider">
          <span className="section-number">01</span>
        </div>
        <h2 className="section-title">About Ethereal Smile</h2>
        <p className="section-subtitle">Luxury crystal tooth gems, applied with precision</p>
        <div className="gold-line" />

        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
            gap: '2rem',
            marginTop: '3rem',
          }}
        >
          <div className="glass-card">
            <h3
              style={{
                fontFamily: "'Playfair Display', serif",
                fontSize: '1.2rem',
                color: '#e94480',
                marginBottom: '1rem',
                fontWeight: 500,
              }}
            >
              What Are Tooth Gems?
            </h3>
            <p
              style={{
                fontFamily: "'Inter', sans-serif",
                fontSize: '0.85rem',
                color: 'rgba(255,255,255,0.7)',
                lineHeight: 1.8,
              }}
            >
              Tooth gems are small, dazzling crystals bonded to the surface of your teeth using a safe, dental-grade adhesive. They add a subtle sparkle to your smile, turning every conversation into a moment of quiet luxury. No drilling, no damage, just pure brilliance.
            </p>
          </div>

          <div className="glass-card">
            <h3
              style={{
                fontFamily: "'Playfair Display', serif",
                fontSize: '1.2rem',
                color: '#e94480',
                marginBottom: '1rem',
                fontWeight: 500,
              }}
            >
              Swarovski & Preciosa
            </h3>
            <p
              style={{
                fontFamily: "'Inter', sans-serif",
                fontSize: '0.85rem',
                color: 'rgba(255,255,255,0.7)',
                lineHeight: 1.8,
              }}
            >
              We use only genuine Swarovski and Preciosa crystals, the world's finest. Each gem is hand-selected for its cut, clarity, and fire. Whether you choose a single subtle stone or a constellation of sparkles, you're wearing the same quality trusted by luxury jewellers worldwide.
            </p>
          </div>

          <div className="glass-card">
            <h3
              style={{
                fontFamily: "'Playfair Display', serif",
                fontSize: '1.2rem',
                color: '#e94480',
                marginBottom: '1rem',
                fontWeight: 500,
              }}
            >
              The Experience
            </h3>
            <p
              style={{
                fontFamily: "'Inter', sans-serif",
                fontSize: '0.85rem',
                color: 'rgba(255,255,255,0.7)',
                lineHeight: 1.8,
              }}
            >
              Every appointment is private, relaxed, and tailored to you. We consult on placement and style, apply your gem with meticulous care, and send you home with aftercare guidance. The result is a smile that feels uniquely yours, elevated by a touch of celestial light.
            </p>
          </div>
        </div>
      </div>
    </section>
  )
}
