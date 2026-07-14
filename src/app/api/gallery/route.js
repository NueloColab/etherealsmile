import { db } from '../../../lib/db'
import { galleryItems } from '../../../lib/schema'
import { asc } from 'drizzle-orm'
import { NextResponse } from 'next/server'

export async function GET() {
  try {
    const items = await db.select().from(galleryItems).orderBy(asc(galleryItems.sortOrder))
    return NextResponse.json(items)
  } catch (err) {
    console.error('Gallery GET error:', err)
    return NextResponse.json([], { status: 500 })
  }
}

export async function POST(request) {
  try {
    const body = await request.json()
    const result = await db.insert(galleryItems).values({
      type: 'image',
      url: body.imageUrl || body.url,
      caption: body.caption || null,
      sortOrder: body.order || body.sortOrder || 0,
    }).returning()
    return NextResponse.json(result[0], { status: 201 })
  } catch (err) {
    console.error('Gallery POST error:', err)
    return NextResponse.json({ error: 'Failed to add item' }, { status: 500 })
  }
}