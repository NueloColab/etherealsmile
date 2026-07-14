import { db } from '../../../../lib/db'
import { enquiries } from '../../../../lib/schema'
import { eq } from 'drizzle-orm'
import { NextResponse } from 'next/server'
import { sendConfirmationEmail, sendAlternativeProposalEmail } from '../../../../lib/email'
import { randomBytes } from 'crypto'

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

    await db.update(enquiries).set(update).where(eq(enquiries.id, Number(id)))

    // Fetch updated enquiry for emails
    const items = await db.select().from(enquiries).where(eq(enquiries.id, Number(id)))
    const enquiry = items[0]

    // Send emails based on action
    if (body.status === 'confirmed' && enquiry) {
      await sendConfirmationEmail({
        to: enquiry.email,
        name: enquiry.name,
        date: enquiry.preferredDate,
        time: enquiry.preferredTime,
        service: enquiry.service,
        price: enquiry.price,
      })
    }

    if (body.proposedDate && enquiry && enquiry.proposalToken) {
      await sendAlternativeProposalEmail({
        to: enquiry.email,
        name: enquiry.name,
        originalDate: enquiry.preferredDate,
        originalTime: enquiry.preferredTime,
        proposedDate: enquiry.proposedDate,
        proposedTime: enquiry.proposedTime,
        service: enquiry.service,
        price: enquiry.price,
        token: enquiry.proposalToken,
      })
    }

    return NextResponse.json({ success: true, proposalToken: update.proposalToken || null })
  } catch (err) {
    console.error('Enquiry PUT error:', err)
    return NextResponse.json({ error: 'Failed to update enquiry' }, { status: 500 })
  }
}
