import { db } from '../../../lib/db'
import { dbAdmin } from '../../../lib/db-admin'
import { bookings, availability } from '../../../lib/schema'
import { eq, desc, and, sql } from 'drizzle-orm'
import { NextResponse } from 'next/server'
import { sendNewBookingNotification } from '../../../lib/email'

export async function POST(request) {
  try {
    const body = await request.json()
    const { name, email, phone, preferredDate, preferredTime, service, price, message, isMinor } = body

    if (!name || !email || !phone || !preferredDate || !preferredTime) {
      return NextResponse.json({ error: 'Name, email, phone, date and time are required' }, { status: 400 })
    }

    // Check availability
    const dateObj = new Date(preferredDate)
    const dateOnly = new Date(dateObj.getFullYear(), dateObj.getMonth(), dateObj.getDate())

    const dayBlocked = await db.select().from(availability).where(
      and(
        sql`date_trunc('day', ${availability.date}) = date_trunc('day', ${dateOnly}::timestamp)`,
        eq(availability.timeSlot, null)
      )
    )
    if (dayBlocked.length > 0) {
      return NextResponse.json({ error: 'This date is fully booked. Please select another date.' }, { status: 409 })
    }

    const slotBlocked = await db.select().from(availability).where(
      and(
        sql`date_trunc('day', ${availability.date}) = date_trunc('day', ${dateOnly}::timestamp)`,
        eq(availability.timeSlot, preferredTime)
      )
    )
    if (slotBlocked.length > 0) {
      return NextResponse.json({ error: 'This time slot is no longer available. Please select another slot.' }, { status: 409 })
    }

    const source = body.source || 'website'
    const bookingStatus = body.status || 'pending'

    const [newBooking] = await db.insert(bookings).values({
      name,
      email,
      phone: phone || null,
      isMinor: isMinor || false,
      date: preferredDate ? new Date(preferredDate) : null,
      timeSlot: preferredTime || null,
      service: service || null,
      price: price || null,
      message: message || null,
      status: bookingStatus,
      source,
      confirmedAt: bookingStatus === 'confirmed' ? new Date() : null,
    }).returning()

    // Auto-block availability for manual bookings (Booksy, phone, etc.)
    if (source !== 'website' && preferredDate && preferredTime) {
      await db.insert(availability).values({
        date: new Date(preferredDate),
        timeSlot: preferredTime,
        reason: `${source} booking — ${name}`,
      }).catch(() => {
        // Ignore duplicate block errors
      })
    }

    // Send notification email to Hattie (only for website bookings)
    let emailResult = null
    if (source === 'website') {
      emailResult = await sendNewBookingNotification({
        name,
        email,
        phone: phone || 'Not provided',
        preferredDate: preferredDate
          ? new Date(preferredDate).toLocaleDateString('en-GB', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })
          : 'Not specified',
        preferredTime: preferredTime || 'Not specified',
        service: service || 'Not specified',
        price: price || 'Not specified',
        message: message || 'None',
        isMinor: isMinor || false,
      })
    }

    return NextResponse.json({ success: true, data: newBooking, emailId: emailResult?.id || null }, { status: 201 })
  } catch (err) {
    console.error('Booking error:', err)
    return NextResponse.json({ error: 'Failed to create booking' }, { status: 500 })
  }
}

export async function GET(request) {
  try {
    const url = new URL(request.url)
    const limit = parseInt(url.searchParams.get('limit') || '200')
    const sort = url.searchParams.get('sort') || '-date'

    // Admin read: use direct connection for fresh data, newest booking date first
    const result = await dbAdmin.select().from(bookings).orderBy(desc(bookings.date)).limit(limit)

    return NextResponse.json(result)
  } catch (err) {
    console.error('Bookings GET error:', err)
    return NextResponse.json({ error: 'Failed to fetch bookings' }, { status: 500 })
  }
}