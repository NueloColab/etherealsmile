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
            gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
            gap: '2rem',
            marginTop: '3rem',
          }}
        >
          <div className="frame-card reveal reveal-scale">
            <img
              src={portraitImage}
              alt={heading}
              style={{ width: '100%', borderRadius: '8px', marginBottom: '1rem' }}
            />
          </div>
          <div className="frame-card reveal reveal-scale reveal-delay-1" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
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

        {/* Working image */}
        {workingImage && (
          <div className="reveal reveal-delay-2" style={{ marginTop: '2rem', textAlign: 'center' }}>
            <img
              src={workingImage}
              alt={`${heading} at work`}
              style={{ width: '100%', maxWidth: '600px', borderRadius: '8px' }}
            />
          </div>
        )}
      </div>
    </section>
  )
}