import { db } from '../../../../../lib/db'
import { enquiries } from '../../../../../lib/schema'
import { eq } from 'drizzle-orm'
import { NextResponse } from 'next/server'

export async function POST(request, { params }) {
  try {
    const { token } = params
    const body = await request.json()
    const { action } = body

    if (!action || !['accept', 'reject'].includes(action)) {
      return NextResponse.json({ error: 'Invalid action' }, { status: 400 })
    }

    const items = await db.select().from(enquiries).where(eq(enquiries.proposalToken, token))
    const enquiry = items[0]

    if (!enquiry) {
      return NextResponse.json({ error: 'Proposal not found' }, { status: 404 })
    }

    // Check expiry
    if (enquiry.proposalExpiresAt && new Date() > new Date(enquiry.proposalExpiresAt)) {
      return NextResponse.json({ error: 'Proposal expired' }, { status: 410 })
    }

    if (action === 'accept') {
      // Move proposed to confirmed
      await db.update(enquiries).set({
        status: 'confirmed',
        preferredDate: enquiry.proposedDate,
        preferredTime: enquiry.proposedTime,
        confirmedAt: new Date(),
        notes: (enquiry.notes || '') + `\nCustomer accepted alternative: ${enquiry.proposedDate} at ${enquiry.proposedTime}`,
      }).where(eq(enquiries.id, enquiry.id))
    } else {
      // Reject — keep as rejected
      await db.update(enquiries).set({
        status: 'rejected',
        notes: (enquiry.notes || '') + `\nCustomer declined alternative: ${enquiry.proposedDate} at ${enquiry.proposedTime}`,
      }).where(eq(enquiries.id, enquiry.id))
    }

    return NextResponse.json({ success: true, action })
  } catch (err) {
    console.error('Booking confirm error:', err)
    return NextResponse.json({ error: 'Failed to process' }, { status: 500 })
  }
}
