'use client'

import { useState, useEffect, useRef } from 'react'
import { useCmsContent } from '../../lib/useCmsContent'

export default function Gallery() {
  const { content: cmsContent } = useCmsContent('gallery')
  const [items, setItems] = useState([])
  const [selected, setSelected] = useState(null)
  const [loading, setLoading] = useState(true)
  const scrollRef = useRef(null)

  const heading = cmsContent?.heading || 'Gallery'
  const subtitle = cmsContent?.subtitle || 'Our work speaks for itself'

  useEffect(() => {
    fetch('/api/gallery')
      .then((r) => r.json())
      .then((data) => {
        setItems(data)
        setLoading(false)
      })
      .catch(() => setLoading(false))
  }, [])

  // Keyboard navigation for lightbox
  useEffect(() => {
    function onKey(e) {
      if (!selected) return
      if (e.key === 'Escape') setSelected(null)
      const idx = items.findIndex((i) => i.id === selected.id)
      if (e.key === 'ArrowRight' && idx < items.length - 1) {
        setSelected(items[idx + 1])
      }
      if (e.key === 'ArrowLeft' && idx > 0) {
        setSelected(items[idx - 1])
      }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [selected, items])

  function scroll(direction) {
    if (!scrollRef.current) return
    const scrollAmount = scrollRef.current.offsetWidth * 0.8
    scrollRef.current.scrollBy({
      left: direction === 'left' ? -scrollAmount : scrollAmount,
      behavior: 'smooth',
    })
  }

  if (loading) {
    return (
      <section id="gallery" className="section" style={{ paddingTop: '6rem', paddingBottom: '6rem' }}>
        <div className="section-inner">
          <h2 className="section-title reveal">{heading}</h2>
          <p className="section-subtitle reveal reveal-delay-1">{subtitle}</p>
          <p style={{ textAlign: 'center', color: 'rgba(255,255,255,0.4)', marginTop: '3rem' }}>Loading gallery...</p>
        </div>
      </section>
    )
  }

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
        <h2 className="section-title reveal">{heading}</h2>
        <p className="section-subtitle reveal reveal-delay-1">{subtitle}</p>

        {items.length > 0 ? (
          <div style={{ position: 'relative', marginTop: '3rem' }}>
            {/* Scroll arrows (desktop) */}
            <button
              onClick={() => scroll('left')}
              className="desktop-nav"
              style={{
                position: 'absolute',
                left: '-1rem',
                top: '50%',
                transform: 'translateY(-50%)',
                zIndex: 2,
                width: '44px',
                height: '44px',
                borderRadius: '50%',
                border: '1px solid rgba(233, 68, 128, 0.3)',
                background: 'rgba(0,0,0,0.7)',
                color: '#e94480',
                fontSize: '1.2rem',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                backdropFilter: 'blur(8px)',
              }}
            >
              &larr;
            </button>

            <button
              onClick={() => scroll('right')}
              className="desktop-nav"
              style={{
                position: 'absolute',
                right: '-1rem',
                top: '50%',
                transform: 'translateY(-50%)',
                zIndex: 2,
                width: '44px',
                height: '44px',
                borderRadius: '50%',
                border: '1px solid rgba(233, 68, 128, 0.3)',
                background: 'rgba(0,0,0,0.7)',
                color: '#e94480',
                fontSize: '1.2rem',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                backdropFilter: 'blur(8px)',
              }}
            >
              &rarr;
            </button>

            {/* Swipeable scroll container */}
            <div
              ref={scrollRef}
              style={{
                display: 'flex',
                gap: '1.25rem',
                overflowX: 'auto',
                overflowY: 'hidden',
                scrollSnapType: 'x mandatory',
                scrollBehavior: 'smooth',
                paddingBottom: '1rem',
                WebkitOverflowScrolling: 'touch',
                scrollbarWidth: 'none',
                msOverflowStyle: 'none',
              }}
            >
              <style>{`
                #gallery-scroll::-webkit-scrollbar { display: none; }
              `}</style>
              {items.map((item) => (
                <button
                  key={item.id}
                  id="gallery-scroll"
                  onClick={() => setSelected(item)}
                  style={{
                    flex: '0 0 auto',
                    width: 'clamp(280px, 40vw, 380px)',
                    scrollSnapAlign: 'start',
                    borderRadius: '14px',
                    overflow: 'hidden',
                    border: '1px solid rgba(255,255,255,0.08)',
                    background: 'rgba(0,0,0,0.5)',
                    cursor: 'pointer',
                    padding: 0,
                    position: 'relative',
                  }}
                >
                  <div style={{ aspectRatio: '3/4', overflow: 'hidden' }}>
                    <img
                      src={item.url}
                      alt={item.caption || 'Gallery image'}
                      style={{
                        width: '100%',
                        height: '100%',
                        objectFit: 'cover',
                        display: 'block',
                        transition: 'transform 0.5s cubic-bezier(0.16,1,0.3,1)',
                      }}
                      onMouseEnter={(e) => (e.target.style.transform = 'scale(1.06)')}
                      onMouseLeave={(e) => (e.target.style.transform = 'scale(1)')}
                    />
                  </div>
                  {item.caption && (
                    <div
                      style={{
                        position: 'absolute',
                        bottom: 0,
                        left: 0,
                        right: 0,
                        padding: '1.25rem 1rem 1rem',
                        background: 'linear-gradient(transparent, rgba(0,0,0,0.85))',
                      }}
                    >
                      <p
                        style={{
                          fontFamily: "'Inter', sans-serif",
                          fontSize: '0.8rem',
                          color: 'rgba(255,255,255,0.85)',
                          margin: 0,
                          textAlign: 'left',
                        }}
                      >
                        {item.caption}
                      </p>
                    </div>
                  )}
                </button>
              ))}
            </div>
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
            <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: '0.9rem' }}>
              Gallery coming soon. Follow us on Instagram for the latest looks.
            </p>
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
              onClick={(e) => {
                e.stopPropagation()
                const idx = items.findIndex((i) => i.id === selected.id)
                if (idx > 0) setSelected(items[idx - 1])
              }}
              style={{
                position: 'absolute',
                left: '1.5rem',
                top: '50%',
                transform: 'translateY(-50%)',
                background: 'rgba(0,0,0,0.6)',
                border: '1px solid rgba(233,68,128,0.3)',
                color: '#e94480',
                fontSize: '1.5rem',
                width: '48px',
                height: '48px',
                borderRadius: '50%',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                backdropFilter: 'blur(8px)',
              }}
            >
              &larr;
            </button>

            <button
              onClick={(e) => {
                e.stopPropagation()
                const idx = items.findIndex((i) => i.id === selected.id)
                if (idx < items.length - 1) setSelected(items[idx + 1])
              }}
              style={{
                position: 'absolute',
                right: '1.5rem',
                top: '50%',
                transform: 'translateY(-50%)',
                background: 'rgba(0,0,0,0.6)',
                border: '1px solid rgba(233,68,128,0.3)',
                color: '#e94480',
                fontSize: '1.5rem',
                width: '48px',
                height: '48px',
                borderRadius: '50%',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                backdropFilter: 'blur(8px)',
              }}
            >
              &rarr;
            </button>

            <button
              onClick={() => setSelected(null)}
              style={{
                position: 'absolute',
                top: '1.5rem',
                right: '1.5rem',
                background: 'rgba(0,0,0,0.6)',
                border: '1px solid rgba(233,68,128,0.3)',
                color: '#e94480',
                fontSize: '1.5rem',
                width: '48px',
                height: '48px',
                borderRadius: '50%',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                backdropFilter: 'blur(8px)',
              }}
            >
              &times;
            </button>

            <img
              src={selected.url}
              alt={selected.caption || 'Gallery image'}
              style={{
                maxWidth: '85vw',
                maxHeight: '80vh',
                objectFit: 'contain',
                borderRadius: '12px',
                border: '1px solid rgba(233, 68, 128, 0.25)',
                boxShadow: '0 0 40px rgba(233, 68, 128, 0.15)',
              }}
            />
          </div>
        )}
      </div>
    </section>
  )
}
