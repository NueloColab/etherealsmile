'use client'

import { useCmsContent } from '../../lib/useCmsContent'

export default function Hattie() {
  const { content } = useCmsContent('hattie')

  const heading = content?.heading || "Who's Hattie"
  const subtitle = content?.subtitle || 'The face behind the sparkle'
  const bodyText = content?.bodyText || 'Hattie Clifford is the founder and lead artist at Ethereal Smile. With years of experience in dental aesthetics and a passion for unique beauty, Hattie has transformed thousands of smiles across the UK.'
  const portraitImage = content?.portraitImage || '/hattie-portrait.jpg'
  const workingImage = content?.workingImage || '/hattie-working.jpg'

  // Split body text into paragraphs
  const paragraphs = bodyText ? bodyText.split('\n\n').filter(Boolean) : []

  return (
    <section
      id="hattie"
      className="section"
      style={{
        background: 'linear-gradient(to bottom, transparent, rgba(0,0,0,0.6) 10%, rgba(0,0,0,0.6) 90%, transparent)',
        paddingTop: '6rem',
        paddingBottom: '6rem',
      }}
    >
      <div className="section-inner">
        <h2 className="section-title reveal">{heading}</h2>
        <p
          className="section-subtitle reveal reveal-delay-1"
          style={{
            fontFamily: "'Playfair Display', serif",
            fontStyle: 'italic',
            fontSize: 'clamp(0.85rem, 1.5vw, 1.1rem)',
            color: '#e94480',
            letterSpacing: '0.06em',
            textAlign: 'center',
            marginBottom: '2rem',
            opacity: 0.8,
          }}
        >
          {subtitle}
        </p>
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: '1fr 1.5fr',
            gap: '3rem',
            marginTop: '3rem',
            alignItems: 'center',
          }}
        >
          {/* Left: Polaroid stack */}
          <div className="reveal reveal-scale" style={{ position: 'relative', height: 'clamp(350px, 45vw, 520px)' }}>
            {/* Portrait polaroid - slightly rotated left */}
            <div
              style={{
                position: 'absolute',
                top: 0,
                left: '5%',
                width: '55%',
                background: '#fff',
                padding: '8px 8px 32px 8px',
                boxShadow: '0 8px 32px rgba(0,0,0,0.4), 0 2px 8px rgba(0,0,0,0.2)',
                transform: 'rotate(-4deg)',
                transition: 'transform 0.4s ease',
                zIndex: 3,
              }}
            >
              <img
                src={portraitImage}
                alt={heading}
                style={{ width: '100%', aspectRatio: '3/4', objectFit: 'cover', display: 'block', borderRadius: '2px' }}
              />
            </div>
            {/* Working polaroid - slightly rotated right */}
            {workingImage && (
              <div
                style={{
                  position: 'absolute',
                  top: '18%',
                  right: '0',
                  width: '52%',
                  background: '#fff',
                  padding: '8px 8px 32px 8px',
                  boxShadow: '0 8px 32px rgba(0,0,0,0.4), 0 2px 8px rgba(0,0,0,0.2)',
                  transform: 'rotate(3deg)',
                  transition: 'transform 0.4s ease',
                  zIndex: 2,
                }}
              >
                <img
                  src={workingImage}
                  alt={`${heading} at work`}
                  style={{ width: '100%', aspectRatio: '3/4', objectFit: 'cover', display: 'block', borderRadius: '2px' }}
                />
              </div>
            )}
          </div>

          {/* Right: text */}
          <div className="reveal reveal-delay-1" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
            {paragraphs.length > 0 ? (
              paragraphs.map((para, i) => (
                <p
                  key={i}
                  style={{
                    fontFamily: "'Inter', sans-serif",
                    fontSize: '0.95rem',
                    lineHeight: 1.8,
                    color: 'rgba(255,255,255,0.8)',
                    marginBottom: '1.25rem',
                  }}
                >
                  {para}
                </p>
              ))
            ) : (
              <p style={{ fontFamily: "'Inter', sans-serif", fontSize: '0.95rem', lineHeight: 1.8, color: 'rgba(255,255,255,0.8)' }}>
                {bodyText}
              </p>
            )}
          </div>
        </div>

        {/* Mobile responsive */}
        <style>{`
          @media (max-width: 768px) {
            #hattie .section-inner > div:last-of-type:not(.reveal) {
              grid-template-columns: 1fr !important;
            }
            #hattie .section-inner > div[style*="position: relative"] {
              height: 300px !important;
            }
          }
        `}</style>
      </div>
    </section>
  )
}