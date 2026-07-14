import { db } from '../../../../lib/db'
import { enquiries } from '../../../../lib/schema'
import { eq } from 'drizzle-orm'
import { notFound } from 'next/navigation'
import BookingConfirmClient from './BookingConfirmClient'

export const metadata = {
  title: 'Confirm Your Booking | Ethereal Smile',
}

export default async function BookingConfirm({ params, searchParams }) {
  const { token } = params
  const action = searchParams?.action

  const items = await db.select().from(enquiries).where(eq(enquiries.proposalToken, token))
  const enquiry = items[0]

  if (!enquiry) {
    notFound()
  }

  // Check if expired
  const isExpired = enquiry.proposalExpiresAt && new Date() > new Date(enquiry.proposalExpiresAt)

  return (
    <BookingConfirmClient
      enquiry={enquiry}
      action={action}
      isExpired={isExpired}
      token={token}
    />
  )
}
