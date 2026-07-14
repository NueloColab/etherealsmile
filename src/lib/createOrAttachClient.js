import { db } from './db'
import { clients, bookings } from './schema'
import { eq } from 'drizzle-orm'

/**
 * Find or create a client by email. Attach booking if bookingId provided.
 * - Email is normalised (lowercase + trim) on BOTH lookup and insert
 * - If found: merge blank fields only, never overwrite existing data
 * - If not found: insert new client with marketingConsent=false
 * - UNIQUE constraint on email is the backstop
 */
export async function createOrAttachClient({ email, name, phone, source, bookingId }) {
  const normalisedEmail = email.toLowerCase().trim()

  const existing = await db.select().from(clients)
    .where(eq(clients.email, normalisedEmail))

  if (existing.length > 0) {
    const client = existing[0]

    // Merge blank fields only — never overwrite existing data
    const merge = {}
    if (!client.name && name) merge.name = name
    if (!client.phone && phone) merge.phone = phone

    if (Object.keys(merge).length > 0) {
      await db.update(clients).set(merge).where(eq(clients.id, client.id))
    }

    // Attach booking if provided
    if (bookingId) {
      await db.update(bookings).set({ clientId: client.id })
        .where(eq(bookings.id, bookingId))
    }

    return client.id
  }

  // Insert new client — email stored normalised
  const result = await db.insert(clients).values({
    name: name || '',
    email: normalisedEmail,
    phone: phone || null,
    marketingConsent: false,
    source,
  }).returning({ id: clients.id })

  const clientId = result[0].id

  // Attach booking if provided
  if (bookingId) {
    await db.update(bookings).set({ clientId })
      .where(eq(bookings.id, bookingId))
  }

  return clientId
}