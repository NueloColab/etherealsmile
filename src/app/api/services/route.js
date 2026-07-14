import { db } from '../../../lib/db'
import { services } from '../../../lib/schema'
import { eq, asc } from 'drizzle-orm'
import { NextResponse } from 'next/server'

export async function GET() {
  try {
    const items = await db.select().from(services).orderBy(asc(services.sortOrder))
    return NextResponse.json(items)
  } catch (err) {
    console.error('Services GET error:', err)
    return NextResponse.json({ error: 'Failed to fetch services' }, { status: 500 })
  }
}

export async function POST(request) {
  try {
    const body = await request.json()
    await db.insert(services).values(body)
    return NextResponse.json({ success: true }, { status: 201 })
  } catch (err) {
    console.error('Services POST error:', err)
    return NextResponse.json({ error: 'Failed to create service' }, { status: 500 })
  }
}
