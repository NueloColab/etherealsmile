import { db } from '../../../../lib/db'
import { clients, bookings } from '../../../../lib/schema'
import { eq, desc } from 'drizzle-orm'
import { NextResponse } from 'next/server'

export async function GET(request, { params }) {
  try {
    const clientRows = await db.select().from(clients)
      .where(eq(clients.id, Number(params.id)))

    const client = clientRows[0]
    if (!client) {
      return NextResponse.json({ error: 'Client not found' }, { status: 404 })
    }

    const clientBookings = await db.select().from(bookings)
      .where(eq(bookings.clientId, client.id))
      .orderBy(desc(bookings.createdAt))

    return NextResponse.json({ ...client, bookings: clientBookings })
  } catch (err) {
    console.error('Client GET error:', err)
    return NextResponse.json({ error: 'Failed to fetch client' }, { status: 500 })
  }
}