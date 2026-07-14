import { db } from '../../../lib/db'
import { blogPosts } from '../../../lib/schema'
import { eq, ne, desc } from 'drizzle-orm'
import { notFound } from 'next/navigation'
import ArticlePage from './ArticlePage'

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

  // Fetch related posts (other published posts, excluding current, limit 3)
  const relatedRows = await db
    .select({
      id: blogPosts.id,
      title: blogPosts.title,
      slug: blogPosts.slug,
      imageUrl: blogPosts.imageUrl,
      publishedAt: blogPosts.publishedAt,
    })
    .from(blogPosts)
    .where(ne(blogPosts.id, post.id))
    .orderBy(desc(blogPosts.publishedAt))
    .limit(3)

  return <ArticlePage post={post} extraImages={extraImages} relatedPosts={relatedRows} />
}
