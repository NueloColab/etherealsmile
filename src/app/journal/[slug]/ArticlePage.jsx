'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'

export default function ArticlePage({ post, extraImages, relatedPosts }) {
  const [lightbox, setLightbox] = useState(null)
  const [heroLoaded, setHeroLoaded] = useState(false)

  const allImages = [post.imageUrl, ...extraImages].filter(Boolean)

  useEffect(() => {
    function handleKey(e) {
      if (lightbox === null) return
      if (e.key === 'Escape') setLightbox(null)
      if (e.key === 'ArrowRight') setLightbox((prev) => (prev + 1) % allImages.length)
      if (e.key === 'ArrowLeft') setLightbox((prev) => (prev - 1 + allImages.length) % allImages.length)
    }
    window.addEventListener('keydown', handleKey)
    return () => window.removeEventListener('keydown', handleKey)
  }, [lightbox, allImages.length])

  // Split content by newlines for paragraphs
  const paragraphs = post.content ? post.content.split('\n\n').filter(Boolean) : []

  return (
    <article style={{ position: 'relative', zIndex: 1 }}>
      {/* Hero */}
      <div
        style={{
          position: 'relative',
          width: '100%',
          height: '55vh',
          minHeight: '400px',
          overflow: 'hidden',
        }}
      >
        <img
          src={post.imageUrl || '/hero-logo-card.png'}
          alt={post.title}
          onLoad={() => setHeroLoaded(true)}
          style={{
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            display: 'block',
            opacity: heroLoaded ? 1 : 0,
            transition: 'opacity 0.6s ease',
          }}
        />
        {!heroLoaded && (
          <div
            style={{
              position: 'absolute',
              inset: 0,
              background: 'linear-gradient(135deg, rgba(233,68,128,0.05), rgba(201,169,110,0.05))',
            }}
          />
        )}

        {/* Gradient overlay */}
        <div
          style={{
            position: 'absolute',
            inset: 0,
            background: 'linear-gradient(to top, rgba(0,0,0,0.8) 0%, rgba(0,0,0,0.3) 40%, transparent 70%)',
          }}
        />

        {/* Back button */}
        <Link
          href="/#journal"
          style={{
            position: 'absolute',
            top: '1.5rem',
            left: '1.5rem',
            zIndex: 10,
            color: '#e8d4b8',
            fontFamily: "'Inter', sans-serif",
            fontSize: '0.75rem',
            letterSpacing: '0.12em',
            textTransform: 'uppercase',
            textDecoration: 'none',
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem',
            transition: 'color 0.3s ease',
            padding: '0.5rem 1rem',
            background: 'rgba(0,0,0,0.4)',
            borderRadius: '50px',
            border: '1px solid rgba(233,68,128,0.2)',
          }}
          onMouseEnter={(e) => (e.currentTarget.style.color = '#e94480')}
          onMouseLeave={(e) => (e.currentTarget.style.color = '#e8d4b8')}
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M19 12H5M12 19l-7-7 7-7" />
          </svg>
          Back
        </Link>

        {/* Title block */}
        <div
          style={{
            position: 'absolute',
            bottom: 0,
            left: 0,
            padding: '3rem',
            maxWidth: '900px',
            zIndex: 5,
          }}
        >
          <h1
            style={{
              fontFamily: "'Pirata One', 'Playfair Display', cursive",
              fontSize: 'clamp(1.8rem, 5vw, 3.2rem)',
              color: '#e94480',
              lineHeight: 1.15,
              letterSpacing: '0.04em',
              marginBottom: '0.75rem',
              textShadow: '0 0 40px rgba(233,68,128,0.3), 0 2px 10px rgba(0,0,0,0.5)',
            }}
          >
            {post.title}
          </h1>

          <p
            style={{
              fontFamily: "'Inter', sans-serif",
              fontSize: '0.85rem',
              color: 'rgba(255,255,255,0.6)',
              letterSpacing: '0.05em',
              display: 'flex',
              alignItems: 'center',
              gap: '0.75rem',
              flexWrap: 'wrap',
            }}
          >
            {post.publishedAt
              ? new Date(post.publishedAt).toLocaleDateString('en-GB', {
                  day: 'numeric',
                  month: 'long',
                  year: 'numeric',
                })
              : ''}
            <span style={{ color: 'rgba(255,255,255,0.25)' }}>\u2022</span>
            {post.readTime ? `${post.readTime} min read` : '5 min read'}
          </p>
        </div>
      </div>

      {/* Body content */}
      <div
        style={{
          maxWidth: '720px',
          margin: '0 auto',
          padding: '4rem 1.5rem',
          fontFamily: "'Inter', sans-serif",
          fontSize: '1rem',
          lineHeight: 1.7,
          color: 'rgba(255,255,255,0.8)',
        }}
      >
        {paragraphs.map((para, i) => (
          <div key={i}>
            <p style={{ marginBottom: '2rem' }}>{para}</p>

            {/* Inline image after every 2nd paragraph if we have extra images */}
            {extraImages.length > 0 && i === 1 && (
              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: extraImages.length >= 2 ? 'repeat(2, 1fr)' : '1fr',
                  gap: '1rem',
                  margin: '2.5rem 0',
                }}
              >
                {extraImages.slice(0, 2).map((url, idx) => (
                  <div
                    key={idx}
                    onClick={() => setLightbox(idx)}
                    style={{
                      borderRadius: '12px',
                      overflow: 'hidden',
                      border: '1px solid rgba(233,68,128,0.15)',
                      cursor: 'pointer',
                      transition: 'transform 0.4s ease, box-shadow 0.4s ease',
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.transform = 'scale(1.03)'
                      e.currentTarget.style.boxShadow = '0 8px 30px rgba(233,68,128,0.15)'
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.transform = 'scale(1)'
                      e.currentTarget.style.boxShadow = 'none'
                    }}
                  >
                    <img
                      src={url}
                      alt={`${post.title} — image ${idx + 1}`}
                      style={{
                        width: '100%',
                        height: 'auto',
                        display: 'block',
                        aspectRatio: '4/3',
                        objectFit: 'cover',
                      }}
                    />
                  </div>
                ))}
              </div>
            )}

            {/* Video embed after 3rd paragraph if exists */}
            {post.videoUrl && i === 2 && (
              <div
                style={{
                  position: 'relative',
                  paddingBottom: '56.25%',
                  height: 0,
                  overflow: 'hidden',
                  borderRadius: '12px',
                  border: '1px solid rgba(233,68,128,0.2)',
                  margin: '2.5rem 0',
                }}
              >
                <video
                  controls
                  poster={post.videoPoster || post.imageUrl}
                  style={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    width: '100%',
                    height: '100%',
                    borderRadius: '12px',
                  }}
                >
                  <source src={post.videoUrl} type="video/mp4" />
                  Your browser does not support the video tag.
                </video>
              </div>
            )}

            {/* Remaining images after last paragraph */}
            {extraImages.length > 2 && i === paragraphs.length - 1 && (
              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: extraImages.length > 3 ? 'repeat(2, 1fr)' : '1fr',
                  gap: '1rem',
                  margin: '2.5rem 0',
                }}
              >
                {extraImages.slice(2).map((url, idx) => (
                  <div
                    key={idx + 2}
                    onClick={() => setLightbox(idx + 2)}
                    style={{
                      borderRadius: '12px',
                      overflow: 'hidden',
                      border: '1px solid rgba(233,68,128,0.15)',
                      cursor: 'pointer',
                      transition: 'transform 0.4s ease, box-shadow 0.4s ease',
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.transform = 'scale(1.03)'
                      e.currentTarget.style.boxShadow = '0 8px 30px rgba(233,68,128,0.15)'
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.transform = 'scale(1)'
                      e.currentTarget.style.boxShadow = 'none'
                    }}
                  >
                    <img
                      src={url}
                      alt={`${post.title} — image ${idx + 3}`}
                      style={{
                        width: '100%',
                        height: 'auto',
                        display: 'block',
                        aspectRatio: '4/3',
                        objectFit: 'cover',
                      }}
                    />
                  </div>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Related articles */}
      {relatedPosts.length > 0 && (
        <div
          style={{
            maxWidth: '1200px',
            margin: '0 auto',
            padding: '4rem 1.5rem',
            borderTop: '1px solid rgba(233,68,128,0.1)',
          }}
        >
          <h2
            style={{
              fontFamily: "'Pirata One', 'Playfair Display', cursive",
              fontSize: 'clamp(1.5rem, 3vw, 2rem)',
              color: '#e94480',
              textAlign: 'center',
              marginBottom: '2.5rem',
              letterSpacing: '0.05em',
              textShadow: '0 0 30px rgba(233,68,128,0.2)',
            }}
          >
            More from the Journal
          </h2>

          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
              gap: '2rem',
            }}
          >
            {relatedPosts.map((rp) => (
              <Link
                key={rp.id}
                href={`/journal/${rp.slug}`}
                style={{ textDecoration: 'none', display: 'block' }}
              >
                <article
                  style={{
                    display: 'flex',
                    flexDirection: 'column',
                    borderRadius: '12px',
                    overflow: 'hidden',
                    border: '1px solid rgba(255,255,255,0.06)',
                    background: 'rgba(0,0,0,0.4)',
                    transition: 'all 0.4s cubic-bezier(0.16,1,0.3,1)',
                    cursor: 'pointer',
                  }}
                >
                  <div style={{ position: 'relative', overflow: 'hidden', aspectRatio: '16/10' }}>
                    <img
                      src={rp.imageUrl || '/hero-logo-card.png'}
                      alt={rp.title}
                      style={{
                        width: '100%',
                        height: '100%',
                        objectFit: 'cover',
                        display: 'block',
                        transition: 'transform 0.6s cubic-bezier(0.16,1,0.3,1)',
                      }}
                      onMouseEnter={(e) => (e.currentTarget.style.transform = 'scale(1.06)')}
                      onMouseLeave={(e) => (e.currentTarget.style.transform = 'scale(1)')}
                    />
                  </div>
                  <div style={{ padding: '1.25rem' }}>
                    <h3
                      style={{
                        fontFamily: "'Pirata One', 'Playfair Display', cursive",
                        fontSize: '1.1rem',
                        color: '#e94480',
                        marginBottom: '0.5rem',
                        fontWeight: 400,
                        lineHeight: 1.25,
                      }}
                    >
                      {rp.title}
                    </h3>
                    <span
                      style={{
                        fontFamily: "'Inter', sans-serif",
                        fontSize: '0.7rem',
                        color: 'rgba(255,255,255,0.4)',
                        letterSpacing: '0.08em',
                      }}
                    >
                      {rp.publishedAt
                        ? new Date(rp.publishedAt).toLocaleDateString('en-GB', {
                            day: 'numeric',
                            month: 'short',
                            year: 'numeric',
                          })
                        : ''}
                    </span>
                  </div>
                </article>
              </Link>
            ))}
          </div>
        </div>
      )}

      {/* Lightbox */}
      {lightbox !== null && (
        <div
          onClick={() => setLightbox(null)}
          style={{
            position: 'fixed',
            inset: 0,
            zIndex: 9999,
            background: 'rgba(0,0,0,0.92)',
            backdropFilter: 'blur(8px)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '2rem',
            cursor: 'pointer',
          }}
        >
          <button
            onClick={(e) => {
              e.stopPropagation()
              setLightbox((prev) => (prev - 1 + allImages.length) % allImages.length)
            }}
            style={{
              position: 'absolute',
              left: '1.5rem',
              top: '50%',
              transform: 'translateY(-50%)',
              background: 'none',
              border: '1px solid rgba(233,68,128,0.3)',
              color: '#e94480',
              width: '48px',
              height: '48px',
              borderRadius: '50%',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
              <path d="M15 18l-6-6 6-6" />
            </svg>
          </button>

          <img
            src={allImages[lightbox]}
            alt=""
            onClick={(e) => e.stopPropagation()}
            style={{
              maxWidth: '90vw',
              maxHeight: '85vh',
              objectFit: 'contain',
              borderRadius: '8px',
              border: '1px solid rgba(233,68,128,0.2)',
            }}
          />

          <button
            onClick={(e) => {
              e.stopPropagation()
              setLightbox((prev) => (prev + 1) % allImages.length)
            }}
            style={{
              position: 'absolute',
              right: '1.5rem',
              top: '50%',
              transform: 'translateY(-50%)',
              background: 'none',
              border: '1px solid rgba(233,68,128,0.3)',
              color: '#e94480',
              width: '48px',
              height: '48px',
              borderRadius: '50%',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
              <path d="M9 18l6-6-6-6" />
            </svg>
          </button>

          <button
            onClick={() => setLightbox(null)}
            style={{
              position: 'absolute',
              top: '1.5rem',
              right: '1.5rem',
              background: 'none',
              border: '1px solid rgba(233,68,128,0.3)',
              color: '#e94480',
              width: '40px',
              height: '40px',
              borderRadius: '50%',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '1.25rem',
            }}
          >
            \u00d7
          </button>

          <div
            style={{
              position: 'absolute',
              bottom: '1.5rem',
              left: '50%',
              transform: 'translateX(-50%)',
              fontFamily: "'Inter', sans-serif",
              fontSize: '0.75rem',
              color: 'rgba(255,255,255,0.5)',
            }}
          >
            {lightbox + 1} / {allImages.length}
          </div>
        </div>
      )}
    </article>
  )
}
