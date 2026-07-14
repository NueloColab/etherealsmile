import { db } from '../../../lib/db'
import { dbAdmin } from '../../../lib/db-admin'
import { bookings } from '../../../lib/schema'
import { eq, desc } from 'drizzle-orm'
import { NextResponse } from 'next/server'
import { sendNewBookingNotification } from '../../../lib/email'

export async function POST(request) {
  try {
    const body = await request.json()
    const { name, email, phone, preferredDate, preferredTime, service, price, message, isMinor } = body

    if (!name || !email || !phone || !preferredDate || !preferredTime) {
      return NextResponse.json({ error: 'Name, email, phone, date and time are required' }, { status: 400 })
    }

    await db.insert(bookings).values({
      name,
      email,
      phone: phone || null,
      isMinor: isMinor || false,
      date: preferredDate ? new Date(preferredDate) : null,
      timeSlot: preferredTime || null,
      service: service || null,
      price: price || null,
      message: message || null,
      status: 'pending',
    })

    // Send notification email to Hattie
    const emailResult = await sendNewBookingNotification({
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

    return NextResponse.json({ success: true, emailId: emailResult?.id || null }, { status: 201 })
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