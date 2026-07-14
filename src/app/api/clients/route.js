import { dbAdmin as db } from '../../../lib/db-admin'
import { clients, bookings } from '../../../lib/schema'
import { eq, desc, sql } from 'drizzle-orm'
import { NextResponse } from 'next/server'

export async function GET() {
  try {
    const result = await db.select({
      id: clients.id,
      name: clients.name,
      email: clients.email,
      phone: clients.phone,
      instagram: clients.instagram,
      marketingConsent: clients.marketingConsent,
      source: clients.source,
      createdAt: clients.createdAt,
      bookingCount: sql`COUNT(${bookings.id})`,
    })
    .from(clients)
    .leftJoin(bookings, eq(clients.id, bookings.clientId))
    .groupBy(clients.id)
    .orderBy(desc(clients.createdAt))

    return NextResponse.json(result)
  } catch (err) {
    console.error('Clients GET error:', err)
    return NextResponse.json({ error: 'Failed to fetch clients' }, { status: 500 })
  }
}