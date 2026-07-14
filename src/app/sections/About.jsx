'use client'

export default function About() {
  return (
    <section
      id="about"
      className="section"
      style={{
        background: 'linear-gradient(to bottom, transparent, rgba(0,0,0,0.6) 20%, rgba(0,0,0,0.6) 80%, transparent)',
        paddingTop: '6rem',
        paddingBottom: '6rem',
      }}
    >
      <div className="section-inner">
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: '1fr 1fr',
            gap: '3rem',
            alignItems: 'center',
            marginTop: '2rem',
          }}
        >
          {/* Left — Text */}
          <div
            style={{
              fontFamily: "'Inter', sans-serif",
              fontSize: '0.9rem',
              color: 'rgba(255,255,255,0.75)',
              lineHeight: 1.8,
            }}
          >
            <h2
              style={{
                fontFamily: "'Pirata One', 'Playfair Display', cursive",
                fontSize: 'clamp(2rem, 5vw, 3.2rem)',
                fontWeight: 400,
                letterSpacing: '0.1em',
                textTransform: 'uppercase',
                color: '#e94480',
                marginBottom: '0.5rem',
                lineHeight: 1.1,
                textShadow: '0 0 30px rgba(233, 68, 128, 0.25)',
              }}
            >
              About Ethereal Smile
            </h2>
            <p
              style={{
                fontFamily: "'Playfair Display', serif",
                fontStyle: 'italic',
                fontSize: 'clamp(0.85rem, 1.5vw, 1.1rem)',
                color: '#e94480',
                letterSpacing: '0.06em',
                marginBottom: '2rem',
                opacity: 0.8,
              }}
            >
              Luxury crystal tooth gems, applied with precision
            </p>

            <p style={{ marginBottom: '1.25rem' }}>
              Tooth gems are small, dazzling crystals bonded to the surface of your teeth using a safe, dental-grade adhesive. They add a subtle sparkle to your smile, turning every conversation into a moment of quiet luxury. No drilling, no damage, just pure brilliance.
            </p>
            <p style={{ marginBottom: '1.25rem' }}>
              We use only genuine Swarovski and Preciosa crystals, the world's finest. Each gem is hand-selected for its cut, clarity, and fire. Whether you choose a single subtle stone or a constellation of sparkles, you're wearing the same quality trusted by luxury jewellers worldwide.
            </p>
            <p style={{ marginBottom: '1.25rem' }}>
              Every appointment is private, relaxed, and tailored to you. We consult on placement and style, apply your gem with meticulous care, and send you home with aftercare guidance.
            </p>
            <p
              style={{
                fontFamily: "'Playfair Display', serif",
                fontStyle: 'italic',
                color: '#e94480',
                fontSize: '1rem',
                opacity: 0.9,
              }}
            >
              The result is a smile that feels uniquely yours, elevated by a touch of celestial light.
            </p>
          </div>

          {/* Right — Image */}
          <div
            style={{
              borderRadius: '16px',
              overflow: 'hidden',
              border: '1px solid rgba(233, 68, 128, 0.2)',
              boxShadow: '0 0 40px rgba(233, 68, 128, 0.1)',
            }}
          >
            <img
              src="/hattie-portrait.jpg"
              alt="Hattie Clifford - Ethereal Smile"
              style={{
                width: '100%',
                height: 'auto',
                display: 'block',
              }}
            />
          </div>
        </div>
      </div>
    </section>
  )
}
