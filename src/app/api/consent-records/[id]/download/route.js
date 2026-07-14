import { dbAdmin as db } from '../../../../../lib/db-admin'
import { consentRecords, consentDocuments } from '../../../../../lib/schema'
import { eq } from 'drizzle-orm'
import { NextResponse } from 'next/server'
import { getConsentPdfSignedUrl } from '../../../../../lib/uploadConsentPdf'
import { getServerSession } from 'next-auth/next'
import { authOptions } from '../../../auth/[...nextauth]/route'

/**
 * GET /api/consent-records/[id]/download
 *
 * Mint a short-lived signed URL for downloading a signed consent PDF.
 * Admin-only. Only works for signed records with a PDF stored.
 */
export async function GET(request, { params }) {
  try {
    // Admin auth check
    const session = await getServerSession(authOptions)
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const id = Number(params.id)

    // Fetch the record
    const rows = await db.select({
      id: consentRecords.id,
      status: consentRecords.status,
      signedPdfUrl: consentRecords.signedPdfUrl,
      documentType: consentDocuments.documentType,
    })
    .from(consentRecords)
    .leftJoin(consentDocuments, eq(consentRecords.documentId, consentDocuments.id))
    .where(eq(consentRecords.id, id))

    const record = rows[0]
    if (!record) {
      return NextResponse.json({ error: 'Consent record not found' }, { status: 404 })
    }

    // Guard: must be signed with a PDF
    if (record.status !== 'signed') {
      return NextResponse.json({ error: 'Consent form not yet signed', status: record.status }, { status: 403 })
    }

    if (!record.signedPdfUrl) {
      return NextResponse.json({ error: 'No signed PDF available for this record' }, { status: 404 })
    }

    // Mint signed URL (5 minute expiry)
    const downloadUrl = getConsentPdfSignedUrl(record.signedPdfUrl, 300)

    return NextResponse.json({ downloadUrl, documentType: record.documentType })

  } catch (err) {
    console.error('[CONSENT DOWNLOAD] Error:', err)
    return NextResponse.json({ error: 'Failed to generate download link' }, { status: 500 })
  }
}