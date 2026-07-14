import { db } from '../../../lib/db'
import { enquiries } from '../../../lib/schema'
import { NextResponse } from 'next/server'

export async function POST(request) {
  try {
    const body = await request.json()
    const { name, email, phone, preferredDate, preferredTime, service, price, message } = body

    if (!name || !email) {
      return NextResponse.json({ error: 'Name and email are required' }, { status: 400 })
    }

    await db.insert(enquiries).values({
      name,
      email,
      phone: phone || null,
      preferredDate: preferredDate ? new Date(preferredDate) : null,
      preferredTime: preferredTime || null,
      service: service || null,
      price: price || null,
      message: message || null,
      status: 'pending',
    })

    return NextResponse.json({ success: true }, { status: 201 })
  } catch (err) {
    console.error('Enquiry error:', err)
    return NextResponse.json({ error: 'Failed to create enquiry' }, { status: 500 })
  }
}
