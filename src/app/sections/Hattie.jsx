'use client'

import { useState } from 'react'
import { useCmsContent } from '../../lib/useCmsContent'

export default function Hattie() {
  const { content } = useCmsContent('hattie')
  const [activeImage, setActiveImage] = useState(null)

  const heading = content?.heading || "Who's Hattie"
  const subtitle = content?.subtitle || 'The face behind the sparkle'
  const bodyText = content?.bodyText || 'Hattie Clifford is the founder and lead artist at Ethereal Smile. With years of experience in dental aesthetics and a passion for unique beauty, Hattie has transformed thousands of smiles across the UK.'
  const portraitImage = content?.portraitImage || '/hattie-portrait.jpg'
  const workingImage = content?.workingImage || '/hattie-working.jpg'
  const studioImage = content?.studioImage || null

  // Build images array (up to 3)
  const images = [
    { src: portraitImage, alt: heading, className: 'polaroid-1' },
    workingImage ? { src: workingImage, alt: `${heading} at work`, className: 'polaroid-2' } : null,
    studioImage ? { src: studioImage, alt: `${heading} in studio`, className: 'polaroid-3' } : null,
  ].filter(Boolean)

  // Split body text into paragraphs
  const paragraphs = bodyText ? bodyText.split('\n\n').filter(Boolean) : []

  // Polaroid styles based on position and number of images
  function getPolaroidStyle(index, total, isActive) {
    const base = {
      position: 'absolute',
      background: '#fff',
      padding: '8px 8px 28px 8px',
      boxShadow: isActive
        ? '0 16px 48px rgba(233,68,128,0.3), 0 4px 12px rgba(0,0,0,0.3)'
        : '0 8px 32px rgba(0,0,0,0.4), 0 2px 8px rgba(0,0,0,0.2)',
      transition: 'all 0.4s cubic-bezier(0.16, 1, 0.3, 1)',
      cursor: 'pointer',
    }

    if (total === 1) {
      return { ...base, top: 0, left: '10%', width: '80%', transform: 'rotate(-2deg)', zIndex: isActive ? 10 : 2 }
    }
    if (total === 2) {
      if (index === 0) return { ...base, top: 0, left: '5%', width: '60%', transform: isActive ? 'rotate(0deg) scale(1.03)' : 'rotate(-4deg)', zIndex: isActive ? 10 : 3 }
      return { ...base, top: '20%', right: '0', width: '55%', transform: isActive ? 'rotate(0deg) scale(1.03)' : 'rotate(3deg)', zIndex: isActive ? 10 : 2 }
    }
    // 3 images
    if (index === 0) return { ...base, top: 0, left: '5%', width: '50%', transform: isActive ? 'rotate(0deg) scale(1.04)' : 'rotate(-5deg)', zIndex: isActive ? 10 : 3 }
    if (index === 1) return { ...base, top: '15%', right: '0', width: '48%', transform: isActive ? 'rotate(0deg) scale(1.04)' : 'rotate(3deg)', zIndex: isActive ? 10 : 2 }
    return { ...base, bottom: '5%', left: '15%', width: '46%', transform: isActive ? 'rotate(0deg) scale(1.04)' : 'rotate(-1deg)', zIndex: isActive ? 10 : 1 }
  }

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
          <div className="reveal reveal-scale" style={{ position: 'relative', height: images.length === 1 ? '400px' : 'clamp(350px, 45vw, 520px)' }}>
            {images.map((img, i) => (
              <div
                key={i}
                style={getPolaroidStyle(i, images.length, activeImage === i)}
                onClick={() => setActiveImage(activeImage === i ? null : i)}
                onMouseEnter={() => setActiveImage(i)}
                onMouseLeave={() => setActiveImage(null)}
              >
                <img
                  src={img.src}
                  alt={img.alt}
                  style={{ width: '100%', aspectRatio: '3/4', objectFit: 'cover', display: 'block', borderRadius: '2px' }}
                />
              </div>
            ))}
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
            #hattie .section-inner > div[style*="grid-template-columns"] {
              grid-template-columns: 1fr !important;
            }
            #hattie .section-inner > div[style*="position: relative"] {
              height: 320px !important;
            }
          }
        `}</style>
      </div>
    </section>
  )
}