import { getServerSession } from 'next-auth/next'
import { authOptions } from '../../api/auth/[...nextauth]/route'
import { redirect } from 'next/navigation'
import { db } from '../../../lib/db'
import { enquiries } from '../../../lib/schema'
import { sql } from 'drizzle-orm'
import Link from 'next/link'
import AdminNav from '../../../components/AdminNav'

export default async function AdminEnquiries() {
  const session = await getServerSession(authOptions)
  if (!session) redirect('/admin/login')

  const items = await db.select().from(enquiries).orderBy(sql`${enquiries.createdAt} desc`)

  return (
    <div style={{ padding: '2rem 1.5rem', maxWidth: '1200px', margin: '0 auto' }}>
      <AdminNav />

      <div style={{ marginBottom: '1.5rem' }}>
        <h1
          style={{
            fontFamily: "'Playfair Display', serif",
            fontSize: '1.4rem',
            color: '#e94480',
            letterSpacing: '0.08em',
            textTransform: 'uppercase',
          }}
        >
          Enquiries
        </h1>
      </div>

      <div className="frame-card" style={{ overflowX: 'auto' }}>
        {items.length > 0 ? (
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.8rem' }}>
            <thead>
              <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.1)' }}>
                {['ID', 'Name', 'Email', 'Phone', 'Preferred Date', 'Message', 'Status', 'Date'].map((h) => (
                  <th
                    key={h}
                    style={{
                      textAlign: 'left',
                      padding: '0.75rem',
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
              {items.map((e) => (
                <tr key={e.id} style={{ borderBottom: '1px solid rgba(255,255,255,0.04)' }}>
                  <td style={{ padding: '0.75rem', color: 'rgba(255,255,255,0.4)' }}>{e.id}</td>
                  <td style={{ padding: '0.75rem', color: 'rgba(255,255,255,0.85)' }}>{e.name}</td>
                  <td style={{ padding: '0.75rem', color: 'rgba(255,255,255,0.6)' }}>{e.email}</td>
                  <td style={{ padding: '0.75rem', color: 'rgba(255,255,255,0.6)' }}>{e.phone || '-'}</td>
                  <td style={{ padding: '0.75rem', color: 'rgba(255,255,255,0.6)' }}>
                    {e.preferredDate ? new Date(e.preferredDate).toLocaleDateString('en-GB') : '-'}
                  </td>
                  <td style={{ padding: '0.75rem', color: 'rgba(255,255,255,0.6)', maxWidth: '200px' }}>
                    <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical' }}>
                      {e.message || '-'}
                    </span>
                  </td>
                  <td style={{ padding: '0.75rem' }}>
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
                  <td style={{ padding: '0.75rem', color: 'rgba(255,255,255,0.4)', fontSize: '0.7rem' }}>
                    {e.createdAt ? new Date(e.createdAt).toLocaleDateString('en-GB') : '-'}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <p style={{ textAlign: 'center', color: 'rgba(255,255,255,0.4)', padding: '3rem' }}>No enquiries yet.</p>
        )}
      </div>
    </div>
  )
}
