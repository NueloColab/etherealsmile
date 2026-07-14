import { db } from '../../../lib/db-admin'
import { consentDocuments } from '../../../lib/schema'
import { eq } from 'drizzle-orm'
import { NextResponse } from 'next/server'

export async function GET() {
  try {
    const docs = await db.select().from(consentDocuments).where(eq(consentDocuments.active, true))
    return NextResponse.json(docs)
  } catch (err) {
    console.error('Consent documents GET error:', err)
    return NextResponse.json({ error: 'Failed to fetch consent documents' }, { status: 500 })
  }
}