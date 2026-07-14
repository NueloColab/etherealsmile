import { db } from '../../../lib/db'
import { invoices } from '../../../lib/schema'
import { eq, desc } from 'drizzle-orm'
import { NextResponse } from 'next/server'

export async function GET() {
  try {
    const all = await db.select().from(invoices).orderBy(desc(invoices.createdAt))
    return NextResponse.json(all)
  } catch (err) {
    console.error('Invoices GET error:', err)
    return NextResponse.json({ error: 'Failed to fetch invoices' }, { status: 500 })
  }
}

export async function POST(request) {
  try {
    const body = await request.json()
    const { customerName, customerEmail, amount, dueDate, status } = body

    if (!customerName || !customerEmail || !amount) {
      return NextResponse.json({ error: 'Customer name, email, and amount are required' }, { status: 400 })
    }

    const result = await db.insert(invoices).values({
      customerName,
      customerEmail,
      amount: String(amount),
      status: status || 'draft',
      dueDate: dueDate ? new Date(dueDate) : null,
    }).returning()

    return NextResponse.json(result[0], { status: 201 })
  } catch (err) {
    console.error('Invoice POST error:', err)
    return NextResponse.json({ error: 'Failed to create invoice' }, { status: 500 })
  }
}