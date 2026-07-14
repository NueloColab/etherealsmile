'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'

export default function Journal() {
  const [posts, setPosts] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch('/api/blog-posts')
      .then((r) => r.json())
      .then((data) => {
        const published = (data || []).filter((p) => p.status === 'published')
        setPosts(published.slice(0, 6))
        setLoading(false)
      })
      .catch(() => setLoading(false))
  }, [])

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
        <h2 className="section-title reveal">Journal</h2>
        <p className="section-subtitle reveal reveal-delay-1">Tips, trends, and aftercare wisdom</p>

        {loading ? (
          <p style={{ textAlign: 'center', color: 'rgba(255,255,255,0.4)', marginTop: '3rem' }}>Loading journal...</p>
        ) : posts.length > 0 ? (
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(340px, 1fr))',
              gap: '2rem',
              marginTop: '3rem',
            }}
          >
            {posts.map((post) => (
              <Link
                key={post.id}
                href={`/journal/${post.slug}`}
                style={{
                  textDecoration: 'none',
                  display: 'block',
                }}
              >
                <article
                  className="journal-card reveal reveal-scale"
                  style={{
                    display: 'flex',
                    flexDirection: 'column',
                    borderRadius: '16px',
                    overflow: 'hidden',
                    border: '1px solid rgba(255,255,255,0.06)',
                    background: 'rgba(0,0,0,0.4)',
                    transition: 'all 0.4s cubic-bezier(0.16,1,0.3,1)',
                    cursor: 'pointer',
                  }}
                >
                  <div style={{ position: 'relative', overflow: 'hidden', aspectRatio: '16/10' }}>
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
                        padding: '2rem 1.5rem 1rem',
                        background: 'linear-gradient(transparent, rgba(0,0,0,0.9))',
                      }}
                    >
                      <span
                        style={{
                          display: 'inline-block',
                          padding: '0.3rem 0.75rem',
                          background: 'rgba(233, 68, 128, 0.15)',
                          border: '1px solid rgba(233, 68, 128, 0.25)',
                          borderRadius: '4px',
                          fontFamily: "'Inter', sans-serif",
                          fontSize: '0.6rem',
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

                  <div style={{ padding: '1.5rem', flex: 1, display: 'flex', flexDirection: 'column' }}>
                    <h3
                      style={{
                        fontFamily: "'Pirata One', 'Playfair Display', cursive",
                        fontSize: 'clamp(1.1rem, 2.5vw, 1.35rem)',
                        color: '#e94480',
                        marginBottom: '0.75rem',
                        fontWeight: 400,
                        letterSpacing: '0.04em',
                        lineHeight: 1.25,
                      }}
                    >
                      {post.title}
                    </h3>

                    <p
                      style={{
                        fontFamily: "'Inter', sans-serif",
                        fontSize: '0.85rem',
                        color: 'rgba(255,255,255,0.6)',
                        lineHeight: 1.7,
                        marginBottom: '1.25rem',
                        flex: 1,
                      }}
                    >
                      {post.excerpt || post.content?.slice(0, 140)}{post.content?.length > 140 || post.excerpt ? '...' : ''}
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
                      </span>

                      <span
                        style={{
                          fontFamily: "'Inter', sans-serif",
                          fontSize: '0.75rem',
                          color: '#e94480',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '0.35rem',
                        }}
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
