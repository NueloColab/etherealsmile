import { dbAdmin as db } from '../../../../lib/db-admin'
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

export async function PUT(request, { params }) {
  try {
    const body = await request.json()
    const update = {}

    // Editable fields only — never touch source or createdAt
    if (body.name !== undefined) update.name = body.name
    if (body.email !== undefined) update.email = body.email.toLowerCase().trim()
    if (body.phone !== undefined) update.phone = body.phone
    if (body.instagram !== undefined) update.instagram = body.instagram
    if (body.notes !== undefined) update.notes = body.notes
    if (body.marketingConsent !== undefined) update.marketingConsent = body.marketingConsent

    if (Object.keys(update).length === 0) {
      return NextResponse.json({ error: 'No fields to update' }, { status: 400 })
    }

    await db.update(clients).set(update).where(eq(clients.id, Number(params.id)))
    const updated = await db.select().from(clients).where(eq(clients.id, Number(params.id)))
    if (!updated[0]) {
      return NextResponse.json({ error: 'Client not found' }, { status: 404 })
    }
    return NextResponse.json(updated[0])
  } catch (err) {
    // Handle unique violation on email (Drizzle wraps Postgres error in e.cause)
    const pgError = err.cause || err
    if (pgError.code === '23505' || pgError.message?.includes('unique') || pgError.message?.includes('duplicate')) {
      return NextResponse.json({ error: 'EMAIL_EXISTS', message: 'A client with this email already exists' }, { status: 409 })
    }
    console.error('Client PUT error:', err)
    return NextResponse.json({ error: 'Failed to update client' }, { status: 500 })
  }
}

export async function DELETE(request, { params }) {
  try {
    const clientRows = await db.select().from(clients)
      .where(eq(clients.id, Number(params.id)))

    if (!clientRows[0]) {
      return NextResponse.json({ error: 'Client not found' }, { status: 404 })
    }

    // ON DELETE SET NULL blanks clientId on linked bookings automatically
    await db.delete(clients).where(eq(clients.id, Number(params.id)))
    return NextResponse.json({ success: true, deleted: clientRows[0].name })
  } catch (err) {
    console.error('Client DELETE error:', err)
    return NextResponse.json({ error: 'Failed to delete client' }, { status: 500 })
  }
}