import { db } from '../../../../lib/db'
import { blogPosts } from '../../../../lib/schema'
import { eq } from 'drizzle-orm'
import { NextResponse } from 'next/server'

export async function PUT(request, { params }) {
  try {
    const { id } = params
    const body = await request.json()
    await db.update(blogPosts).set({ ...body, updatedAt: new Date() }).where(eq(blogPosts.id, Number(id)))
    return NextResponse.json({ success: true })
  } catch (err) {
    console.error('Blog PUT error:', err)
    return NextResponse.json({ error: 'Failed to update post' }, { status: 500 })
  }
}

export async function DELETE(request, { params }) {
  try {
    const { id } = params
    await db.delete(blogPosts).where(eq(blogPosts.id, Number(id)))
    return NextResponse.json({ success: true })
  } catch (err) {
    console.error('Blog DELETE error:', err)
    return NextResponse.json({ error: 'Failed to delete post' }, { status: 500 })
  }
}
