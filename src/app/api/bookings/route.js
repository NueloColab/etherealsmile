import { db } from '../../../lib/db'
import { bookings } from '../../../lib/schema'
import { NextResponse } from 'next/server'
import { sendNewBookingNotification } from '../../../lib/email'

export async function POST(request) {
  try {
    const body = await request.json()
    const { name, email, phone, preferredDate, preferredTime, service, price, message } = body

    if (!name || !email || !phone || !preferredDate || !preferredTime) {
      return NextResponse.json({ error: 'Name, email, phone, date and time are required' }, { status: 400 })
    }

    await db.insert(bookings).values({
      name,
      email,
      phone: phone || null,
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
    const sort = url.searchParams.get('sort') || '-createdAt'

    const orderBy = sort.startsWith('-')
      ? { column: bookings.createdAt, order: 'desc' }
      : { column: bookings.createdAt, order: 'asc' }

    const result = await db.select().from(bookings).orderBy(bookings.createdAt).limit(limit)

    return NextResponse.json(result)
  } catch (err) {
    console.error('Bookings GET error:', err)
    return NextResponse.json({ error: 'Failed to fetch bookings' }, { status: 500 })
  }
}