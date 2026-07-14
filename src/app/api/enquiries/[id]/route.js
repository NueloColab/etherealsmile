import { db } from '../../../../lib/db'
import { enquiries } from '../../../../lib/schema'
import { eq } from 'drizzle-orm'
import { NextResponse } from 'next/server'

export async function PUT(request, { params }) {
  try {
    const { id } = params
    const body = await request.json()
    const update = {}
    if (body.status) update.status = body.status
    if (body.notes) update.notes = body.notes
    if (body.status === 'confirmed' && !body.confirmedAt) {
      update.confirmedAt = new Date()
    }
    await db.update(enquiries).set(update).where(eq(enquiries.id, Number(id)))
    return NextResponse.json({ success: true })
  } catch (err) {
    console.error('Enquiry PUT error:', err)
    return NextResponse.json({ error: 'Failed to update enquiry' }, { status: 500 })
  }
}
