import { db } from '../../../../lib/db'
import { galleryItems } from '../../../../lib/schema'
import { eq } from 'drizzle-orm'
import { NextResponse } from 'next/server'

export async function PATCH(request, { params }) {
  try {
    const { id } = params
    const body = await request.json()
    const update = {}
    if (body.imageUrl !== undefined) update.url = body.imageUrl
    if (body.url !== undefined) update.url = body.url
    if (body.caption !== undefined) update.caption = body.caption
    if (body.sortOrder !== undefined) update.sortOrder = body.sortOrder
    if (body.order !== undefined) update.sortOrder = body.order

    await db.update(galleryItems).set(update).where(eq(galleryItems.id, Number(id)))
    return NextResponse.json({ success: true })
  } catch (err) {
    console.error('Gallery PATCH error:', err)
    return NextResponse.json({ error: 'Failed to update item' }, { status: 500 })
  }
}

export async function DELETE(request, { params }) {
  try {
    const { id } = params
    await db.delete(galleryItems).where(eq(galleryItems.id, Number(id)))
    return NextResponse.json({ success: true })
  } catch (err) {
    console.error('Gallery DELETE error:', err)
    return NextResponse.json({ error: 'Failed to delete item' }, { status: 500 })
  }
}