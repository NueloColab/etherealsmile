import { db } from '../../../../lib/db'
import { invoices } from '../../../../lib/schema'
import { eq } from 'drizzle-orm'
import { NextResponse } from 'next/server'

export async function GET(request, { params }) {
  try {
    const { id } = await params
    const rows = await db.select().from(invoices).where(eq(invoices.id, parseInt(id)))
    if (rows.length === 0) {
      return NextResponse.json({ error: 'Invoice not found' }, { status: 404 })
    }
    return NextResponse.json(rows[0])
  } catch (err) {
    console.error('Invoice GET by ID error:', err)
    return NextResponse.json({ error: 'Failed to fetch invoice' }, { status: 500 })
  }
}

export async function PATCH(request, { params }) {
  try {
    const { id } = await params
    const body = await request.json()

    const updateData = {}
    if (body.customerName !== undefined) updateData.customerName = body.customerName
    if (body.customerEmail !== undefined) updateData.customerEmail = body.customerEmail
    if (body.amount !== undefined) updateData.amount = String(body.amount)
    if (body.status !== undefined) updateData.status = body.status
    if (body.dueDate !== undefined) updateData.dueDate = body.dueDate ? new Date(body.dueDate) : null
    if (body.status === 'paid') updateData.paidAt = new Date()

    const result = await db
      .update(invoices)
      .set(updateData)
      .where(eq(invoices.id, parseInt(id)))
      .returning()

    if (result.length === 0) {
      return NextResponse.json({ error: 'Invoice not found' }, { status: 404 })
    }
    return NextResponse.json(result[0])
  } catch (err) {
    console.error('Invoice PATCH error:', err)
    return NextResponse.json({ error: 'Failed to update invoice' }, { status: 500 })
  }
}

export async function DELETE(request, { params }) {
  try {
    const { id } = await params
    await db.delete(invoices).where(eq(invoices.id, parseInt(id)))
    return NextResponse.json({ success: true })
  } catch (err) {
    console.error('Invoice DELETE error:', err)
    return NextResponse.json({ error: 'Failed to delete invoice' }, { status: 500 })
  }
}