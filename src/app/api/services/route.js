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
    const result = await db.insert(services).values({
      name: body.name,
      description: body.description || null,
      price: body.price || null,
      duration: body.duration || null,
      image: body.image || null,
      sortOrder: body.sortOrder || 0,
      active: body.active !== undefined ? body.active : true,
    }).returning()
    return NextResponse.json(result[0], { status: 201 })
  } catch (err) {
    console.error('Services POST error:', err)
    return NextResponse.json({ error: 'Failed to create service' }, { status: 500 })
  }
}
