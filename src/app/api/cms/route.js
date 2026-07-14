import { db } from '../../../lib/db'
import { siteContent } from '../../../lib/schema'
import { eq } from 'drizzle-orm'
import { NextResponse } from 'next/server'

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url)
    const key = searchParams.get('key')

    if (key) {
      const rows = await db.select().from(siteContent).where(eq(siteContent.sectionKey, key))
      if (rows.length > 0) {
        return NextResponse.json(rows[0].content)
      }
      return NextResponse.json({})
    }

    const all = await db.select().from(siteContent)
    const result = {}
    all.forEach((row) => {
      result[row.sectionKey] = row.content
    })
    return NextResponse.json(result)
  } catch (err) {
    console.error('CMS GET error:', err)
    return NextResponse.json({ error: 'Failed to fetch content' }, { status: 500 })
  }
}

export async function PUT(request) {
  try {
    const body = await request.json()
    const { key, content } = body

    if (!key || typeof content !== 'object') {
      return NextResponse.json({ error: 'Missing key or content' }, { status: 400 })
    }

    const existing = await db.select().from(siteContent).where(eq(siteContent.sectionKey, key))

    if (existing.length > 0) {
      await db
        .update(siteContent)
        .set({ content, updatedAt: new Date() })
        .where(eq(siteContent.sectionKey, key))
    } else {
      await db.insert(siteContent).values({
        sectionKey: key,
        content,
        updatedAt: new Date(),
      })
    }

    return NextResponse.json({ success: true })
  } catch (err) {
    console.error('CMS PUT error:', err)
    return NextResponse.json({ error: 'Failed to save content' }, { status: 500 })
  }
}
