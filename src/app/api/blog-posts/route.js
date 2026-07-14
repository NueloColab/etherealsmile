import { db } from '../../../lib/db'
import { blogPosts } from '../../../lib/schema'
import { desc } from 'drizzle-orm'
import { NextResponse } from 'next/server'

export async function GET() {
  try {
    const items = await db.select().from(blogPosts).orderBy(desc(blogPosts.createdAt))
    return NextResponse.json(items)
  } catch (err) {
    console.error('Blog GET error:', err)
    return NextResponse.json({ error: 'Failed to fetch posts' }, { status: 500 })
  }
}

export async function POST(request) {
  try {
    const body = await request.json()
    const slug = body.slug || body.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '')
    await db.insert(blogPosts).values({
      ...body,
      slug,
      createdAt: new Date(),
      updatedAt: new Date(),
    })
    return NextResponse.json({ success: true }, { status: 201 })
  } catch (err) {
    console.error('Blog POST error:', err)
    return NextResponse.json({ error: 'Failed to create post' }, { status: 500 })
  }
}
