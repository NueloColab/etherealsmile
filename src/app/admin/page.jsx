import { getServerSession } from 'next-auth/next'
import { authOptions } from '../api/auth/[...nextauth]/route'
import { redirect } from 'next/navigation'
import { db } from '../../lib/db'
import { enquiries, blogPosts, galleryItems, services } from '../../lib/schema'
import { sql } from 'drizzle-orm'
import Link from 'next/link'

export default async function AdminDashboard() {
  const session = await getServerSession(authOptions)
  if (!session) redirect('/admin/login')

  const enquiryCount = await db.select({ count: sql`count(*)` }).from(enquiries)
  const postCount = await db.select({ count: sql`count(*)` }).from(blogPosts)
  const galleryCount = await db.select({ count: sql`count(*)` }).from(galleryItems)
  const serviceCount = await db.select({ count: sql`count(*)` }).from(services)

  const recentEnquiries = await db
    .select()
    .from(enquiries)
    .orderBy(sql`${enquiries.createdAt} desc`)
    .limit(5)

  const stats = [
    { label: 'Enquiries', count: enquiryCount[0]?.count || 0, href: '/admin/enquiries', color: '#e94480' },
    { label: 'Journal Posts', count: postCount[0]?.count || 0, href: '/admin/blog', color: '#c9a96e' },
    { label: 'Gallery Items', count: galleryCount[0]?.count || 0, href: '/admin/gallery', color: '#e94480' },
    { label: 'Services', count: serviceCount[0]?.count || 0, href: '/admin/services', color: '#c9a96e' },
  ]

  return (
    <div style={{ padding: '2.5rem 2rem', maxWidth: '1100px' }}>
      {/* Header */}
      <div style={{ marginBottom: '2.5rem' }}>
        <h1
          style={{
            fontFamily: "'Pirata One', 'Playfair Display', cursive",
            fontSize: 'clamp(1.5rem, 3vw, 2.2rem)',
            color: '#e94480',
            letterSpacing: '0.08em',
            textTransform: 'uppercase',
            marginBottom: '0.25rem',
          }}
        >
          Dashboard
        </h1>
        <p style={{ fontSize: '0.85rem', color: 'rgba(255,255,255,0.4)' }}>
          Welcome back, {session?.user?.name || session?.user?.email}
        </p>
      </div>

      {/* Stats Grid */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))',
          gap: '1.25rem',
          marginBottom: '2.5rem',
        }}
      >
        {stats.map((stat) => (
          <Link
            key={stat.label}
            href={stat.href}
            style={{ textDecoration: 'none' }}
          >
            <div
              style={{
                background: 'rgba(255,255,255,0.03)',
                border: '1px solid rgba(255,255,255,0.06)',
                borderRadius: '14px',
                padding: '1.75rem 1.5rem',
                textAlign: 'center',
                transition: 'all 0.3s ease',
                cursor: 'pointer',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.borderColor = 'rgba(233, 68, 128, 0.25)'
                e.currentTarget.style.transform = 'translateY(-3px)'
                e.currentTarget.style.boxShadow = '0 8px 24px rgba(233, 68, 128, 0.08)'
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.borderColor = 'rgba(255,255,255,0.06)'
                e.currentTarget.style.transform = 'translateY(0)'
                e.currentTarget.style.boxShadow = 'none'
              }}
            >
              <p
                style={{
                  fontFamily: "'Pirata One', 'Playfair Display', cursive",
                  fontSize: '2.5rem',
                  color: stat.color,
                  marginBottom: '0.5rem',
                  lineHeight: 1,
                }}
              >
                {stat.count}
              </p>
              <p
                style={{
                  fontFamily: "'Inter', sans-serif",
                  fontSize: '0.7rem',
                  letterSpacing: '0.15em',
                  textTransform: 'uppercase',
                  color: 'rgba(255,255,255,0.5)',
                  fontWeight: 500,
                }}
              >
                {stat.label}
              </p>
            </div>
          </Link>
        ))}
      </div>

      {/* Recent Enquiries */}
      <div
        style={{
          background: 'rgba(255,255,255,0.02)',
          border: '1px solid rgba(255,255,255,0.06)',
          borderRadius: '14px',
          padding: '1.75rem 2rem',
        }}
      >
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            marginBottom: '1.5rem',
          }}
        >
          <h2
            style={{
              fontFamily: "'Pirata One', 'Playfair Display', cursive",
              fontSize: '1.15rem',
              color: '#e94480',
              fontWeight: 400,
              letterSpacing: '0.05em',
            }}
          >
            Recent Enquiries
          </h2>
          <Link
            href="/admin/enquiries"
            style={{
              fontSize: '0.7rem',
              color: '#e94480',
              textDecoration: 'none',
              letterSpacing: '0.1em',
              textTransform: 'uppercase',
              fontWeight: 500,
            }}
          >
            View All →
          </Link>
        </div>

        {recentEnquiries.length > 0 ? (
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.85rem' }}>
              <thead>
                <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.08)' }}>
                  {['Name', 'Email', 'Service', 'Date', 'Status'].map((h) => (
                    <th
                      key={h}
                      style={{
                        textAlign: 'left',
                        padding: '0.75rem 0.5rem',
                        fontFamily: "'Inter', sans-serif",
                        fontSize: '0.65rem',
                        letterSpacing: '0.12em',
                        textTransform: 'uppercase',
                        color: 'rgba(255,255,255,0.35)',
                        fontWeight: 500,
                      }}
                    >
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {recentEnquiries.map((e) => (
                  <tr
                    key={e.id}
                    style={{ borderBottom: '1px solid rgba(255,255,255,0.04)' }}
                  >
                    <td style={{ padding: '0.85rem 0.5rem', color: 'rgba(255,255,255,0.85)' }}>{e.name}</td>
                    <td style={{ padding: '0.85rem 0.5rem', color: 'rgba(255,255,255,0.55)' }}>{e.email}</td>
                    <td style={{ padding: '0.85rem 0.5rem', color: 'rgba(255,255,255,0.55)' }}>
                      {e.service || '-'}
                    </td>
                    <td style={{ padding: '0.85rem 0.5rem', color: 'rgba(255,255,255,0.55)' }}>
                      {e.preferredDate
                        ? new Date(e.preferredDate).toLocaleDateString('en-GB')
                        : '-'}
                    </td>
                    <td style={{ padding: '0.85rem 0.5rem' }}>
                      <span
                        style={{
                          display: 'inline-block',
                          padding: '0.25rem 0.6rem',
                          borderRadius: '4px',
                          fontSize: '0.65rem',
                          letterSpacing: '0.08em',
                          textTransform: 'uppercase',
                          background:
                            e.status === 'confirmed'
                              ? 'rgba(76, 175, 80, 0.15)'
                              : e.status === 'rejected'
                              ? 'rgba(244, 67, 54, 0.15)'
                              : 'rgba(233, 68, 128, 0.15)',
                          color:
                            e.status === 'confirmed'
                              ? '#81c784'
                              : e.status === 'rejected'
                              ? '#e57373'
                              : '#e94480',
                          border:
                            e.status === 'confirmed'
                              ? '1px solid rgba(76, 175, 80, 0.3)'
                              : e.status === 'rejected'
                              ? '1px solid rgba(244, 67, 54, 0.3)'
                              : '1px solid rgba(233, 68, 128, 0.3)',
                        }}
                      >
                        {e.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <p
            style={{
              color: 'rgba(255,255,255,0.3)',
              fontSize: '0.9rem',
              textAlign: 'center',
              padding: '2rem',
            }}
          >
            No enquiries yet.
          </p>
        )}
      </div>
    </div>
  )
}
