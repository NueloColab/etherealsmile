import { db } from '../../../../lib/db'
import { services } from '../../../../lib/schema'
import { eq } from 'drizzle-orm'
import { NextResponse } from 'next/server'

export async function PUT(request, { params }) {
  try {
    const { id } = params
    const body = await request.json()
    await db.update(services).set(body).where(eq(services.id, Number(id)))
    return NextResponse.json({ success: true })
  } catch (err) {
    console.error('Services PUT error:', err)
    return NextResponse.json({ error: 'Failed to update service' }, { status: 500 })
  }
}

export async function DELETE(request, { params }) {
  try {
    const { id } = params
    await db.delete(services).where(eq(services.id, Number(id)))
    return NextResponse.json({ success: true })
  } catch (err) {
    console.error('Services DELETE error:', err)
    return NextResponse.json({ error: 'Failed to delete service' }, { status: 500 })
  }
}
