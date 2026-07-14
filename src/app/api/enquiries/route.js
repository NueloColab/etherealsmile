import { db } from '../../../lib/db'
import { enquiries } from '../../../lib/schema'
import { NextResponse } from 'next/server'

export async function POST(request) {
  try {
    const body = await request.json()
    const { name, email, phone, message } = body

    if (!name || !email || !message) {
      return NextResponse.json({ error: 'Name, email and message are required' }, { status: 400 })
    }

    await db.insert(enquiries).values({
      name,
      email,
      phone: phone || null,
      preferredDate: null,
      message,
      status: 'pending',
    })

    return NextResponse.json({ success: true }, { status: 201 })
  } catch (err) {
    console.error('Enquiry error:', err)
    return NextResponse.json({ error: 'Failed to send enquiry' }, { status: 500 })
  }
}