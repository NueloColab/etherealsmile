import { db } from '../../../../lib/db-admin'
import { consentRecords, consentDocuments, clients, bookings } from '../../../../lib/schema'
import { eq } from 'drizzle-orm'
import { NextResponse } from 'next/server'

export async function GET(request, { params }) {
  try {
    const { token } = params

    // Find the consent record by token
    const items = await db.select({
      id: consentRecords.id,
      clientId: consentRecords.clientId,
      bookingId: consentRecords.bookingId,
      documentId: consentRecords.documentId,
      documentType: consentDocuments.documentType,
      documentTitle: consentDocuments.title,
      documentVersion: consentDocuments.version,
      pdfUrl: consentDocuments.pdfUrl,
      status: consentRecords.status,
      expiresAt: consentRecords.expiresAt,
      responses: consentRecords.responses,
      signatoryName: consentRecords.signatoryName,
      signatoryRelationship: consentRecords.signatoryRelationship,
      signedAt: consentRecords.signedAt,
      createdAt: consentRecords.createdAt,
    })
    .from(consentRecords)
    .leftJoin(consentDocuments, eq(consentRecords.documentId, consentDocuments.id))
    .where(eq(consentRecords.acceptToken, token))

    const record = items[0]
    if (!record) {
      return NextResponse.json({ error: 'Consent form not found' }, { status: 404 })
    }

    // Check expiry
    if (record.expiresAt && new Date() > new Date(record.expiresAt)) {
      // Mark as expired if not already signed
      if (record.status === 'sent' || record.status === 'viewed') {
        await db.update(consentRecords).set({ status: 'expired' }).where(eq(consentRecords.id, record.id))
      }
      return NextResponse.json({ error: 'This consent form has expired', documentType: record.documentType, title: record.documentTitle }, { status: 410 })
    }

    // Mark as viewed if status is 'sent'
    if (record.status === 'sent') {
      await db.update(consentRecords).set({ status: 'viewed', viewedAt: new Date() }).where(eq(consentRecords.id, record.id))
    }

    // Return safe data (no internal IDs, no IP)
    return NextResponse.json({
      id: record.id,
      documentType: record.documentType,
      documentTitle: record.documentTitle,
      documentVersion: record.documentVersion,
      pdfUrl: record.pdfUrl,
      status: record.status === 'sent' ? 'viewed' : record.status, // Show 'viewed' to customer
      expiresAt: record.expiresAt,
      responses: record.responses,
    })
  } catch (err) {
    console.error('Consent token GET error:', err)
    return NextResponse.json({ error: 'Failed to load consent form' }, { status: 500 })
  }
}

export async function POST(request, { params }) {
  try {
    const { token } = params
    const body = await request.json()
    const { signatoryName, signatoryRelationship, responses, action } = body

    // Find the record
    const items = await db.select().from(consentRecords).where(eq(consentRecords.acceptToken, token))
    const record = items[0]
    if (!record) {
      return NextResponse.json({ error: 'Consent form not found' }, { status: 404 })
    }

    // IMMUTABILITY: once signed or declined, no changes allowed
    if (record.status === 'signed' || record.status === 'declined') {
      return NextResponse.json({ error: 'This consent form has already been signed and cannot be modified' }, { status: 403 })
    }

    // Check expiry
    if (record.expiresAt && new Date() > new Date(record.expiresAt)) {
      return NextResponse.json({ error: 'This consent form has expired' }, { status: 410 })
    }

    if (action === 'decline') {
      await db.update(consentRecords).set({
        status: 'declined',
        declinedAt: new Date(),
      }).where(eq(consentRecords.id, record.id))

      return NextResponse.json({ success: true, action: 'declined' })
    }

    // Signing requires signatoryName
    if (!signatoryName || !signatoryName.trim()) {
      return NextResponse.json({ error: 'Full name is required to sign' }, { status: 400 })
    }

    // Aftercare only needs read acknowledgment
    const docItems = await db.select().from(consentDocuments).where(eq(consentDocuments.id, record.documentId))
    const doc = docItems[0]

    // Get client IP
    const ip = request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() || request.headers.get('x-real-ip') || 'unknown'

    // SIGN: immutable write
    await db.update(consentRecords).set({
      status: 'signed',
      signatoryName: signatoryName.trim(),
      signatoryRelationship: signatoryRelationship || (doc?.documentType === 'guardian_consent' ? 'parent' : 'self'),
      signatoryIP: ip,
      responses: responses || {},
      signedAt: new Date(),
    }).where(eq(consentRecords.id, record.id))

    // Auto-attach client if not already linked
    try {
      const { createOrAttachClient } = await import('../../../../lib/createOrAttachClient')
      const clientRows = await db.select().from(clients).where(eq(clients.id, record.clientId))
      const client = clientRows[0]
      if (client && record.bookingId) {
        await createOrAttachClient({
          email: client.email,
          name: client.name,
          phone: client.phone || null,
          source: 'consent_signed',
          bookingId: record.bookingId,
        })
      }
    } catch (clientErr) {
      console.error('Client attach failed (non-blocking):', clientErr.message)
    }

    // Send notification email to Hattie
    try {
      const { sendConsentSignedNotification } = await import('../../../../lib/email')
      const clientRows = await db.select().from(clients).where(eq(clients.id, record.clientId))
      const client = clientRows[0]
      if (client) {
        await sendConsentSignedNotification({
          clientName: client.name,
          clientEmail: client.email,
          documentType: doc?.documentType || record.documentId,
          signatoryName: signatoryName.trim(),
          signatoryRelationship: signatoryRelationship || 'self',
        })
      }
    } catch (emailErr) {
      console.error('Consent signed notification failed (non-blocking):', emailErr.message)
    }

    return NextResponse.json({ success: true, action: 'signed' })
  } catch (err) {
    console.error('Consent token POST error:', err)
    return NextResponse.json({ error: 'Failed to process consent form' }, { status: 500 })
  }
}