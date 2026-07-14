'use client'

import { useState, useEffect } from 'react'

export default function Gallery() {
  const [items, setItems] = useState([])
  const [selected, setSelected] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch('/api/gallery')
      .then((r) => r.json())
      .then((data) => {
        setItems(data)
        setLoading(false)
      })
      .catch(() => setLoading(false))
  }, [])

  return (
    <section
      id="gallery"
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
          <span className="section-number">05</span>
        </div>
        <h2 className="section-title">Gallery</h2>
        <p className="section-subtitle">See the sparkle for yourself</p>
        <div className="gold-line" />

        {loading ? (
          <p style={{ textAlign: 'center', color: 'rgba(255,255,255,0.4)', marginTop: '3rem' }}>Loading gallery...</p>
        ) : items.length > 0 ? (
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))',
              gap: '1rem',
              marginTop: '3rem',
            }}
          >
            {items.map((item) => (
              <button
                key={item.id}
                onClick={() => setSelected(item)}
                style={{
                  position: 'relative',
                  borderRadius: '10px',
                  overflow: 'hidden',
                  border: '1px solid rgba(255,255,255,0.06)',
                  background: 'rgba(0,0,0,0.5)',
                  cursor: 'pointer',
                  padding: 0,
                  aspectRatio: '1',
                }}
              >
                <img
                  src={item.url}
                  alt={item.caption || 'Gallery image'}
                  style={{
                    width: '100%',
                    height: '100%',
                    objectFit: 'cover',
                    display: 'block',
                    transition: 'transform 0.4s ease',
                  }}
                  onMouseEnter={(e) => (e.target.style.transform = 'scale(1.05)')}
                  onMouseLeave={(e) => (e.target.style.transform = 'scale(1)')}
                />
                {item.caption && (
                  <div
                    style={{
                      position: 'absolute',
                      bottom: 0,
                      left: 0,
                      right: 0,
                      padding: '1rem',
                      background: 'linear-gradient(transparent, rgba(0,0,0,0.8))',
                    }}
                  >
                    <p style={{ fontSize: '0.75rem', color: 'rgba(255,255,255,0.8)' }}>{item.caption}</p>
                  </div>
                )}
              </button>
            ))}
          </div>
        ) : (
          <div
            style={{
              textAlign: 'center',
              marginTop: '3rem',
              padding: '3rem',
              borderRadius: '12px',
              border: '1px solid rgba(255,255,255,0.05)',
              background: 'rgba(255,255,255,0.02)',
            }}
          >
            <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: '0.9rem' }}>Gallery coming soon. Follow us on Instagram for the latest looks.</p>
          </div>
        )}

        {/* Lightbox */}
        {selected && (
          <div
            onClick={() => setSelected(null)}
            style={{
              position: 'fixed',
              inset: 0,
              zIndex: 200,
              background: 'rgba(0, 0, 0, 0.92)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              padding: '2rem',
              cursor: 'zoom-out',
            }}
          >
            <button
              onClick={() => setSelected(null)}
              style={{
                position: 'absolute',
                top: '1.5rem',
                right: '1.5rem',
                background: 'none',
                border: 'none',
                color: 'rgba(255,255,255,0.6)',
                fontSize: '2rem',
                cursor: 'pointer',
              }}
            >
              &times;
            </button>
            <img
              src={selected.url}
              alt={selected.caption || 'Gallery image'}
              style={{
                maxWidth: '90vw',
                maxHeight: '85vh',
                objectFit: 'contain',
                borderRadius: '8px',
                border: '1px solid rgba(233, 68, 128, 0.2)',
              }}
            />
          </div>
        )}
      </div>
    </section>
  )
}
