import { db } from '../../../lib/db'
import { blogPosts } from '../../../lib/schema'
import { eq } from 'drizzle-orm'
import { notFound } from 'next/navigation'
import Link from 'next/link'

export async function generateStaticParams() {
  const posts = await db.select({ slug: blogPosts.slug }).from(blogPosts).where(eq(blogPosts.status, 'published'))
  return posts.map((post) => ({ slug: post.slug }))
}

export default async function JournalPost({ params }) {
  const { slug } = params
  const rows = await db.select().from(blogPosts).where(eq(blogPosts.slug, slug))
  const post = rows[0]

  if (!post) {
    notFound()
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
          color: '#c9a96e',
          textDecoration: 'none',
          marginBottom: '2rem',
        }}
      >
        &larr; Back to Home
      </Link>

      {post.imageUrl && (
        <div
          style={{
            borderRadius: '12px',
            overflow: 'hidden',
            border: '1px solid rgba(201, 169, 110, 0.15)',
            marginBottom: '2rem',
          }}
        >
          <img
            src={post.imageUrl}
            alt={post.title}
            style={{ width: '100%', height: 'auto', display: 'block' }}
          />
        </div>
      )}

      <h1
        style={{
          fontFamily: "'Playfair Display', serif",
          fontSize: 'clamp(1.6rem, 4vw, 2.4rem)',
          color: '#ffffff',
          marginBottom: '0.75rem',
          lineHeight: 1.2,
        }}
      >
        {post.title}
      </h1>

      <p
        style={{
          fontFamily: "'Inter', sans-serif",
          fontSize: '0.75rem',
          color: 'rgba(255,255,255,0.4)',
          letterSpacing: '0.08em',
          marginBottom: '2rem',
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
    </article>
  )
}
