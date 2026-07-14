import { dbAdmin as db } from './db-admin'
import { consentRecords, consentDocuments, clients } from './schema'
import { eq, and, inArray } from 'drizzle-orm'
import { randomBytes } from 'crypto'

/**
 * Send consent forms to a client for a booking.
 * Adults get: consent + consultation
 * Minors get: guardian_consent + consultation
 * Aftercare is NEVER auto-sent.
 *
 * DUPLICATE GUARD: skips if a record already exists with status sent, viewed, or signed
 * for this client + booking + documentType. Only re-sends if the prior record was declined or expired.
 *
 * @param {number} clientId - The client ID
 * @param {number} bookingId - The booking ID
 * @param {boolean} isMinor - Whether the booking is for someone under 18
 * @returns {Promise<{sent: string[], skipped: string[], error?: string}>}
 */
export async function sendConsentForms({ clientId, bookingId, isMinor }) {
  const documentTypes = isMinor
    ? ['guardian_consent', 'consultation']
    : ['consent', 'consultation']

  const sent = []
  const skipped = []
  let error = null

  for (const documentType of documentTypes) {
    try {
      // Find the active document for this type
      const docs = await db.select().from(consentDocuments)
        .where(and(
          eq(consentDocuments.documentType, documentType),
          eq(consentDocuments.active, true)
        ))

      const doc = docs[0]
      if (!doc) {
        console.error('[CONSENT] No active document found for type:', documentType)
        skipped.push(documentType)
        continue
      }

      // Duplicate guard: check if a record already exists with status sent, viewed, or signed
      const existing = await db.select({ id: consentRecords.id, status: consentRecords.status })
        .from(consentRecords)
        .where(and(
          eq(consentRecords.clientId, clientId),
          eq(consentRecords.bookingId, bookingId),
          eq(consentRecords.documentId, doc.id),
          inArray(consentRecords.status, ['sent', 'viewed', 'signed'])
        ))

      if (existing.length > 0) {
        skipped.push(documentType + ' (already ' + existing[0].status + ')')
        console.log('[CONSENT] Skipping', documentType, '- record already exists with status:', existing[0].status)
        continue
      }

      // Get client info for email
      const clientRows = await db.select().from(clients).where(eq(clients.id, clientId))
      const client = clientRows[0]
      if (!client) {
        console.error('[CONSENT] Client not found:', clientId)
        skipped.push(documentType + ' (client not found)')
        continue
      }

      // Create token and record
      const token = randomBytes(32).toString('hex')
      const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000) // 7 days

      await db.insert(consentRecords).values({
        clientId,
        bookingId,
        documentId: doc.id,
        status: 'sent',
        acceptToken: token,
        expiresAt,
        responses: {},
        sentAt: new Date(),
      })

      // Send email (non-blocking within this loop - don't let email failure stop the other form)
      try {
        const { sendConsentRequestEmail } = await import('./email')
        await sendConsentRequestEmail({
          to: client.email,
          name: client.name,
          documentType: doc.documentType,
          documentTitle: doc.title,
          pdfUrl: doc.pdfUrl,
          token,
        })
      } catch (emailErr) {
        console.error('[CONSENT] Email failed for', documentType, ':', emailErr.message)
        // Record was created but email didn't send - client can still access via token
        // The admin can resend later
      }

      sent.push(documentType)
      console.log('[CONSENT] Sent', documentType, 'to', client.email, '(minor:', isMinor, ')')

    } catch (err) {
      console.error('[CONSENT] Error sending', documentType, ':', err)
      error = err.message
      skipped.push(documentType + ' (error: ' + err.message + ')')
    }
  }

  return { sent, skipped, error }
}