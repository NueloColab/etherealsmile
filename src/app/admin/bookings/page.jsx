'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import BookingCalendar from './BookingCalendar'

const STATUS_STYLES = {
  pending: { bg: 'rgba(233,68,128,0.1)', color: '#e94480', border: 'rgba(233,68,128,0.2)' },
  confirmed: { bg: 'rgba(34,197,94,0.1)', color: '#4ade80', border: 'rgba(34,197,94,0.2)' },
  rejected: { bg: 'rgba(239,68,68,0.1)', color: '#f87171', border: 'rgba(239,68,68,0.2)' },
  cancelled: { bg: 'rgba(255,255,255,0.05)', color: 'rgba(255,255,255,0.4)', border: 'rgba(255,255,255,0.1)' },
}

const SOURCE_STYLES = {
  website: { color: '#e94480', label: 'Web' },
  booksy: { color: '#60a5fa', label: 'Booksy' },
  phone: { color: '#fbbf24', label: 'Phone' },
  walkin: { color: '#a78bfa', label: 'Walk-in' },
}

const DEFAULT_TIME_SLOTS = ['10:00', '11:30', '13:00', '14:30', '16:00']

export default function BookingsPage() {
  const router = useRouter()
  const [bookings, setBookings] = useState([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState('all')
  const [view, setView] = useState('calendar')
  const [showAdd, setShowAdd] = useState(false)
  const [adding, setAdding] = useState(false)

  const [newBooking, setNewBooking] = useState({
    name: '',
    email: '',
    phone: '',
    date: '',
    timeSlot: '',
    service: '',
    price: '',
    notes: '',
    source: 'booksy',
    status: 'confirmed',
  })

  function fetchBookings() {
    setLoading(true)
    fetch('/api/bookings?limit=200&sort=-createdAt')
      .then(r => {
        if (!r.ok) throw new Error('Failed to load')
        return r.json()
      })
      .then(data => {
        setBookings(data || [])
        setLoading(false)
      })
      .catch(() => {
        setBookings([])
        setLoading(false)
      })
  }

  useEffect(() => {
    fetchBookings()
  }, [])

  useEffect(() => {
    function onFocus() { fetchBookings() }
    window.addEventListener('focus', onFocus)
    return () => window.removeEventListener('focus', onFocus)
  }, [])

  async function handleAdd(e) {
    e.preventDefault()
    if (!newBooking.name || !newBooking.date || !newBooking.timeSlot) {
      alert('Name, date and time are required')
      return
    }
    setAdding(true)
    try {
      const res = await fetch('/api/bookings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: newBooking.name,
          email: newBooking.email || 'manual@booking.local',
          phone: newBooking.phone || '',
          preferredDate: newBooking.date,
          preferredTime: newBooking.timeSlot,
          service: newBooking.service,
          price: newBooking.price,
          message: newBooking.notes,
          source: newBooking.source,
          status: newBooking.status,
        }),
      })
      const data = await res.json()
      if (data.success) {
        setShowAdd(false)
        setNewBooking({
          name: '', email: '', phone: '', date: '', timeSlot: '', service: '', price: '', notes: '', source: 'booksy', status: 'confirmed',
        })
        fetchBookings()
      } else {
        alert(data.error || 'Failed to add booking')
      }
    } catch (err) {
      alert(err.message)
    } finally {
      setAdding(false)
    }
  }

  const filtered = filter === 'all' ? bookings : bookings.filter(b => b.status === filter)

  const inputStyle = {
    width: '100%',
    padding: '0.85rem 1rem',
    background: 'rgba(255,255,255,0.04)',
    border: '1px solid rgba(255,255,255,0.1)',
    borderRadius: '8px',
    color: '#ffffff',
    fontSize: '0.85rem',
    outline: 'none',
    fontFamily: "'Inter', sans-serif",
  }

  const labelStyle = {
    display: 'block',
    fontSize: '0.7rem',
    letterSpacing: '0.12em',
    textTransform: 'uppercase',
    color: 'rgba(255,255,255,0.5)',
    marginBottom: '0.5rem',
  }

  if (loading) {
    return <div style={{ padding: '2rem', color: 'rgba(255,255,255,0.4)' }}>Loading bookings...</div>
  }

  return (
    <div style={{ padding: '2.5rem 2rem', maxWidth: '1100px' }}>
      <div style={{ marginBottom: '2rem' }}>
        <Link href="/admin" style={{ fontSize: '0.75rem', color: '#e94480', textDecoration: 'none', letterSpacing: '0.1em', textTransform: 'uppercase' }}>
          &larr; Dashboard
        </Link>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', flexWrap: 'wrap', gap: '1rem' }}>
          <div>
            <h1 style={{ fontFamily: "'Pirata One', 'Playfair Display', cursive", fontSize: '1.8rem', color: '#e94480', letterSpacing: '0.08em', textTransform: 'uppercase', marginTop: '0.5rem' }}>
              Bookings
            </h1>
            <p style={{ fontSize: '0.85rem', color: 'rgba(255,255,255,0.4)', marginTop: '0.5rem' }}>
              Website + Booksy — all in one diary
            </p>
          </div>
          <button
            onClick={() => setShowAdd(true)}
            style={{
              padding: '0.75rem 1.5rem',
              background: '#e94480',
              color: '#ffffff',
              border: 'none',
              borderRadius: '50px',
              fontSize: '0.75rem',
              fontWeight: 500,
              letterSpacing: '0.12em',
              textTransform: 'uppercase',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
            }}
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="12" y1="5" x2="12" y2="19" />
              <line x1="5" y1="12" x2="19" y2="12" />
            </svg>
            Add Booking
          </button>
        </div>
      </div>

      {/* Legend */}
      <div style={{ display: 'flex', gap: '1rem', marginBottom: '1.5rem', flexWrap: 'wrap' }}>
        {Object.entries(SOURCE_STYLES).map(([key, style]) => (
          <div key={key} style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
            <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: style.color }} />
            <span style={{ fontSize: '0.7rem', color: 'rgba(255,255,255,0.5)', textTransform: 'capitalize' }}>{style.label}</span>
          </div>
        ))}
      </div>

      {/* View toggle + Filter tabs */}
      <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '2rem', flexWrap: 'wrap', alignItems: 'center' }}>
        <div style={{ display: 'flex', borderRadius: '50px', border: '1px solid rgba(255,255,255,0.1)', overflow: 'hidden', marginRight: '1rem' }}>
          <button onClick={() => setView('calendar')} style={{ padding: '0.5rem 1rem', border: 'none', background: view === 'calendar' ? 'rgba(233,68,128,0.15)' : 'transparent', color: view === 'calendar' ? '#e94480' : 'rgba(255,255,255,0.5)', fontSize: '0.7rem', fontWeight: 500, letterSpacing: '0.1em', textTransform: 'uppercase', cursor: 'pointer', transition: 'all 0.2s ease' }}>
            Calendar
          </button>
          <button onClick={() => setView('list')} style={{ padding: '0.5rem 1rem', border: 'none', background: view === 'list' ? 'rgba(233,68,128,0.15)' : 'transparent', color: view === 'list' ? '#e94480' : 'rgba(255,255,255,0.5)', fontSize: '0.7rem', fontWeight: 500, letterSpacing: '0.1em', textTransform: 'uppercase', cursor: 'pointer', transition: 'all 0.2s ease' }}>
            List
          </button>
        </div>

        {['all', 'pending', 'confirmed'].map(f => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            style={{
              padding: '0.5rem 1.25rem',
              borderRadius: '50px',
              border: filter === f ? '1px solid #e94480' : '1px solid rgba(255,255,255,0.1)',
              background: filter === f ? 'rgba(233,68,128,0.1)' : 'transparent',
              color: filter === f ? '#e94480' : 'rgba(255,255,255,0.5)',
              fontSize: '0.7rem',
              fontWeight: 500,
              letterSpacing: '0.1em',
              textTransform: 'uppercase',
              cursor: 'pointer',
              transition: 'all 0.2s ease',
            }}
          >
            {f.charAt(0).toUpperCase() + f.slice(1)}
            {f !== 'all' && <span style={{ marginLeft: '0.5rem', opacity: 0.6 }}>{bookings.filter(b => b.status === f).length}</span>}
          </button>
        ))}
      </div>

      {/* Calendar or List view */}
      {view === 'calendar' ? (
        <BookingCalendar bookings={filtered} />
      ) : filtered.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '3rem', color: 'rgba(255,255,255,0.4)' }}>
          No bookings found.
        </div>
      ) : (
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', minWidth: '640px', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
                {['Date', 'Customer', 'Service', 'Source', 'Status', 'Actions'].map(h => (
                  <th key={h} style={{ textAlign: 'left', padding: '0.75rem', fontSize: '0.7rem', letterSpacing: '0.12em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.4)', fontWeight: 500 }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.map(booking => {
                const status = booking.status || 'pending'
                const style = STATUS_STYLES[status] || STATUS_STYLES.pending
                const src = SOURCE_STYLES[booking.source] || SOURCE_STYLES.website
                return (
                  <tr key={booking.id} onClick={() => router.push(`/admin/bookings/${booking.id}`)} style={{ borderBottom: '1px solid rgba(255,255,255,0.04)', cursor: 'pointer', transition: 'background 0.15s ease' }}
                    onMouseEnter={e => e.currentTarget.style.background = 'rgba(255,255,255,0.03)'}
                    onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
                  >
                    <td style={{ padding: '0.75rem', fontSize: '0.85rem', color: 'rgba(255,255,255,0.8)' }}>
                      {booking.date ? new Date(booking.date).toLocaleDateString('en-GB', { day: '2-digit', month: 'short' }) : '-'}
                      {booking.timeSlot && <span style={{ display: 'block', fontSize: '0.75rem', color: 'rgba(255,255,255,0.4)' }}>{booking.timeSlot}</span>}
                    </td>
                    <td style={{ padding: '0.75rem' }}>
                      <div style={{ color: 'rgba(255,255,255,0.85)', fontSize: '0.85rem' }}>{booking.name}</div>
                      <div style={{ color: 'rgba(255,255,255,0.4)', fontSize: '0.75rem' }}>{booking.email}</div>
                      {booking.isMinor && (
                        <span style={{ display: 'inline-block', marginTop: '0.25rem', padding: '0.15rem 0.4rem', borderRadius: '3px', fontSize: '0.6rem', fontWeight: 600, letterSpacing: '0.08em', textTransform: 'uppercase', background: 'rgba(233,68,128,0.15)', color: '#e94480', border: '1px solid rgba(233,68,128,0.3)' }}>U18</span>
                      )}
                    </td>
                    <td style={{ padding: '0.75rem', color: 'rgba(255,255,255,0.6)', fontSize: '0.85rem' }}>
                      {booking.service || '-'}
                      {booking.price && <span style={{ color: 'rgba(255,255,255,0.35)', marginLeft: '0.5rem' }}>({booking.price})</span>}
                    </td>
                    <td style={{ padding: '0.75rem' }}>
                      <span style={{ padding: '0.2rem 0.5rem', borderRadius: '4px', fontSize: '0.6rem', fontWeight: 600, letterSpacing: '0.08em', textTransform: 'uppercase', background: src.color + '1a', color: src.color, border: `1px solid ${src.color}33` }}>
                        {src.label}
                      </span>
                    </td>
                    <td style={{ padding: '0.75rem' }}>
                      <span style={{ padding: '0.25rem 0.6rem', borderRadius: '4px', fontSize: '0.65rem', fontWeight: 600, letterSpacing: '0.08em', textTransform: 'uppercase', background: style.bg, color: style.color, border: `1px solid ${style.border}` }}>
                        {status}
                      </span>
                    </td>
                    <td style={{ padding: '0.75rem', color: '#e94480', fontSize: '0.75rem', letterSpacing: '0.05em' }}>
                      View &rarr;
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      )}

      {/* Add Booking Modal */}
      {showAdd && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(4px)', zIndex: 50, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1rem' }} onClick={() => setShowAdd(false)}>
          <div style={{ background: '#0a0a0a', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '16px', padding: '2rem', width: '100%', maxWidth: '520px', maxHeight: '90vh', overflowY: 'auto' }} onClick={e => e.stopPropagation()}>
            <h2 style={{ fontFamily: "'Pirata One', 'Playfair Display', cursive", fontSize: '1.4rem', color: '#e94480', letterSpacing: '0.05em', marginBottom: '1.5rem' }}>
              Add Booking
            </h2>
            <form onSubmit={handleAdd} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
              <div className="admin-add-grid" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div>
                  <label style={labelStyle}>Customer Name *</label>
                  <input required value={newBooking.name} onChange={e => setNewBooking({ ...newBooking, name: e.target.value })} style={inputStyle} placeholder="e.g. Sarah Jones" />
                </div>
                <div>
                  <label style={labelStyle}>Phone</label>
                  <input value={newBooking.phone} onChange={e => setNewBooking({ ...newBooking, phone: e.target.value })} style={inputStyle} placeholder="07700 123456" />
                </div>
                <div>
                  <label style={labelStyle}>Email</label>
                  <input type="email" value={newBooking.email} onChange={e => setNewBooking({ ...newBooking, email: e.target.value })} style={inputStyle} placeholder="sarah@email.com" />
                </div>
                <div>
                  <label style={labelStyle}>Date *</label>
                  <input type="date" required value={newBooking.date} onChange={e => setNewBooking({ ...newBooking, date: e.target.value })} style={inputStyle} />
                </div>
                <div>
                  <label style={labelStyle}>Time *</label>
                  <select required value={newBooking.timeSlot} onChange={e => setNewBooking({ ...newBooking, timeSlot: e.target.value })} style={inputStyle}>
                    <option value="">Select time</option>
                    {DEFAULT_TIME_SLOTS.map(t => <option key={t} value={t}>{t}</option>)}
                  </select>
                </div>
                <div>
                  <label style={labelStyle}>Service</label>
                  <input value={newBooking.service} onChange={e => setNewBooking({ ...newBooking, service: e.target.value })} style={inputStyle} placeholder="e.g. Single Gem" />
                </div>
                <div>
                  <label style={labelStyle}>Price</label>
                  <input value={newBooking.price} onChange={e => setNewBooking({ ...newBooking, price: e.target.value })} style={inputStyle} placeholder="£45" />
                </div>
                <div>
                  <label style={labelStyle}>Source</label>
                  <select value={newBooking.source} onChange={e => setNewBooking({ ...newBooking, source: e.target.value })} style={inputStyle}>
                    <option value="booksy">Booksy</option>
                    <option value="phone">Phone</option>
                    <option value="walkin">Walk-in</option>
                    <option value="website">Website</option>
                  </select>
                </div>
                <div style={{ gridColumn: '1 / -1' }}>
                  <label style={labelStyle}>Notes</label>
                  <textarea value={newBooking.notes} onChange={e => setNewBooking({ ...newBooking, notes: e.target.value })} rows={2} style={{ ...inputStyle, resize: 'vertical' }} placeholder="Any notes..." />
                </div>
              </div>
              <div style={{ display: 'flex', gap: '1rem', marginTop: '0.5rem' }}>
                <button
                  type="submit"
                  disabled={adding}
                  style={{
                    padding: '0.85rem 2rem',
                    background: adding ? 'rgba(233,68,128,0.5)' : '#e94480',
                    color: '#ffffff',
                    border: 'none',
                    borderRadius: '50px',
                    fontSize: '0.75rem',
                    fontWeight: 500,
                    letterSpacing: '0.18em',
                    textTransform: 'uppercase',
                    cursor: adding ? 'not-allowed' : 'pointer',
                    flex: 1,
                  }}
                >
                  {adding ? 'Saving...' : 'Add to Diary'}
                </button>
                <button
                  type="button"
                  onClick={() => setShowAdd(false)}
                  style={{
                    padding: '0.85rem 2rem',
                    background: 'transparent',
                    color: 'rgba(255,255,255,0.6)',
                    border: '1px solid rgba(255,255,255,0.2)',
                    borderRadius: '50px',
                    fontSize: '0.75rem',
                    fontWeight: 500,
                    letterSpacing: '0.18em',
                    textTransform: 'uppercase',
                    cursor: 'pointer',
                  }}
                >
                  Cancel
                </button>
              </div>
            </form>
            <style jsx>{`
              @media (max-width: 768px) {
                .admin-add-grid {
                  grid-template-columns: 1fr !important;
                }
              }
            `}</style>
          </div>
        </div>
      )}
    </div>
  )
}
