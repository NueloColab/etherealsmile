import { getServerSession } from 'next-auth/next'
import { authOptions } from '../api/auth/[...nextauth]/route'
import { redirect } from 'next/navigation'
import { dbAdmin as db } from '../../lib/db-admin'
import { bookings, clients, consentRecords, consentDocuments, enquiries, blogPosts, galleryItems, services } from '../../lib/schema'
import { sql, desc, eq, and, gte } from 'drizzle-orm'
import DashboardClient from '../../components/DashboardClient'

export default async function AdminDashboard() {
  const session = await getServerSession(authOptions)
  if (!session) redirect('/admin/login')

  // --- Stats queries ---

  // Booking counts by status
  const bookingCounts = await db.select({
    status: bookings.status,
    count: sql`count(*)`,
  }).from(bookings).groupBy(bookings.status)

  const pendingBookings = Number(bookingCounts.find(r => r.status === 'pending')?.count || 0)
  const confirmedBookingsTotal = Number(bookingCounts.find(r => r.status === 'confirmed')?.count || 0)

  // Confirmed upcoming (date >= today)
  const today = new Date()
  today.setHours(0, 0, 0, 0)
  const confirmedUpcoming = await db.select({ count: sql`count(*)` })
    .from(bookings)
    .where(and(eq(bookings.status, 'confirmed'), gte(bookings.date, today)))
  const confirmedUpcomingCount = Number(confirmedUpcoming[0]?.count || 0)

  // Revenue: sum confirmed booking prices (parsed from varchar)
  const confirmedBookings = await db.select({ price: bookings.price })
    .from(bookings)
    .where(eq(bookings.status, 'confirmed'))

  const revenue = confirmedBookings.reduce((sum, b) => {
    if (!b.price) return sum
    const num = parseFloat(b.price.replace(/[£,\s]/g, '')) || 0
    return sum + num
  }, 0)

  // Client count
  const clientCount = await db.select({ count: sql`count(*)` }).from(clients)
  const totalClients = Number(clientCount[0]?.count || 0)

  // Consent records by status
  const consentCounts = await db.select({
    status: consentRecords.status,
    count: sql`count(*)`,
  }).from(consentRecords).groupBy(consentRecords.status)

  const consentPending = Number(consentCounts.find(r => r.status === 'sent' || r.status === 'viewed')?.count || 0)
  const consentSigned = Number(consentCounts.find(r => r.status === 'signed')?.count || 0)

  // Enquiries count
  const enquiryCount = await db.select({ count: sql`count(*)` }).from(enquiries)
  const totalEnquiries = Number(enquiryCount[0]?.count || 0)

  // Journal posts count
  const postCount = await db.select({ count: sql`count(*)` }).from(blogPosts)
  const totalPosts = Number(postCount[0]?.count || 0)

  // --- Recent data ---

  // Recent bookings (last 10)
  const recentBookings = await db.select()
    .from(bookings)
    .orderBy(desc(bookings.createdAt))
    .limit(10)

  // Upcoming bookings (today + next 7 days)
  const nextWeek = new Date(today)
  nextWeek.setDate(nextWeek.getDate() + 7)
  const upcomingBookings = await db.select()
    .from(bookings)
    .where(and(
      eq(bookings.status, 'confirmed'),
      gte(bookings.date, today)
    ))
    .orderBy(bookings.date)
    .limit(20)

  // Calendar bookings (pending + confirmed, for dot indicators)
  const calendarBookings = await db.select()
    .from(bookings)
    .where(sql`${bookings.status} IN ('pending', 'confirmed')`)
    .orderBy(bookings.date)

  // Recent consent records with client name and document type (last 10)
  const recentConsent = await db.select({
    id: consentRecords.id,
    clientId: consentRecords.clientId,
    bookingId: consentRecords.bookingId,
    documentType: consentDocuments.documentType,
    status: consentRecords.status,
    signatoryName: consentRecords.signatoryName,
    sentAt: consentRecords.sentAt,
    signedAt: consentRecords.signedAt,
    clientName: clients.name,
  })
    .from(consentRecords)
    .leftJoin(consentDocuments, eq(consentRecords.documentId, consentDocuments.id))
    .leftJoin(clients, eq(consentRecords.clientId, clients.id))
    .orderBy(desc(consentRecords.createdAt))
    .limit(10)

  // Recent enquiries (last 5)
  const recentEnquiries = await db.select()
    .from(enquiries)
    .orderBy(desc(enquiries.createdAt))
    .limit(5)

  const stats = {
    pendingBookings,
    confirmedUpcoming: confirmedUpcomingCount,
    totalClients,
    consentPending,
    consentSigned,
    totalEnquiries,
    totalPosts,
    revenue,
  }

  return (
    <DashboardClient
      stats={stats}
      recentBookings={recentBookings}
      upcomingBookings={upcomingBookings}
      calendarBookings={calendarBookings}
      recentConsent={recentConsent}
      recentEnquiries={recentEnquiries}
    />
  )
}