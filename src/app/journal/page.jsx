import Link from 'next/link'
import { db } from '../../lib/db'
import { blogPosts } from '../../lib/schema'
import { eq, desc } from 'drizzle-orm'

export const dynamic = 'force-dynamic'

export const metadata = {
  title: 'Journal | Ethereal Smile',
  description: 'Tips, trends, and aftercare wisdom from Ethereal Smile',
}

export default async function JournalPage() {
  const allPosts = await db
    .select()
    .from(blogPosts)
    .where(eq(blogPosts.status, 'published'))
    .orderBy(desc(blogPosts.publishedAt))

  return (
    <main style={{ minHeight: '100vh', background: '#000000', color: '#ffffff', fontFamily: "'Inter', sans-serif" }}>
      {/* Header */}
      <div style={{ padding: '8rem 2rem 4rem', maxWidth: '900px', margin: '0 auto', textAlign: 'center' }}>
        <h1 style={{ fontFamily: "'Pirata One', 'Playfair Display', cursive", fontSize: 'clamp(2rem, 5vw, 3.5rem)', color: '#e94480', letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: '1rem' }}>
          Journal
        </h1>
        <p style={{ fontSize: '1rem', color: 'rgba(255,255,255,0.5)', letterSpacing: '0.05em' }}>
          Tips, trends, and aftercare wisdom
        </p>
      </div>

      {/* Posts grid */}
      <div style={{ maxWidth: '1100px', margin: '0 auto', padding: '0 2rem 6rem' }}>
        {allPosts.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '4rem 2rem', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.05)', background: 'rgba(255,255,255,0.02)' }}>
            <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: '0.9rem' }}>
              Journal entries coming soon.
            </p>
          </div>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(340px, 1fr))', gap: '2rem' }}>
            {allPosts.map((post) => (
              <Link
                key={post.id}
                href={`/journal/${post.slug}`}
                style={{ textDecoration: 'none', display: 'block' }}
              >
                <article
                  style={{
                    display: 'flex',
                    flexDirection: 'column',
                    borderRadius: '16px',
                    overflow: 'hidden',
                    border: '1px solid rgba(255,255,255,0.06)',
                    background: 'rgba(255,255,255,0.03)',
                    transition: 'all 0.3s ease',
                    cursor: 'pointer',
                  }}
                >
                  <div style={{ position: 'relative', overflow: 'hidden', aspectRatio: '16/10' }}>
                    <img
                      src={post.imageUrl || '/hero-logo-card.png'}
                      alt={post.title}
                      style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
                    />
                    <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, padding: '2rem 1.5rem 1rem', background: 'linear-gradient(transparent, rgba(0,0,0,0.9))' }}>
                      <span style={{ display: 'inline-block', padding: '0.3rem 0.75rem', background: 'rgba(233,68,128,0.15)', border: '1px solid rgba(233,68,128,0.25)', borderRadius: '4px', fontSize: '0.6rem', letterSpacing: '0.15em', textTransform: 'uppercase', color: '#e94480', fontWeight: 500 }}>
                        Read
                      </span>
                    </div>
                  </div>

                  <div style={{ padding: '1.5rem', flex: 1, display: 'flex', flexDirection: 'column' }}>
                    <h2 style={{ fontFamily: "'Pirata One', 'Playfair Display', cursive", fontSize: '1.35rem', color: '#e94480', marginBottom: '0.75rem', fontWeight: 400, letterSpacing: '0.04em', lineHeight: 1.25 }}>
                      {post.title}
                    </h2>

                    <p style={{ fontSize: '0.85rem', color: 'rgba(255,255,255,0.6)', lineHeight: 1.7, marginBottom: '1.25rem', flex: 1 }}>
                      {post.excerpt || (post.content ? post.content.slice(0, 140) + '...' : '')}
                    </p>

                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderTop: '1px solid rgba(255,255,255,0.05)', paddingTop: '1rem' }}>
                      <span style={{ fontSize: '0.7rem', letterSpacing: '0.1em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.35)' }}>
                        {post.publishedAt ? new Date(post.publishedAt).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' }) : ''}
                      </span>
                      <span style={{ fontSize: '0.75rem', color: '#e94480', display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
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
        )}
      </div>

      {/* Footer link */}
      <div style={{ textAlign: 'center', padding: '2rem', borderTop: '1px solid rgba(255,255,255,0.05)' }}>
        <Link href="/" style={{ color: '#e94480', textDecoration: 'none', fontSize: '0.85rem', letterSpacing: '0.1em', textTransform: 'uppercase' }}>
          &larr; Back to Home
        </Link>
      </div>
    </main>
  )
}