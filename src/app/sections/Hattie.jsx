'use client'

import { useState } from 'react'
import { useCmsContent } from '../../lib/useCmsContent'

export default function Hattie() {
  const { content } = useCmsContent('hattie')

  const heading = content?.heading || "Who's Hattie"
  const subtitle = content?.subtitle || 'The face behind the sparkle'
  const bodyText = content?.bodyText || 'Hattie Clifford is the founder and lead artist at Ethereal Smile. With years of experience in dental aesthetics and a passion for unique beauty, Hattie has transformed thousands of smiles across the UK.'
  const portraitImage = content?.portraitImage || '/hattie-portrait.jpg'
  const workingImage = content?.workingImage || '/hattie-working.jpg'
  const studioImage = content?.studioImage || null

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
          <div className="reveal reveal-scale" style={{ position: 'relative', height: 'clamp(380px, 45vw, 540px)' }}>
            {/* Portrait - top left, rotated */}
            <div
              style={{
                position: 'absolute',
                top: 0,
                left: '10%',
                width: '55%',
                background: '#fff',
                padding: '8px 8px 28px 8px',
                boxShadow: '0 8px 32px rgba(0,0,0,0.4), 0 2px 8px rgba(0,0,0,0.2)',
                transform: 'rotate(-4deg)',
                zIndex: 3,
                transition: 'transform 0.4s cubic-bezier(0.16, 1, 0.3, 1), box-shadow 0.4s ease',
              }}
              className="eth-polaroid"
            >
              <img
                src={portraitImage}
                alt={heading}
                style={{ width: '100%', aspectRatio: '3/4', objectFit: 'cover', display: 'block', borderRadius: '2px' }}
              />
            </div>
            {/* Working image - top right, rotated opposite */}
            {workingImage && (
              <div
                style={{
                  position: 'absolute',
                  top: '15%',
                  right: '5%',
                  width: '50%',
                  background: '#fff',
                  padding: '8px 8px 28px 8px',
                  boxShadow: '0 8px 32px rgba(0,0,0,0.4), 0 2px 8px rgba(0,0,0,0.2)',
                  transform: 'rotate(3deg)',
                  zIndex: 2,
                  transition: 'transform 0.4s cubic-bezier(0.16, 1, 0.3, 1), box-shadow 0.4s ease',
                }}
                className="eth-polaroid"
              >
                <img
                  src={workingImage}
                  alt={`${heading} at work`}
                  style={{ width: '100%', aspectRatio: '3/4', objectFit: 'cover', display: 'block', borderRadius: '2px' }}
                />
              </div>
            )}
            {/* Optional 3rd studio image - bottom, slight rotation */}
            {studioImage && (
              <div
                style={{
                  position: 'absolute',
                  bottom: '5%',
                  left: '20%',
                  width: '48%',
                  background: '#fff',
                  padding: '8px 8px 28px 8px',
                  boxShadow: '0 8px 32px rgba(0,0,0,0.4), 0 2px 8px rgba(0,0,0,0.2)',
                  transform: 'rotate(-1deg)',
                  zIndex: 1,
                  transition: 'transform 0.4s cubic-bezier(0.16, 1, 0.3, 1), box-shadow 0.4s ease',
                }}
                className="eth-polaroid"
              >
                <img
                  src={studioImage}
                  alt={`${heading} in studio`}
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

        {/* Hover effect for polaroids */}
        <style>{`
          .eth-polaroid:hover {
            transform: scale(1.03) rotate(0deg) !important;
            z-index: 10 !important;
            box-shadow: 0 12px 40px rgba(233,68,128,0.25), 0 4px 12px rgba(0,0,0,0.3) !important;
          }
          @media (max-width: 768px) {
            #hattie .section-inner > div[style*="grid-template-columns"] {
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