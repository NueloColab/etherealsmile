import { db } from '../../../../../lib/db'
import { bookings } from '../../../../../lib/schema'
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

    const items = await db.select().from(bookings).where(eq(bookings.proposalToken, token))
    const booking = items[0]

    if (!booking) {
      return NextResponse.json({ error: 'Proposal not found' }, { status: 404 })
    }

    // Check expiry
    if (booking.proposalExpiresAt && new Date() > new Date(booking.proposalExpiresAt)) {
      return NextResponse.json({ error: 'Proposal expired' }, { status: 410 })
    }

    if (action === 'accept') {
      // Move proposed to confirmed
      await db.update(bookings).set({
        status: 'confirmed',
        date: booking.proposedDate,
        timeSlot: booking.proposedTime,
        confirmedAt: new Date(),
        notes: (booking.notes || '') + `\nCustomer accepted alternative: ${booking.proposedDate} at ${booking.proposedTime}`,
      }).where(eq(bookings.id, booking.id))
    } else {
      // Reject
      await db.update(bookings).set({
        status: 'rejected',
        notes: (booking.notes || '') + `\nCustomer declined alternative: ${booking.proposedDate} at ${booking.proposedTime}`,
      }).where(eq(bookings.id, booking.id))
    }

    return NextResponse.json({ success: true, action })
  } catch (err) {
    console.error('Booking confirm error:', err)
    return NextResponse.json({ error: 'Failed to process' }, { status: 500 })
  }
}