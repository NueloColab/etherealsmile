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
        background: 'linear-gradient(to bottom, transparent, rgba(0,0,0,0.4) 20%, rgba(0,0,0,0.4) 80%, transparent)',
      }}
    >
      <div className="section-inner">
        <h2 className="section-title">Journal</h2>
        <p className="section-subtitle">Tips, trends, and aftercare wisdom</p>
        <div className="gold-line" />

        {posts.length > 0 ? (
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
              gap: '1.5rem',
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
                  className="glass-card card-hover"
                  style={{
                    height: '100%',
                    display: 'flex',
                    flexDirection: 'column',
                    padding: 0,
                    overflow: 'hidden',
                  }}
                >
                  {post.imageUrl && (
                    <div style={{ height: '180px', overflow: 'hidden' }}>
                      <img
                        src={post.imageUrl}
                        alt={post.title}
                        className="img-zoom"
                        style={{
                          width: '100%',
                          height: '100%',
                          objectFit: 'cover',
                          display: 'block',
                        }}
                      />
                    </div>
                  )}
                  <div style={{ padding: '1.5rem', flex: 1, display: 'flex', flexDirection: 'column' }}>
                    <h3
                      style={{
                        fontFamily: "'Playfair Display', serif",
                        fontSize: '1.05rem',
                        color: '#c9a96e',
                        marginBottom: '0.5rem',
                        fontWeight: 500,
                      }}
                    >
                      {post.title}
                    </h3>
                    <p
                      style={{
                        fontFamily: "'Inter', sans-serif",
                        fontSize: '0.8rem',
                        color: 'rgba(255,255,255,0.55)',
                        lineHeight: 1.6,
                        marginBottom: '1rem',
                      }}
                    >
                      {post.excerpt || post.content.slice(0, 120)}...
                    </p>
                    <span
                      style={{
                        fontFamily: "'Inter', sans-serif",
                        fontSize: '0.65rem',
                        letterSpacing: '0.1em',
                        textTransform: 'uppercase',
                        color: 'rgba(255,255,255,0.35)',
                        marginTop: 'auto',
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
