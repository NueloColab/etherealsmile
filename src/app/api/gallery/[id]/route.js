import { db } from '../../../../lib/db'
import { galleryItems } from '../../../../lib/schema'
import { eq } from 'drizzle-orm'
import { NextResponse } from 'next/server'

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
