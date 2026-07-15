'use client'

import Link from 'next/link'
import { MONTHS, WEEKDAYS, getCalendarDays, isDateInPast } from '../../lib/calendar'

const STATUS_STYLES = {
  pending: { bg: 'rgba(233,68,128,0.1)', color: '#e94480', border: 'rgba(233,68,128,0.2)' },
  confirmed: { bg: 'rgba(34,197,94,0.1)', color: '#4ade80', border: 'rgba(34,197,94,0.2)' },
  rejected: { bg: 'rgba(239,68,68,0.1)', color: '#f87171', border: 'rgba(239,68,68,0.2)' },
  cancelled: { bg: 'rgba(255,255,255,0.05)', color: 'rgba(255,255,255,0.4)', border: 'rgba(255,255,255,0.1)' },
}

const CONSENT_STYLES = {
  sent: { bg: 'rgba(74,143,217,0.1)', color: '#4A8FD9', border: 'rgba(74,143,217,0.3)', label: 'Sent' },
  viewed: { bg: 'rgba(123,107,165,0.1)', color: '#7B6BA5', border: 'rgba(123,107,165,0.3)', label: 'Viewed' },
  signed: { bg: 'rgba(46,196,182,0.1)', color: '#2EC4B6', border: 'rgba(46,196,182,0.3)', label: 'Signed' },
  declined: { bg: 'rgba(255,255,255,0.05)', color: 'rgba(255,255,255,0.5)', border: 'rgba(255,255,255,0.12)', label: 'Declined' },
  expired: { bg: 'rgba(255,255,255,0.05)', color: 'rgba(255,255,255,0.5)', border: 'rgba(255,255,255,0.12)', label: 'Expired' },
}

const DOC_TYPE_LABELS = {
  consent: 'Consent',
  consultation: 'Consultation',
  guardian_consent: 'Guardian',
  aftercare: 'Aftercare',
}

function formatDate(d) {
  if (!d) return '-'
  return new Date(d).toLocaleDateString('en-GB', { day: '2-digit', month: 'short' })
}

function formatTime(d) {
  if (!d) return '-'
  return new Date(d).toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' })
}

function formatCurrency(num) {
  if (num >= 1000) return '£' + (num / 1000).toFixed(1) + 'k'
  return '£' + num.toLocaleString('en-GB')
}

