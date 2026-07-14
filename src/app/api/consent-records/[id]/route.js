import { db } from '../../../../lib/db-admin'
import { consentRecords, consentDocuments } from '../../../../lib/schema'
import { eq } from 'drizzle-orm'
import { NextResponse } from 'next/server'

export async function GET(request, { params }) {
  try {
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
      signatoryName: consentRecords.signatoryName,
      signatoryRelationship: consentRecords.signatoryRelationship,
      responses: consentRecords.responses,
      sentAt: consentRecords.sentAt,
      viewedAt: consentRecords.viewedAt,
      signedAt: consentRecords.signedAt,
      declinedAt: consentRecords.declinedAt,
      expiresAt: consentRecords.expiresAt,
      createdAt: consentRecords.createdAt,
    })
    .from(consentRecords)
    .leftJoin(consentDocuments, eq(consentRecords.documentId, consentDocuments.id))
    .where(eq(consentRecords.id, Number(params.id)))

    const record = items[0]
    if (!record) {
      return NextResponse.json({ error: 'Consent record not found' }, { status: 404 })
    }

    return NextResponse.json(record)
  } catch (err) {
    console.error('Consent record GET error:', err)
    return NextResponse.json({ error: 'Failed to fetch consent record' }, { status: 500 })
  }
}