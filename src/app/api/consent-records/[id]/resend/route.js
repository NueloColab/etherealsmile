import { dbAdmin as db } from '../../../../../lib/db-admin'
import { consentRecords, consentDocuments, clients } from '../../../../../lib/schema'
import { eq, and } from 'drizzle-orm'
import { NextResponse } from 'next/server'
import { randomBytes } from 'crypto'

/**
 * POST /api/consent-records/[id]/resend
 *
 * Resend a consent form email. Behaviour depends on status:
 * - sent/viewed: reuse same token, update sentAt, re-email
 * - declined/expired: mint fresh token, reset to 'sent', new expiry, re-email
 * - signed: blocked (409)
 */
export async function POST(request, { params }) {
  try {
    const id = Number(params.id)

    // Fetch the record with document info
    const rows = await db.select({
      id: consentRecords.id,
      clientId: consentRecords.clientId,
      bookingId: consentRecords.bookingId,
      documentId: consentRecords.documentId,
      status: consentRecords.status,
      acceptToken: consentRecords.acceptToken,
      documentType: consentDocuments.documentType,
      documentTitle: consentDocuments.title,
      pdfUrl: consentDocuments.pdfUrl,
    })
    .from(consentRecords)
    .leftJoin(consentDocuments, eq(consentRecords.documentId, consentDocuments.id))
    .where(eq(consentRecords.id, id))

    const record = rows[0]
    if (!record) {
      return NextResponse.json({ error: 'Consent record not found' }, { status: 404 })
    }

    // Block resend for signed records
    if (record.status === 'signed') {
      return NextResponse.json({ error: 'Already signed, resend not allowed', status: record.status }, { status: 409 })
    }

    // Get client for email
    const clientRows = await db.select().from(clients).where(eq(clients.id, record.clientId))
    const client = clientRows[0]
    if (!client) {
      return NextResponse.json({ error: 'Client not found' }, { status: 404 })
    }

    let token = record.acceptToken
    let updateFields = {}

    if (record.status === 'sent' || record.status === 'viewed') {
      // Reuse same token, just re-email
      updateFields = { sentAt: new Date() }
    } else if (record.status === 'declined' || record.status === 'expired') {
      // Mint fresh token, reset to sent, new expiry
      token = randomBytes(32).toString('hex')
      updateFields = {
        acceptToken: token,
        status: 'sent',
        sentAt: new Date(),
        expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
        declinedAt: null,
      }
    } else {
      // Unknown status
      return NextResponse.json({ error: `Cannot resend record in status: ${record.status}` }, { status: 400 })
    }

    // Update the record
    await db.update(consentRecords).set(updateFields).where(eq(consentRecords.id, id))

    // Send email
    try {
      const { sendConsentRequestEmail } = await import('../../../../../lib/email')
      await sendConsentRequestEmail({
        to: client.email,
        name: client.name,
        documentType: record.documentType,
        documentTitle: record.documentTitle,
        pdfUrl: record.pdfUrl,
        token,
      })
    } catch (emailErr) {
      console.error('[CONSENT RESEND] Email failed:', emailErr.message)
      // Record was updated but email didn't send - admin can retry
      return NextResponse.json({ success: true, status: 'sent', warning: 'Email send failed, record updated', token, sentAt: updateFields.sentAt }, { status: 207 })
    }

    return NextResponse.json({
      success: true,
      status: record.status === 'sent' || record.status === 'viewed' ? record.status : 'sent',
      token,
      sentAt: updateFields.sentAt,
      freshToken: record.status === 'declined' || record.status === 'expired',
    })

  } catch (err) {
    console.error('[CONSENT RESEND] Error:', err)
    return NextResponse.json({ error: 'Failed to resend consent form' }, { status: 500 })
  }
}