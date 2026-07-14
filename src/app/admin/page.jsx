import { getServerSession } from 'next-auth/next'
import { authOptions } from '../api/auth/[...nextauth]/route'
import { db } from '../../lib/db'
import { enquiries, blogPosts, galleryItems, services } from '../../lib/schema'
import { sql } from 'drizzle-orm'
import Link from 'next/link'

export default async function AdminDashboard() {
  const session = await getServerSession(authOptions)

  const enquiryCount = await db.select({ count: sql`count(*)` }).from(enquiries)
  const postCount = await db.select({ count: sql`count(*)` }).from(blogPosts)
  const galleryCount = await db.select({ count: sql`count(*)` }).from(galleryItems)
  const serviceCount = await db.select({ count: sql`count(*)` }).from(services)

  const recentEnquiries = await db.select().from(enquiries).orderBy(sql`${enquiries.createdAt} desc`).limit(5)

  return (
    <div style={{ padding: '2rem 1.5rem', maxWidth: '1200px', margin: '0 auto' }}>
      <div style={{ marginBottom: '2rem' }}>
        <h1
          style={{
            fontFamily: "'Playfair Display', serif",
            fontSize: '1.5rem',
            color: '#c9a96e',
            letterSpacing: '0.08em',
            textTransform: 'uppercase',
          }}
        >
          Dashboard
        </h1>
        <p style={{ fontSize: '0.8rem', color: 'rgba(255,255,255,0.4)', marginTop: '0.25rem' }}>
          Welcome back, {session?.user?.name || session?.user?.email}
        </p>
      </div>

      {/* Stats */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))',
          gap: '1rem',
          marginBottom: '2.5rem',
        }}
      >
        {[
          { label: 'Enquiries', count: enquiryCount[0]?.count || 0, href: '/admin/enquiries' },
          { label: 'Blog Posts', count: postCount[0]?.count || 0, href: '/admin/blog' },
          { label: 'Gallery Items', count: galleryCount[0]?.count || 0, href: '/admin/gallery' },
          { label: 'Services', count: serviceCount[0]?.count || 0, href: '/admin/services' },
        ].map((stat) => (
          <Link
            key={stat.label}
            href={stat.href}
            style={{ textDecoration: 'none' }}
          >
            <div
              className="glass-card card-hover"
              style={{ textAlign: 'center' }}
            >
              <p
                style={{
                  fontFamily: "'Playfair Display', serif",
                  fontSize: '2rem',
                  color: '#c9a96e',
                  marginBottom: '0.25rem',
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
                }}
              >
                {stat.label}
              </p>
            </div>
          </Link>
        ))}
      </div>

      {/* Recent Enquiries */}
      <div className="frame-card">
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            marginBottom: '1.25rem',
          }}
        >
          <h2
            style={{
              fontFamily: "'Playfair Display', serif",
              fontSize: '1.1rem',
              color: '#c9a96e',
              fontWeight: 500,
            }}
          >
            Recent Enquiries
          </h2>
          <Link
            href="/admin/enquiries"
            style={{
              fontSize: '0.7rem',
              color: '#c9a96e',
              textDecoration: 'none',
              letterSpacing: '0.1em',
              textTransform: 'uppercase',
            }}
          >
            View All &rarr;
          </Link>
        </div>

        {recentEnquiries.length > 0 ? (
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.8rem' }}>
              <thead>
                <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.08)' }}>
                  {['Name', 'Email', 'Date', 'Status'].map((h) => (
                    <th
                      key={h}
                      style={{
                        textAlign: 'left',
                        padding: '0.75rem 0.5rem',
                        fontFamily: "'Inter', sans-serif",
                        fontSize: '0.65rem',
                        letterSpacing: '0.12em',
                        textTransform: 'uppercase',
                        color: 'rgba(255,255,255,0.4)',
                        fontWeight: 400,
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
                    <td style={{ padding: '0.75rem 0.5rem', color: 'rgba(255,255,255,0.8)' }}>{e.name}</td>
                    <td style={{ padding: '0.75rem 0.5rem', color: 'rgba(255,255,255,0.6)' }}>{e.email}</td>
                    <td style={{ padding: '0.75rem 0.5rem', color: 'rgba(255,255,255,0.6)' }}>
                      {e.preferredDate ? new Date(e.preferredDate).toLocaleDateString('en-GB') : '-'}
                    </td>
                    <td style={{ padding: '0.75rem 0.5rem' }}>
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
                              : 'rgba(201, 169, 110, 0.15)',
                          color:
                            e.status === 'confirmed'
                              ? '#81c784'
                              : e.status === 'rejected'
                              ? '#e57373'
                              : '#c9a96e',
                          border:
                            e.status === 'confirmed'
                              ? '1px solid rgba(76, 175, 80, 0.3)'
                              : e.status === 'rejected'
                              ? '1px solid rgba(244, 67, 54, 0.3)'
                              : '1px solid rgba(201, 169, 110, 0.3)',
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
          <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: '0.85rem', textAlign: 'center', padding: '2rem' }}>
            No enquiries yet.
          </p>
        )}
      </div>
    </div>
  )
}
