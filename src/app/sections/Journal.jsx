import { db } from '../../lib/db'
import { blogPosts } from '../../lib/schema'
import { eq, desc } from 'drizzle-orm'
import Link from 'next/link'

export default async function Journal() {
  const posts = await db
    .select()
    .from(blogPosts)
    .where(eq(blogPosts.status, 'published'))
    .orderBy(desc(blogPosts.publishedAt))
    .limit(6)

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

        {posts.length > 0 ? (
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(340px, 1fr))',
              gap: '2rem',
              marginTop: '3rem',
            }}
          >
            {posts.map((post, i) => (
              <Link
                key={post.id}
                href={`/journal/${post.slug}`}
                style={{
                  textDecoration: 'none',
                  display: 'block',
                }}
              >
                <article
                  className="reveal reveal-scale"
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
                  onMouseEnter={(e) => {
                    e.currentTarget.style.borderColor = 'rgba(233, 68, 128, 0.25)'
                    e.currentTarget.style.boxShadow = '0 0 30px rgba(233, 68, 128, 0.1)'
                    e.currentTarget.style.transform = 'translateY(-4px)'
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.borderColor = 'rgba(255,255,255,0.06)'
                    e.currentTarget.style.boxShadow = 'none'
                    e.currentTarget.style.transform = 'translateY(0)'
                  }}
                >
                  <div style={{ position: 'relative', overflow: 'hidden', aspectRatio: '16/10' }}>
                    <img
                      src={post.imageUrl || '/hero-logo-card.png'}
                      alt={post.title}
                      style={{
                        width: '100%',
                        height: '100%',
                        objectFit: 'cover',
                        display: 'block',
                        transition: 'transform 0.6s cubic-bezier(0.16,1,0.3,1)',
                      }}
                      onMouseEnter={(e) => (e.target.style.transform = 'scale(1.08)')}
                      onMouseLeave={(e) => (e.target.style.transform = 'scale(1)')}
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
                      {post.excerpt || post.content.slice(0, 140)}{post.content.length > 140 || post.excerpt ? '...' : ''}
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
