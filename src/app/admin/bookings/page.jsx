'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import BookingCalendar from './BookingCalendar'

const STATUS_STYLES = {
  pending: { bg: 'rgba(233,68,128,0.1)', color: '#e94480', border: 'rgba(233,68,128,0.2)' },
  confirmed: { bg: 'rgba(34,197,94,0.1)', color: '#4ade80', border: 'rgba(34,197,94,0.2)' },
  rejected: { bg: 'rgba(239,68,68,0.1)', color: '#f87171', border: 'rgba(239,68,68,0.2)' },
  cancelled: { bg: 'rgba(255,255,255,0.05)', color: 'rgba(255,255,255,0.4)', border: 'rgba(255,255,255,0.1)' },
}

export default function BookingsPage() {
  const [bookings, setBookings] = useState([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState('all')
  const [view, setView] = useState('calendar') // 'calendar' or 'list'

  function fetchBookings() {
    setLoading(true)
    fetch('/api/bookings?limit=200&sort=-createdAt')
      .then(r => r.json())
      .then(data => {
        setBookings(data || [])
        setLoading(false)
      })
      .catch(() => setLoading(false))
  }

  useEffect(() => {
    fetchBookings()
  }, [])

  // Re-fetch when page regains focus (e.g. after editing a booking detail)
  useEffect(() => {
    function onFocus() { fetchBookings() }
    window.addEventListener('focus', onFocus)
    return () => window.removeEventListener('focus', onFocus)
  }, [])

  const filtered = filter === 'all' ? bookings : bookings.filter(b => b.status === filter)

  if (loading) {
    return <div style={{ padding: '2rem', color: 'rgba(255,255,255,0.4)' }}>Loading bookings...</div>
  }

  return (
    <div style={{ padding: '2.5rem 2rem', maxWidth: '1100px' }}>
      <div style={{ marginBottom: '2rem' }}>
        <Link href="/admin" style={{ fontSize: '0.75rem', color: '#e94480', textDecoration: 'none', letterSpacing: '0.1em', textTransform: 'uppercase' }}>
          &larr; Dashboard
        </Link>
        <h1 style={{ fontFamily: "'Pirata One', 'Playfair Display', cursive", fontSize: '1.8rem', color: '#e94480', letterSpacing: '0.08em', textTransform: 'uppercase', marginTop: '0.5rem' }}>
          Bookings
        </h1>
        <p style={{ fontSize: '0.85rem', color: 'rgba(255,255,255,0.4)', marginTop: '0.5rem' }}>
          View and manage bookings
        </p>
      </div>

      {/* View toggle + Filter tabs */}
      <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '2rem', flexWrap: 'wrap', alignItems: 'center' }}>
        {/* Calendar/List toggle */}
        <div style={{ display: 'flex', borderRadius: '50px', border: '1px solid rgba(255,255,255,0.1)', overflow: 'hidden', marginRight: '1rem' }}>
          <button
            onClick={() => setView('calendar')}
            style={{
              padding: '0.5rem 1rem',
              border: 'none',
              background: view === 'calendar' ? 'rgba(233,68,128,0.15)' : 'transparent',
              color: view === 'calendar' ? '#e94480' : 'rgba(255,255,255,0.5)',
              fontSize: '0.7rem',
              fontWeight: 500,
              letterSpacing: '0.1em',
              textTransform: 'uppercase',
              cursor: 'pointer',
              transition: 'all 0.2s ease',
            }}
          >
            Calendar
          </button>
          <button
            onClick={() => setView('list')}
            style={{
              padding: '0.5rem 1rem',
              border: 'none',
              background: view === 'list' ? 'rgba(233,68,128,0.15)' : 'transparent',
              color: view === 'list' ? '#e94480' : 'rgba(255,255,255,0.5)',
              fontSize: '0.7rem',
              fontWeight: 500,
              letterSpacing: '0.1em',
              textTransform: 'uppercase',
              cursor: 'pointer',
              transition: 'all 0.2s ease',
            }}
          >
            List
          </button>
        </div>

        {/* Status filters */}
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
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
                {['Date', 'Customer', 'Service', 'Status', 'Actions'].map(h => (
                  <th key={h} style={{ textAlign: 'left', padding: '0.75rem', fontSize: '0.7rem', letterSpacing: '0.12em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.4)', fontWeight: 500 }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.map(booking => {
                const status = booking.status || 'pending'
                const style = STATUS_STYLES[status] || STATUS_STYLES.pending
                return (
                  <tr key={booking.id} style={{ borderBottom: '1px solid rgba(255,255,255,0.04)' }}>
                    <td style={{ padding: '0.75rem', fontSize: '0.85rem', color: 'rgba(255,255,255,0.8)' }}>
                      {booking.date ? new Date(booking.date).toLocaleDateString('en-GB', { day: '2-digit', month: 'short' }) : '-'}
                      {booking.timeSlot && <span style={{ display: 'block', fontSize: '0.75rem', color: 'rgba(255,255,255,0.4)' }}>{booking.timeSlot}</span>}
                    </td>
                    <td style={{ padding: '0.75rem' }}>
                      <div style={{ color: 'rgba(255,255,255,0.85)', fontSize: '0.85rem' }}>{booking.name}</div>
                      <div style={{ color: 'rgba(255,255,255,0.4)', fontSize: '0.75rem' }}>{booking.email}</div>
                    </td>
                    <td style={{ padding: '0.75rem', color: 'rgba(255,255,255,0.6)', fontSize: '0.85rem' }}>
                      {booking.service || '-'}
                      {booking.price && <span style={{ color: 'rgba(255,255,255,0.35)', marginLeft: '0.5rem' }}>({booking.price})</span>}
                    </td>
                    <td style={{ padding: '0.75rem' }}>
                      <span style={{ padding: '0.25rem 0.6rem', borderRadius: '4px', fontSize: '0.65rem', fontWeight: 600, letterSpacing: '0.08em', textTransform: 'uppercase', background: style.bg, color: style.color, border: `1px solid ${style.border}` }}>
                        {status}
                      </span>
                    </td>
                    <td style={{ padding: '0.75rem' }}>
                      <Link href={`/admin/bookings/${booking.id}`} style={{ color: '#e94480', fontSize: '0.75rem', textDecoration: 'none', letterSpacing: '0.05em' }}>
                        View &rarr;
                      </Link>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}