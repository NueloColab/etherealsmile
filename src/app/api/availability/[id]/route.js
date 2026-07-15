import { NextResponse } from 'next/server'
import { db } from '../../../../lib/db'
import { availability } from '../../../../lib/schema'
import { eq } from 'drizzle-orm'

export const dynamic = 'force-dynamic'

export async function DELETE(req, { params }) {
  try {
    const { id } = params
    await db.delete(availability).where(eq(availability.id, id))
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Availability DELETE error:', error)
    return NextResponse.json({ success: false, error: error.message }, { status: 500 })
  }
}
