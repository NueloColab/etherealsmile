import { getServerSession } from 'next-auth/next'
import { authOptions } from '../../../api/auth/[...nextauth]/route'
import { redirect } from 'next/navigation'
import { db } from '../../../../lib/db'
import { enquiries } from '../../../../lib/schema'
import { eq } from 'drizzle-orm'
import EnquiryDetailClient from './EnquiryDetailClient'

export default async function AdminEnquiryDetail({ params }) {
  const session = await getServerSession(authOptions)
  if (!session) redirect('/admin/login')

  const items = await db.select().from(enquiries).where(eq(enquiries.id, Number(params.id)))
  const enquiry = items[0]

  if (!enquiry) {
    redirect('/admin/enquiries')
  }

  return <EnquiryDetailClient enquiry={enquiry} />
}
