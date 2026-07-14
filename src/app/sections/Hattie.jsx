'use client'

import { useCmsContent } from '../../lib/useCmsContent'

export default function Hattie() {
  const { content } = useCmsContent('hattie')

  const heading = content?.heading || "Who's Hattie"
  const bodyText = content?.bodyText || 'Hattie Clifford is the founder and lead artist at Ethereal Smile. With years of experience in dental aesthetics and a passion for unique beauty, Hattie has transformed thousands of smiles across the UK.'
  const portraitImage = content?.portraitImage || '/hattie-portrait.jpg'
  const workingImage = content?.workingImage || '/hattie-working.jpg'

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
            <p style={{ fontFamily: "'Inter', sans-serif", fontSize: '0.95rem', lineHeight: 1.8, color: 'rgba(255,255,255,0.8)' }}>
              {bodyText}
            </p>
          </div>
        </div>
      </div>
    </section>
  )
}