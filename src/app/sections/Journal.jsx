'use client'

import { useState, useEffect, useRef } from 'react'
import Link from 'next/link'
import { useCmsContent } from '../../lib/useCmsContent'

export default function Journal() {
  const { content: cmsContent } = useCmsContent('journal')
  const [posts, setPosts] = useState([])
  const [loading, setLoading] = useState(true)
  const scrollRef = useRef(null)

  const heading = cmsContent?.heading || 'Journal'
  const subtitle = cmsContent?.subtitle || 'Tips, trends, and aftercare wisdom'

  useEffect(() => {
    fetch('/api/blog-posts')
      .then((r) => r.json())
      .then((data) => {
        const published = (data || []).filter((p) => p.status === 'published')
        setPosts(published)
        setLoading(false)
      })
      .catch(() => setLoading(false))
  }, [])

  const scroll = (direction) => {
    if (!scrollRef.current) return
    const cardWidth = scrollRef.current.firstChild?.offsetWidth || 400
    const gap = 32
    scrollRef.current.scrollBy({
      left: direction * (cardWidth + gap),
      behavior: 'smooth',
    })
  }

  return (
    <section
      id="journal"
      className="section"
      style={{
        background: 'linear-gradient(to bottom, transparent, rgba(0,0,0,0.6) 10%, rgba(0,0,0,0.6) 90%, transparent)',
        paddingTop: '6rem',
        paddingBottom: '6rem',
      }}
    >
      <div className="section-inner">
        <h2 className="section-title reveal">{heading}</h2>
        <p className="section-subtitle reveal reveal-delay-1">{subtitle}</p>

        {loading ? (
          <p style={{ textAlign: 'center', color: 'rgba(255,255,255,0.4)', marginTop: '3rem' }}>Loading journal...</p>
        ) : posts.length > 0 ? (
          <div style={{ position: 'relative', marginTop: '3rem' }}>
            {/* Arrow navigation */}
            <button
              onClick={() => scroll(-1)}
              aria-label="Previous"
              style={{
                position: 'absolute',
                left: '-20px',
                top: '50%',
                transform: 'translateY(-50%)',
                zIndex: 10,
                width: '44px',
                height: '44px',
                borderRadius: '50%',
                background: 'rgba(0,0,0,0.6)',
                border: '1px solid rgba(233,68,128,0.3)',
                color: '#e94480',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                transition: 'all 0.3s ease',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = 'rgba(233,68,128,0.15)'
                e.currentTarget.style.borderColor = 'rgba(233,68,128,0.5)'
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = 'rgba(0,0,0,0.6)'
                e.currentTarget.style.borderColor = 'rgba(233,68,128,0.3)'
              }}
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M15 18l-6-6 6-6"/></svg>
            </button>

            <button
              onClick={() => scroll(1)}
              aria-label="Next"
              style={{
                position: 'absolute',
                right: '-20px',
                top: '50%',
                transform: 'translateY(-50%)',
                zIndex: 10,
                width: '44px',
                height: '44px',
                borderRadius: '50%',
                background: 'rgba(0,0,0,0.6)',
                border: '1px solid rgba(233,68,128,0.3)',
                color: '#e94480',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                transition: 'all 0.3s ease',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = 'rgba(233,68,128,0.15)'
                e.currentTarget.style.borderColor = 'rgba(233,68,128,0.5)'
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = 'rgba(0,0,0,0.6)'
                e.currentTarget.style.borderColor = 'rgba(233,68,128,0.3)'
              }}
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M9 18l6-6-6-6"/></svg>
            </button>

            {/* Scrollable container */}
            <div
              ref={scrollRef}
              style={{
                display: 'flex',
                gap: '2rem',
                overflowX: 'auto',
                scrollSnapType: 'x mandatory',
                WebkitOverflowScrolling: 'touch',
                scrollbarWidth: 'none',
                paddingBottom: '1rem',
              }}
            >
              <style>{`
                #journal ::-webkit-scrollbar { display: none; }
              `}</style>

              {posts.map((post) => (
                <Link
                  key={post.id}
                  href={`/journal/${post.slug}`}
                  className="journal-slide"
                  style={{
                    textDecoration: 'none',
                    display: 'block',
                    scrollSnapAlign: 'start',
                  }}
                >
                  <article
                    className="journal-card"
                    style={{
                      display: 'flex',
                      flexDirection: 'column',
                      borderRadius: '24px',
                      overflow: 'hidden',
                      border: '1px solid rgba(255,255,255,0.06)',
                      background: 'rgba(0,0,0,0.4)',
                      transition: 'all 0.4s cubic-bezier(0.16,1,0.3,1)',
                      cursor: 'pointer',
                      height: '100%',
                      boxShadow: '0 4px 24px rgba(233,68,128,0.06)',
                    }}
                  >
                    <div style={{ position: 'relative', overflow: 'hidden', aspectRatio: '16/10', minHeight: '220px' }}>
                      <img
                        src={post.imageUrl || '/hero-logo-card.png'}
                        alt={post.title}
                        className="journal-img"
                        style={{
                          width: '100%',
                          height: '100%',
                          objectFit: 'cover',
                          display: 'block',
                          transition: 'transform 0.6s cubic-bezier(0.16,1,0.3,1)',
                        }}
                      />
                      <div
                        style={{
                          position: 'absolute',
                          bottom: 0,
                          left: 0,
                          right: 0,
                          padding: '2.5rem 1.5rem 1.25rem',
                          background: 'linear-gradient(transparent, rgba(0,0,0,0.85))',
                        }}
                      >
                        <span
                          style={{
                            display: 'inline-block',
                            padding: '0.35rem 0.9rem',
                            background: 'rgba(233, 68, 128, 0.12)',
                            border: '1px solid rgba(233, 68, 128, 0.2)',
                            borderRadius: '4px',
                            fontFamily: "'Inter', sans-serif",
                            fontSize: '0.65rem',
                            letterSpacing: '0.15em',
                            textTransform: 'uppercase',
                            color: '#e94480',
                            fontWeight: 500,
                          }}
                        >
                          Read
                        </span>
                      </div>
                    </div>

                    <div style={{ padding: '1.75rem', flex: 1, display: 'flex', flexDirection: 'column' }}>
                      <h3
                        style={{
                          fontFamily: "'Pirata One', 'Playfair Display', cursive",
                          fontSize: 'clamp(1.2rem, 2.8vw, 1.5rem)',
                          color: '#e94480',
                          marginBottom: '0.75rem',
                          fontWeight: 400,
                          letterSpacing: '0.04em',
                          lineHeight: 1.25,
                          textShadow: '0 0 20px rgba(233,68,128,0.15)',
                        }}
                      >
                        {post.title}
                      </h3>

                      <p
                        style={{
                          fontFamily: "'Inter', sans-serif",
                          fontSize: '0.9rem',
                          color: 'rgba(255,255,255,0.65)',
                          lineHeight: 1.7,
                          marginBottom: '1.5rem',
                          flex: 1,
                          display: '-webkit-box',
                          WebkitLineClamp: 3,
                          WebkitBoxOrient: 'vertical',
                          overflow: 'hidden',
                        }}
                      >
                        {post.excerpt || post.content?.slice(0, 180)}{post.content?.length > 180 || post.excerpt ? '...' : ''}
                      </p>

                      <div
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'space-between',
                          borderTop: '1px solid rgba(255,255,255,0.05)',
                          paddingTop: '1rem',
                        }}
                      >
                        <span
                          style={{
                            fontFamily: "'Inter', sans-serif",
                            fontSize: '0.7rem',
                            letterSpacing: '0.1em',
                            textTransform: 'uppercase',
                            color: 'rgba(255,255,255,0.35)',
                          }}
                        >
                          {post.publishedAt
                            ? new Date(post.publishedAt).toLocaleDateString('en-GB', {
                                day: 'numeric',
                                month: 'short',
                                year: 'numeric',
                              })
                            : ''}
                          {post.readTime ? ` \u2022 ${post.readTime} min` : ''}
                        </span>

                        <span
                          style={{
                            fontFamily: "'Inter', sans-serif",
                            fontSize: '0.75rem',
                            color: '#e94480',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '0.35rem',
                            transition: 'transform 0.3s ease',
                          }}
                          className="read-arrow"
                        >
                          Read Article
                          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M5 12h14M12 5l7 7-7 7" />
                          </svg>
                        </span>
                      </div>
                    </div>
                  </article>
                </Link>
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
              Journal entries coming soon.
            </p>
          </div>
        )}
      </div>
    </section>
  )
}
