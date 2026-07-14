'use client'

export default function Hattie() {
  return (
    <section
      id="hattie"
      className="section"
      style={{
        background: 'rgba(0, 0, 0, 0.6)',
        borderTop: '1px solid rgba(233, 68, 128, 0.08)',
        borderBottom: '1px solid rgba(233, 68, 128, 0.08)',
        paddingTop: '6rem',
        paddingBottom: '6rem',
      }}
    >
      <div className="section-inner">
        <div className="section-divider">
          <span className="section-number">02</span>
        </div>
        <h2 className="section-title">Who&rsquo;s Hattie</h2>
        <p className="section-subtitle">The face behind the sparkle</p>
        <div className="gold-line" />

        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
            gap: '3rem',
            alignItems: 'center',
            marginTop: '3rem',
          }}
        >
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: '1fr 1fr',
              gap: '1rem',
            }}
          >
            <div
              style={{
                borderRadius: '12px',
                overflow: 'hidden',
                border: '1px solid rgba(233, 68, 128, 0.15)',
              }}
            >
              <img
                src="/hattie-portrait.jpg"
                alt="Hattie Clifford"
                style={{
                  width: '100%',
                  height: '100%',
                  objectFit: 'cover',
                  display: 'block',
                }}
              />
            </div>
            <div
              style={{
                borderRadius: '12px',
                overflow: 'hidden',
                border: '1px solid rgba(233, 68, 128, 0.15)',
              }}
            >
              <img
                src="/hattie-working.jpg"
                alt="Hattie at work"
                style={{
                  width: '100%',
                  height: '100%',
                  objectFit: 'cover',
                  display: 'block',
                }}
              />
            </div>
          </div>

          <div
            style={{
              fontFamily: "'Inter', sans-serif",
              fontSize: '0.9rem',
              color: 'rgba(255,255,255,0.75)',
              lineHeight: 1.8,
            }}
          >
            <p style={{ marginBottom: '1.25rem' }}>
              I&rsquo;m Hattie Clifford, the founder and artist behind Ethereal Smile. What started as a fascination with the intersection of beauty and self-expression has grown into a passion for helping people discover a new kind of confidence, one tiny sparkle at a time.
            </p>

            <p style={{ marginBottom: '1.25rem' }}>
              I trained extensively in tooth gem application and oral safety, ensuring every procedure meets the highest hygiene standards. But beyond the technical skill, what matters most to me is the experience: making sure every client feels comfortable, heard, and leaves with a smile that truly feels like their own.
            </p>

            <p style={{ marginBottom: '1.25rem' }}>
              Every crystal I place is chosen for its brilliance and quality. I work exclusively with Swarovski and Preciosa because I believe in using only the best. This isn&rsquo;t just a service; it&rsquo;s a collaboration between us, creating something beautiful together.
            </p>

            <p
              style={{
                fontFamily: "'Playfair Display', serif",
                fontStyle: 'italic',
                color: '#c9a96e',
                fontSize: '1rem',
              }}
            >
              Your smile is the canvas. Let&rsquo;s make it ethereal.
            </p>
          </div>
        </div>
      </div>
    </section>
  )
}
