import { db } from '../../../lib/db-admin'
import { consentRecords, consentDocuments, clients } from '../../../lib/schema'
import { eq, desc } from 'drizzle-orm'
import { NextResponse } from 'next/server'
import { randomBytes } from 'crypto'

export async function GET(request) {
  try {
    const url = new URL(request.url)
    const clientId = url.searchParams.get('clientId')
    const bookingId = url.searchParams.get('bookingId')

    let query = db.select({
      id: consentRecords.id,
      clientId: consentRecords.clientId,
      bookingId: consentRecords.bookingId,
      documentId: consentRecords.documentId,
      documentType: consentDocuments.documentType,
      documentTitle: consentDocuments.title,
      documentVersion: consentDocuments.version,
      pdfUrl: consentDocuments.pdfUrl,
      status: consentRecords.status,
      signatoryName: consentRecords.signatoryName,
      signatoryRelationship: consentRecords.signatoryRelationship,
      sentAt: consentRecords.sentAt,
      viewedAt: consentRecords.viewedAt,
      signedAt: consentRecords.signedAt,
      declinedAt: consentRecords.declinedAt,
      expiresAt: consentRecords.expiresAt,
      createdAt: consentRecords.createdAt,
    })
    .from(consentRecords)
    .leftJoin(consentDocuments, eq(consentRecords.documentId, consentDocuments.id))

    if (clientId) {
      query = query.where(eq(consentRecords.clientId, Number(clientId)))
    }

    const records = await query.orderBy(desc(consentRecords.createdAt))
    return NextResponse.json(records)
  } catch (err) {
    console.error('Consent records GET error:', err)
    return NextResponse.json({ error: 'Failed to fetch consent records' }, { status: 500 })
  }
}

export async function POST(request) {
  try {
    const body = await request.json()
    const { clientId, bookingId, documentType, sendEmail = true } = body

    if (!clientId || !documentType) {
      return NextResponse.json({ error: 'clientId and documentType are required' }, { status: 400 })
    }

    // Find the active document
    const docs = await db.select().from(consentDocuments)
      .where(eq(consentDocuments.documentType, documentType))

    const doc = docs.find(d => d.active)
    if (!doc) {
      return NextResponse.json({ error: 'Document type not found or inactive' }, { status: 404 })
    }

    // Get client info for email
    const clientRows = await db.select().from(clients).where(eq(clients.id, Number(clientId)))
    const client = clientRows[0]
    if (!client) {
      return NextResponse.json({ error: 'Client not found' }, { status: 404 })
    }

    // Create token
    const token = randomBytes(32).toString('hex')
    const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000) // 7 days

    // Insert consent record
    const result = await db.insert(consentRecords).values({
      clientId: Number(clientId),
      bookingId: bookingId ? Number(bookingId) : null,
      documentId: doc.id,
      status: 'sent',
      acceptToken: token,
      expiresAt,
      responses: {},
      sentAt: new Date(),
    }).returning({ id: consentRecords.id, acceptToken: consentRecords.acceptToken })

    // Send email
    if (sendEmail) {
      try {
        const { sendConsentRequestEmail } = await import('../../../lib/email')
        await sendConsentRequestEmail({
          to: client.email,
          name: client.name,
          documentType: doc.documentType,
          documentTitle: doc.title,
          pdfUrl: doc.pdfUrl,
          token,
        })
      } catch (emailErr) {
        console.error('Consent email failed (non-blocking):', emailErr.message)
      }
    }

    return NextResponse.json({ success: true, id: result[0].id, token: result[0].acceptToken })
  } catch (err) {
    console.error('Consent records POST error:', err)
    return NextResponse.json({ error: 'Failed to create consent record' }, { status: 500 })
  }
}