import { dbAdmin as db } from '../../../../lib/db-admin'
import { bookings } from '../../../../lib/schema'
import { eq } from 'drizzle-orm'
import { NextResponse } from 'next/server'
import { sendConfirmationEmail, sendAlternativeProposalEmail } from '../../../../lib/email'
import { createOrAttachClient } from '../../../../lib/createOrAttachClient'
import { sendConsentForms } from '../../../../lib/sendConsentForms'
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

    // Customer field edits — never touch status or proposal fields
    if (body.name !== undefined) update.name = body.name
    if (body.email !== undefined) update.email = body.email
    if (body.phone !== undefined) update.phone = body.phone
    if (body.isMinor !== undefined) update.isMinor = body.isMinor
    if (body.date !== undefined) update.date = body.date ? new Date(body.date) : null
    if (body.timeSlot !== undefined) update.timeSlot = body.timeSlot
    if (body.service !== undefined) update.service = body.service
    if (body.price !== undefined) update.price = body.price
    if (body.message !== undefined) update.message = body.message
    if (body.notes !== undefined) update.notes = body.notes

    // Status changes — existing logic, untouched
    if (body.status) update.status = body.status
    if (body.status === 'confirmed' && !body.confirmedAt) {
      update.confirmedAt = new Date()
    }

    // Handle alternative proposal
    if (body.proposedDate) {
      update.proposedDate = new Date(body.proposedDate)
      update.proposedTime = body.proposedTime || null
      update.proposalToken = randomBytes(32).toString('hex')
      update.proposalExpiresAt = new Date(Date.now() + 48 * 60 * 60 * 1000)
    }

    // Capture original isMinor before update for mismatch detection
    const before_items = await db.select({ isMinor: bookings.isMinor, status: bookings.status, consentSentAt: bookings.consentSentAt }).from(bookings).where(eq(bookings.id, Number(id)))
    const before = before_items[0]

    await db.update(bookings).set(update).where(eq(bookings.id, Number(id)))

    // If isMinor changed on a confirmed booking that already had consent sent, flag the mismatch
    if (body.isMinor !== undefined && before && body.isMinor !== (before.isMinor || false)) {
      if (before.status === 'confirmed' && before.consentSentAt) {
        const prevPack = !body.isMinor ? 'adult' : 'guardian'
        const newPack = body.isMinor ? 'guardian' : 'adult'
        await db.update(bookings).set({
          consentSendError: `Minor status changed after consent sent. Originally sent as ${prevPack} pack. Current: ${newPack} pack. Manual resend required.`,
        }).where(eq(bookings.id, Number(id)))
      }
    }

    // Fetch updated booking for emails
    const items = await db.select().from(bookings).where(eq(bookings.id, Number(id)))
    const booking = items[0]

    // Send emails based on action
    if (body.status === 'confirmed' && booking) {
      // Create or attach client — failure must NOT block the confirm
      let clientId = booking.clientId
      try {
        clientId = await createOrAttachClient({
          email: booking.email,
          name: booking.name,
          phone: booking.phone || null,
          source: 'booking_confirmed',
          bookingId: booking.id,
        })
      } catch (clientErr) {
        console.error('Client attach failed (non-blocking):', clientErr.message)
      }

      // Send confirmation email
      await sendConfirmationEmail({
        to: booking.email,
        name: booking.name,
        date: booking.date,
        time: booking.timeSlot,
        service: booking.service,
        price: booking.price,
      })

      // Auto-send consent forms — failure must NOT block the confirm, but must be visible
      if (clientId) {
        try {
          const result = await sendConsentForms({
            clientId: clientId,
            bookingId: booking.id,
            isMinor: booking.isMinor || false,
          })

          if (result.sent.length > 0) {
            // Mark success on the booking
            await db.update(bookings).set({
              consentSentAt: new Date(),
              consentSendError: null,
            }).where(eq(bookings.id, booking.id))
          }

          if (result.skipped.length > 0 && result.sent.length === 0) {
            // All were skipped (duplicates or errors) — record the detail
            await db.update(bookings).set({
              consentSendError: 'Skipped: ' + result.skipped.join(', '),
            }).where(eq(bookings.id, booking.id))
          }

          if (result.error) {
            // Partial or total failure — record the error on the booking
            await db.update(bookings).set({
              consentSendError: result.error,
            }).where(eq(bookings.id, booking.id))
          }
        } catch (consentErr) {
          console.error('Consent auto-send failed (non-blocking):', consentErr.message)
          // Record the failure on the booking so Hattie can see it
          try {
            await db.update(bookings).set({
              consentSendError: consentErr.message,
            }).where(eq(bookings.id, booking.id))
          } catch (dbErr) {
            console.error('Failed to record consent error on booking:', dbErr.message)
          }
        }
      } else {
        // No client ID — can't send consent forms
        try {
          await db.update(bookings).set({
            consentSendError: 'Could not send consent forms: no client ID',
          }).where(eq(bookings.id, booking.id))
        } catch (dbErr) {
          console.error('Failed to record consent error on booking:', dbErr.message)
        }
      }
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

export async function DELETE(request, { params }) {
  try {
    const bookingRows = await db.select().from(bookings)
      .where(eq(bookings.id, Number(params.id)))

    if (!bookingRows[0]) {
      return NextResponse.json({ error: 'Booking not found' }, { status: 404 })
    }

    await db.delete(bookings).where(eq(bookings.id, Number(params.id)))
    return NextResponse.json({ success: true, deleted: bookingRows[0].name })
  } catch (err) {
    console.error('Booking DELETE error:', err)
    return NextResponse.json({ error: 'Failed to delete booking' }, { status: 500 })
  }
}