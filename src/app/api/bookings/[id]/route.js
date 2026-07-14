import { db } from '../../../../lib/db'
import { bookings } from '../../../../lib/schema'
import { eq } from 'drizzle-orm'
import { NextResponse } from 'next/server'
import { sendConfirmationEmail, sendAlternativeProposalEmail } from '../../../../lib/email'
import { randomBytes } from 'crypto'

export async function GET(request, { params }) {
  try {
    const items = await db.select().from(bookings).where(eq(bookings.id, Number(params.id)))
    const booking = items[0]
    if (!booking) {
      return NextResponse.json({ error: 'Booking not found' }, { status: 404 })
    }
    return NextResponse.json(booking)
  } catch (err) {
    console.error('Booking GET error:', err)
    return NextResponse.json({ error: 'Failed to fetch booking' }, { status: 500 })
  }
}

export async function PUT(request, { params }) {
  try {
    const { id } = params
    const body = await request.json()
    const update = {}

    if (body.status) update.status = body.status
    if (body.notes !== undefined) update.notes = body.notes
    if (body.status === 'confirmed' && !body.confirmedAt) {
      update.confirmedAt = new Date()
    }

    // Handle alternative proposal
    if (body.proposedDate) {
      update.proposedDate = new Date(body.proposedDate)
      update.proposedTime = body.proposedTime || null
      update.proposalToken = randomBytes(32).toString('hex')
      update.proposalExpiresAt = new Date(Date.now() + 48 * 60 * 60 * 1000) // 48 hours
    }

    await db.update(bookings).set(update).where(eq(bookings.id, Number(id)))

    // Fetch updated booking for emails
    const items = await db.select().from(bookings).where(eq(bookings.id, Number(id)))
    const booking = items[0]

    // Send emails based on action
    if (body.status === 'confirmed' && booking) {
      await sendConfirmationEmail({
        to: booking.email,
        name: booking.name,
        date: booking.date,
        time: booking.timeSlot,
        service: booking.service,
        price: booking.price,
      })
    }

    if (body.proposedDate && booking && booking.proposalToken) {
      await sendAlternativeProposalEmail({
        to: booking.email,
        name: booking.name,
        originalDate: booking.date,
        originalTime: booking.timeSlot,
        proposedDate: booking.proposedDate,
        proposedTime: booking.proposedTime,
        service: booking.service,
        price: booking.price,
        token: booking.proposalToken,
      })
    }

    return NextResponse.json({ success: true, proposalToken: update.proposalToken || null })
  } catch (err) {
    console.error('Booking PUT error:', err)
    return NextResponse.json({ error: 'Failed to update booking' }, { status: 500 })
  }
}