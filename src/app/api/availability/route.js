import { NextResponse } from 'next/server'
import { db } from '../../../lib/db'
import { availability } from '../../../lib/schema'
import { eq, gte } from 'drizzle-orm'

export const dynamic = 'force-dynamic'

export async function GET() {
  try {
    const rows = await db.select().from(availability).orderBy(availability.date)
    return NextResponse.json({ success: true, data: rows })
  } catch (error) {
    console.error('Availability GET error:', error)
    return NextResponse.json({ success: false, error: error.message }, { status: 500 })
  }
}

export async function POST(req) {
  try {
    const body = await req.json()
    const { date, timeSlot, reason } = body

    if (!date) {
      return NextResponse.json({ success: false, error: 'Date is required' }, { status: 400 })
    }

    const [row] = await db.insert(availability).values({
      date: new Date(date),
      timeSlot: timeSlot || null,
      reason: reason || null,
    }).returning()

    return NextResponse.json({ success: true, data: row })
  } catch (error) {
    console.error('Availability POST error:', error)
    return NextResponse.json({ success: false, error: error.message }, { status: 500 })
  }
}
