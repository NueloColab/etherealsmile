import { db } from '../../../../lib/db'
import { bookings } from '../../../../lib/schema'
import { eq } from 'drizzle-orm'
import BookingDetailClient from './BookingDetailClient'

export const dynamic = 'force-dynamic'

export default async function BookingDetailPage({ params }) {
  const { id } = await params
  const items = await db.select().from(bookings).where(eq(bookings.id, Number(id)))
  const booking = items[0] || null

  return <BookingDetailClient booking={booking} />
}