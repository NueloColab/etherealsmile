import { db } from '../../../lib/db'
import { blogPosts } from '../../../lib/schema'
import { eq } from 'drizzle-orm'
import { notFound } from 'next/navigation'
import Link from 'next/link'

export const dynamic = 'force-dynamic'

export default async function JournalPost({ params }) {
  const { slug } = params
  const rows = await db.select().from(blogPosts).where(eq(blogPosts.slug, slug))
  const post = rows[0]

  if (!post) {
    notFound()
  }

  // Parse additional images from JSONB
  let extraImages = []
  try {
    if (post.images && Array.isArray(post.images) && post.images.length > 0) {
      extraImages = post.images.filter((url) => typeof url === 'string' && url.trim() !== '')
    }
  } catch {
    extraImages = []
  }

  return (
    <article
      style={{
        position: 'relative',
        zIndex: 1,
        padding: '6rem 1.5rem 4rem',
        maxWidth: '800px',
        margin: '0 auto',
      }}
    >
      <Link
        href="/"
        style={{
          display: 'inline-block',
          fontSize: '0.7rem',
          letterSpacing: '0.12em',
          textTransform: 'uppercase',
          color: '#e94480',
          textDecoration: 'none',
          marginBottom: '2rem',
        }}
      >
        &larr; Back to Home
      </Link>

      <div
        style={{
          borderRadius: '16px',
          overflow: 'hidden',
          border: '1px solid rgba(233, 68, 128, 0.2)',
          marginBottom: '2.5rem',
          boxShadow: '0 0 40px rgba(233, 68, 128, 0.08)',
        }}
      >
        <img
          src={post.imageUrl || '/hero-logo-card.png'}
          alt={post.title}
          style={{ width: '100%', height: 'auto', display: 'block' }}
        />
      </div>

      <h1
        style={{
          fontFamily: "'Pirata One', 'Playfair Display', cursive",
          fontSize: 'clamp(1.8rem, 5vw, 2.8rem)',
          color: '#e94480',
          marginBottom: '0.75rem',
          lineHeight: 1.15,
          letterSpacing: '0.04em',
        }}
      >
        {post.title}
      </h1>

      <p
        style={{
          fontFamily: "'Inter', sans-serif",
          fontSize: '0.8rem',
          color: 'rgba(255,255,255,0.4)',
          letterSpacing: '0.08em',
          marginBottom: '2.5rem',
        }}
      >
        {post.publishedAt
          ? new Date(post.publishedAt).toLocaleDateString('en-GB', {
              day: 'numeric',
              month: 'long',
              year: 'numeric',
            })
          : ''}
      </p>

      <div
        className="blog-content"
        style={{
          fontFamily: "'Inter', sans-serif",
          fontSize: '0.95rem',
          lineHeight: 1.8,
          color: 'rgba(255,255,255,0.75)',
        }}
        dangerouslySetInnerHTML={{ __html: post.content.replace(/\n/g, '<br />') }}
      />

      {/* Extra images */}
      {extraImages.length > 0 && (
        <div style={{ marginTop: '3rem' }}>
          <div
            style={{
              height: '1px',
              background: 'linear-gradient(90deg, transparent, rgba(233,68,128,0.3), transparent)',
              marginBottom: '2.5rem',
            }}
          />

          <p
            style={{
              fontFamily: "'Pirata One', 'Playfair Display', cursive",
              fontSize: '1.2rem',
              color: '#e94480',
              marginBottom: '1.5rem',
              letterSpacing: '0.05em',
            }}
          >
            Gallery
          </p>

          <div
            style={{
              display: 'grid',
              gridTemplateColumns: extraImages.length === 1 ? '1fr' : 'repeat(auto-fill, minmax(280px, 1fr))',
              gap: '1rem',
            }}
          >
            {extraImages.map((url, i) => (
              <div
                key={i}
                style={{
                  borderRadius: '12px',
                  overflow: 'hidden',
                  border: '1px solid rgba(255,255,255,0.08)',
                }}
              >
                <img
                  src={url}
                  alt={`${post.title} — image ${i + 1}`}
                  style={{
                    width: '100%',
                    height: 'auto',
                    display: 'block',
                  }}
                />
              </div>
            ))}
          </div>
        </div>
      )}
    </article>
  )
}