export default function DashboardClient({ stats, recentBookings, upcomingBookings, calendarBookings, recentConsent, recentEnquiries }) {
  const now = new Date()
  const currentYear = now.getFullYear()
  const currentMonth = now.getMonth()
  const days = getCalendarDays(currentYear, currentMonth)

  // Group calendar bookings by date key
  const bookingsByDate = {}
  calendarBookings.forEach(b => {
    if (!b.date) return
    const key = new Date(b.date).toISOString().split('T')[0]
    if (!bookingsByDate[key]) bookingsByDate[key] = []
    bookingsByDate[key].push(b)
  })

  const statCards = [
    { label: 'Pending Bookings', count: stats.pendingBookings, href: '/admin/bookings', color: '#e94480' },
    { label: 'Confirmed Upcoming', count: stats.confirmedUpcoming, href: '/admin/bookings', color: '#4ade80' },
    { label: 'Total Clients', count: stats.totalClients, href: '/admin/clients', color: '#c9a96e' },
    { label: 'Consent Pending', count: stats.consentPending, href: '/admin/clients', color: '#4A8FD9' },
    { label: 'Consent Signed', count: stats.consentSigned, href: '/admin/clients', color: '#2EC4B6' },
    { label: 'Enquiries', count: stats.totalEnquiries, href: '/admin/enquiries', color: '#e94480' },
    { label: 'Journal Posts', count: stats.totalPosts, href: '/admin/blog', color: '#c9a96e' },
    { label: 'Revenue', count: formatCurrency(stats.revenue), href: '/admin/bookings', color: '#4ade80', isText: true },
  ]

  return (
    <div style={{ padding: '2.5rem 2rem', maxWidth: '1200px' }}>
      {/* Header */}
      <div style={{ marginBottom: '2rem' }}>
        <h1 style={{ fontFamily: "'Pirata One', 'Playfair Display', cursive", fontSize: 'clamp(1.5rem, 3vw, 2.2rem)', color: '#e94480', letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: '0.25rem' }}>
          Dashboard
        </h1>
        <p style={{ fontSize: '0.85rem', color: 'rgba(255,255,255,0.4)' }}>
          {now.toLocaleDateString('en-GB', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
        </p>
      </div>

      {/* Stats Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '1rem', marginBottom: '2.5rem' }}>
        {statCards.map(stat => (
          <Link key={stat.label} href={stat.href} style={{ textDecoration: 'none' }}>
            <div style={{
              background: 'rgba(255,255,255,0.03)',
              border: '1px solid rgba(255,255,255,0.06)',
              borderRadius: '14px',
              padding: '1.5rem',
              textAlign: 'center',
              transition: 'all 0.3s ease',
              cursor: 'pointer',
            }}
            onMouseEnter={e => { e.currentTarget.style.borderColor = 'rgba(233,68,128,0.25)'; e.currentTarget.style.transform = 'translateY(-3px)'; e.currentTarget.style.boxShadow = '0 8px 24px rgba(233,68,128,0.08)' }}
            onMouseLeave={e => { e.currentTarget.style.borderColor = 'rgba(255,255,255,0.06)'; e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = 'none' }}
            >
              <p style={{ fontFamily: "'Pirata One', 'Playfair Display', cursive", fontSize: '2.5rem', color: stat.color, marginBottom: '0.5rem', lineHeight: 1 }}>
                {stat.isText ? stat.count : Number(stat.count).toLocaleString('en-GB')}
              </p>
              <p style={{ fontFamily: "'Inter', sans-serif", fontSize: '0.7rem', letterSpacing: '0.15em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.5)', fontWeight: 500 }}>
                {stat.label}
              </p>
            </div>
          </Link>
        ))}
      </div>

      {/* Calendar + Upcoming */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem', marginBottom: '2.5rem' }} className="dashboard-calendar-grid">
        {/* Mini Calendar */}
        <div style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.06)', borderRadius: '14px', padding: '1.5rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem' }}>
            <h2 style={{ fontFamily: "'Pirata One', 'Playfair Display', cursive", fontSize: '1.15rem', color: '#e94480', fontWeight: 400, letterSpacing: '0.05em', margin: 0 }}>
              {MONTHS[currentMonth]} {currentYear}
            </h2>
            <Link href="/admin/bookings" style={{ fontSize: '0.7rem', color: '#e94480', textDecoration: 'none', letterSpacing: '0.1em', textTransform: 'uppercase', fontWeight: 500 }}>
              View All
            </Link>
          </div>

          {/* Calendar grid */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: '2px', textAlign: 'center' }}>
            {WEEKDAYS.map(d => (
              <div key={d} style={{ fontSize: '0.55rem', letterSpacing: '0.08em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.35)', padding: '0.25rem 0' }}>
                {d}
              </div>
            ))}
            {days.map((day, i) => {
              if (!day) return <div key={i} style={{ height: '1.75rem' }} />
              const dateKey = `${currentYear}-${String(currentMonth + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`
              const dayBookings = bookingsByDate[dateKey] || []
              const isToday = day === now.getDate() && currentMonth === now.getMonth() && currentYear === now.getFullYear()
              const hasConfirmed = dayBookings.some(b => b.status === 'confirmed')
              const hasPending = dayBookings.some(b => b.status === 'pending')

              return (
                <div key={i} style={{
                  height: '1.75rem',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '1px',
                  borderRadius: '4px',
                  background: isToday ? 'rgba(233,68,128,0.15)' : dayBookings.length > 0 ? 'rgba(255,255,255,0.04)' : 'transparent',
                  color: isToday ? '#e94480' : 'rgba(255,255,255,0.7)',
                  fontSize: '0.6rem',
                  fontWeight: isToday ? 600 : 400,
                }}>
                  {day}
                  {dayBookings.length > 0 && (
                    <div style={{ display: 'flex', gap: '1px' }}>
                      {hasConfirmed && <div style={{ width: '3px', height: '3px', borderRadius: '50%', background: '#4ade80' }} />}
                      {hasPending && <div style={{ width: '3px', height: '3px', borderRadius: '50%', background: '#e94480' }} />}
                    </div>
                  )}
                </div>
              )
            })}
          </div>
        </div>

        {/* Upcoming Bookings */}
        <div style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.06)', borderRadius: '14px', padding: '1.5rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem' }}>
            <h2 style={{ fontFamily: "'Pirata One', 'Playfair Display', cursive", fontSize: '1.15rem', color: '#e94480', fontWeight: 400, letterSpacing: '0.05em', margin: 0 }}>
              Upcoming
            </h2>
            <span style={{ fontSize: '0.7rem', color: 'rgba(255,255,255,0.4)' }}>{upcomingBookings.length} booking{upcomingBookings.length !== 1 ? 's' : ''}</span>
          </div>

          {upcomingBookings.length === 0 ? (
            <p style={{ color: 'rgba(255,255,255,0.3)', fontSize: '0.85rem', textAlign: 'center', padding: '1.5rem' }}>No upcoming bookings</p>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', maxHeight: '280px', overflowY: 'auto' }}>
              {upcomingBookings.map(b => {
                const s = STATUS_STYLES[b.status] || STATUS_STYLES.pending
                return (
                  <Link key={b.id} href={`/admin/bookings/${b.id}`} style={{ textDecoration: 'none', display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0.6rem 0.75rem', borderRadius: '8px', background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.04)', transition: 'background 0.15s' }}
                    onMouseEnter={e => e.currentTarget.style.background = 'rgba(255,255,255,0.06)'}
                    onMouseLeave={e => e.currentTarget.style.background = 'rgba(255,255,255,0.03)'}
                  >
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.1rem' }}>
                      <span style={{ color: 'rgba(255,255,255,0.85)', fontSize: '0.8rem' }}>{b.name}</span>
                      <span style={{ color: 'rgba(255,255,255,0.4)', fontSize: '0.7rem' }}>
                        {b.date ? formatDate(b.date) : 'TBD'}{b.timeSlot ? ` at ${b.timeSlot}` : ''}{b.service ? ` · ${b.service}` : ''}
                      </span>
                    </div>
                    <span style={{ padding: '0.15rem 0.5rem', borderRadius: '4px', fontSize: '0.6rem', fontWeight: 600, letterSpacing: '0.08em', textTransform: 'uppercase', background: s.bg, color: s.color, border: `1px solid ${s.border}` }}>
                      {b.status}
                    </span>
                  </Link>
                )
              })}
            </div>
          )}
        </div>
      </div>

      {/* Recent Activity: Bookings + Consent side by side */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem', marginBottom: '2.5rem' }} className="dashboard-activity-grid">
        {/* Recent Bookings */}
        <div style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.06)', borderRadius: '14px', padding: '1.5rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem' }}>
            <h2 style={{ fontFamily: "'Pirata One', 'Playfair Display', cursive", fontSize: '1.15rem', color: '#e94480', fontWeight: 400, letterSpacing: '0.05em', margin: 0 }}>
              Recent Bookings
            </h2>
            <Link href="/admin/bookings" style={{ fontSize: '0.7rem', color: '#e94480', textDecoration: 'none', letterSpacing: '0.1em', textTransform: 'uppercase', fontWeight: 500 }}>
              View All
            </Link>
          </div>

          {recentBookings.length === 0 ? (
            <p style={{ color: 'rgba(255,255,255,0.3)', fontSize: '0.85rem', textAlign: 'center', padding: '1rem' }}>No bookings yet</p>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              {recentBookings.map(b => {
                const s = STATUS_STYLES[b.status] || STATUS_STYLES.pending
                return (
                  <Link key={b.id} href={`/admin/bookings/${b.id}`} style={{ textDecoration: 'none', display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0.6rem 0.75rem', borderRadius: '8px', background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.04)', transition: 'background 0.15s' }}
                    onMouseEnter={e => e.currentTarget.style.background = 'rgba(255,255,255,0.06)'}
                    onMouseLeave={e => e.currentTarget.style.background = 'rgba(255,255,255,0.03)'}
                  >
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.1rem', minWidth: 0 }}>
                      <span style={{ color: 'rgba(255,255,255,0.85)', fontSize: '0.8rem', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{b.name}</span>
                      <span style={{ color: 'rgba(255,255,255,0.4)', fontSize: '0.7rem' }}>
                        {b.date ? formatDate(b.date) : 'TBD'}{b.service ? ` · ${b.service}` : ''}
                      </span>
                    </div>
                    <span style={{ padding: '0.15rem 0.5rem', borderRadius: '4px', fontSize: '0.6rem', fontWeight: 600, letterSpacing: '0.08em', textTransform: 'uppercase', background: s.bg, color: s.color, border: `1px solid ${s.border}`, whiteSpace: 'nowrap', marginLeft: '0.5rem' }}>
                      {b.status}
                    </span>
                  </Link>
                )
              })}
            </div>
          )}
        </div>

        {/* Recent Consent Activity */}
        <div style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.06)', borderRadius: '14px', padding: '1.5rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem' }}>
            <h2 style={{ fontFamily: "'Pirata One', 'Playfair Display', cursive", fontSize: '1.15rem', color: '#e94480', fontWeight: 400, letterSpacing: '0.05em', margin: 0 }}>
              Consent Activity
            </h2>
            <Link href="/admin/clients" style={{ fontSize: '0.7rem', color: '#e94480', textDecoration: 'none', letterSpacing: '0.1em', textTransform: 'uppercase', fontWeight: 500 }}>
              View All
            </Link>
          </div>

          {recentConsent.length === 0 ? (
            <p style={{ color: 'rgba(255,255,255,0.3)', fontSize: '0.85rem', textAlign: 'center', padding: '1rem' }}>No consent records yet</p>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              {recentConsent.map(r => {
                const cs = CONSENT_STYLES[r.status] || CONSENT_STYLES.sent
                const docLabel = DOC_TYPE_LABELS[r.documentType] || r.documentType || 'Consent'
                return (
                  <div key={r.id} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0.6rem 0.75rem', borderRadius: '8px', background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.04)' }}>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.1rem', minWidth: 0 }}>
                      <span style={{ color: 'rgba(255,255,255,0.85)', fontSize: '0.8rem', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                        {r.clientName || r.signatoryName || 'Unknown'}
                      </span>
                      <span style={{ color: 'rgba(255,255,255,0.4)', fontSize: '0.7rem' }}>
                        {docLabel} · {r.signedAt ? formatDate(r.signedAt) : r.sentAt ? formatDate(r.sentAt) : '-'}
                      </span>
                    </div>
                    <span style={{ padding: '0.15rem 0.5rem', borderRadius: '4px', fontSize: '0.6rem', fontWeight: 600, letterSpacing: '0.08em', textTransform: 'uppercase', background: cs.bg, color: cs.color, border: `1px solid ${cs.border}`, whiteSpace: 'nowrap', marginLeft: '0.5rem' }}>
                      {cs.label}
                    </span>
                  </div>
                )
              })}
            </div>
          )}
        </div>
      </div>

      {/* Recent Enquiries */}
      <div style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.06)', borderRadius: '14px', padding: '1.5rem', marginBottom: '2.5rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.5rem' }}>
          <h2 style={{ fontFamily: "'Pirata One', 'Playfair Display', cursive", fontSize: '1.15rem', color: '#e94480', fontWeight: 400, letterSpacing: '0.05em', margin: 0 }}>
            Recent Enquiries
          </h2>
          <Link href="/admin/enquiries" style={{ fontSize: '0.7rem', color: '#e94480', textDecoration: 'none', letterSpacing: '0.1em', textTransform: 'uppercase', fontWeight: 500 }}>
            View All
          </Link>
        </div>

        {recentEnquiries.length > 0 ? (
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', minWidth: '640px', borderCollapse: 'collapse', fontSize: '0.85rem' }}>
              <thead>
                <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.08)' }}>
                  {['Name', 'Email', 'Service', 'Date', 'Status'].map(h => (
                    <th key={h} style={{ textAlign: 'left', padding: '0.75rem 0.5rem', fontFamily: "'Inter', sans-serif", fontSize: '0.65rem', letterSpacing: '0.12em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.35)', fontWeight: 500 }}>
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {recentEnquiries.map(e => (
                  <tr key={e.id} style={{ borderBottom: '1px solid rgba(255,255,255,0.04)' }}>
                    <td style={{ padding: '0.85rem 0.5rem', color: 'rgba(255,255,255,0.85)' }}>{e.name}</td>
                    <td style={{ padding: '0.85rem 0.5rem', color: 'rgba(255,255,255,0.55)' }}>{e.email}</td>
                    <td style={{ padding: '0.85rem 0.5rem', color: 'rgba(255,255,255,0.55)' }}>{e.service || '-'}</td>
                    <td style={{ padding: '0.85rem 0.5rem', color: 'rgba(255,255,255,0.55)' }}>{e.preferredDate ? new Date(e.preferredDate).toLocaleDateString('en-GB') : '-'}</td>
                    <td style={{ padding: '0.85rem 0.5rem' }}>
                      <span style={{
                        padding: '0.25rem 0.6rem', borderRadius: '4px', fontSize: '0.65rem', fontWeight: 600, letterSpacing: '0.08em', textTransform: 'uppercase',
                        background: e.status === 'confirmed' ? 'rgba(76,175,80,0.15)' : e.status === 'rejected' ? 'rgba(244,67,54,0.15)' : 'rgba(233,68,128,0.15)',
                        color: e.status === 'confirmed' ? '#81c784' : e.status === 'rejected' ? '#e57373' : '#e94480',
                        border: e.status === 'confirmed' ? '1px solid rgba(76,175,80,0.3)' : e.status === 'rejected' ? '1px solid rgba(244,67,54,0.3)' : '1px solid rgba(233,68,128,0.3)',
                      }}>
                        {e.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <p style={{ color: 'rgba(255,255,255,0.3)', fontSize: '0.9rem', textAlign: 'center', padding: '2rem' }}>No enquiries yet.</p>
        )}
      </div>

      {/* Mobile responsive styles */}
      <style>{`
        @media (max-width: 768px) {
          .dashboard-calendar-grid {
            grid-template-columns: 1fr !important;
          }
          .dashboard-activity-grid {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>
    </div>
  )
}