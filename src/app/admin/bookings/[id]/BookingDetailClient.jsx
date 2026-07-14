'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'

const STATUS_STYLES = {
  pending: { bg: 'rgba(233,68,128,0.1)', color: '#e94480', border: 'rgba(233,68,128,0.2)' },
  confirmed: { bg: 'rgba(34,197,94,0.1)', color: '#4ade80', border: 'rgba(34,197,94,0.2)' },
  rejected: { bg: 'rgba(239,68,68,0.1)', color: '#f87171', border: 'rgba(239,68,68,0.2)' },
  cancelled: { bg: 'rgba(255,255,255,0.05)', color: 'rgba(255,255,255,0.4)', border: 'rgba(255,255,255,0.1)' },
}

function formatDate(date) {
  if (!date) return 'Not specified'
  return new Date(date).toLocaleDateString('en-GB', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })
}

function formatDateStr(str) {
  if (!str) return ''
  return new Date(str).toISOString().split('T')[0]
}

export default function BookingDetailClient({ booking }) {
  const [status, setStatus] = useState(booking?.status || 'pending')
  const [loading, setLoading] = useState(false)
  const [notes, setNotes] = useState(booking?.notes || '')
  const [altDate, setAltDate] = useState('')
  const [altTime, setAltTime] = useState('')
  const [showPropose, setShowPropose] = useState(false)

  if (!booking) {
    return <div style={{ padding: '2rem', color: 'rgba(255,255,255,0.4)' }}>Booking not found.</div>
  }

  const style = STATUS_STYLES[status] || STATUS_STYLES.pending
  const inputStyle = { width: '100%', padding: '0.85rem 1rem', background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px', color: '#ffffff', fontSize: '0.85rem', outline: 'none', fontFamily: "'Inter', sans-serif" }
  const labelStyle = { display: 'block', fontSize: '0.7rem', letterSpacing: '0.12em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.5)', marginBottom: '0.5rem' }

  async function confirmAsIs() {
    setLoading(true)
    try {
      const res = await fetch(`/api/bookings/${booking.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: 'confirmed', notes }),
      })
      if (!res.ok) throw new Error('Failed to confirm')
      setStatus('confirmed')
    } catch (err) {
      alert('Failed to confirm: ' + err.message)
    } finally {
      setLoading(false)
    }
  }

  async function proposeAlternative() {
    if (!altDate) return alert('Please select an alternative date')
    setLoading(true)
    try {
      const res = await fetch(`/api/bookings/${booking.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          proposedDate: altDate,
          proposedTime: altTime || null,
          notes: `Proposed alternative: ${formatDateStr(altDate)} at ${altTime || 'TBC'}. Customer preferred: ${formatDate(booking.date)} at ${booking.timeSlot || 'TBC'}`,
        }),
      })
      if (!res.ok) throw new Error('Failed to propose alternative')
      const data = await res.json()
      setStatus('pending')
      setShowPropose(false)
      alert('Alternative proposed! An email has been sent to the customer with accept/decline links.')
    } catch (err) {
      alert('Failed to propose: ' + err.message)
    } finally {
      setLoading(false)
    }
  }

  async function rejectBooking() {
    setLoading(true)
    try {
      const res = await fetch(`/api/bookings/${booking.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: 'rejected', notes: notes || 'Rejected - no slots available' }),
      })
      if (!res.ok) throw new Error('Failed to reject')
      setStatus('rejected')
    } catch (err) {
      alert('Failed to reject: ' + err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div style={{ padding: '2.5rem 2rem', maxWidth: '800px' }}>
      <div style={{ marginBottom: '2rem' }}>
        <Link href="/admin/bookings" style={{ fontSize: '0.75rem', color: '#e94480', textDecoration: 'none', letterSpacing: '0.1em', textTransform: 'uppercase' }}>
          &larr; Back to Bookings
        </Link>
        <h1 style={{ fontFamily: "'Pirata One', 'Playfair Display', cursive", fontSize: '1.8rem', color: '#e94480', letterSpacing: '0.08em', textTransform: 'uppercase', marginTop: '0.5rem' }}>
          Booking #{booking.id}
        </h1>
        <span style={{ padding: '0.25rem 0.6rem', borderRadius: '4px', fontSize: '0.65rem', fontWeight: 600, letterSpacing: '0.08em', textTransform: 'uppercase', background: style.bg, color: style.color, border: `1px solid ${style.border}` }}>
          {status}
        </span>
      </div>

      {/* Booking Details */}
      <div style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)', borderRadius: '12px', padding: '1.5rem', marginBottom: '2rem' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
          <div>
            <label style={labelStyle}>Customer</label>
            <div style={{ color: 'rgba(255,255,255,0.85)', fontSize: '0.95rem' }}>{booking.name}</div>
          </div>
          <div>
            <label style={labelStyle}>Email</label>
            <div style={{ color: 'rgba(255,255,255,0.85)', fontSize: '0.95rem' }}>{booking.email}</div>
          </div>
          <div>
            <label style={labelStyle}>Phone</label>
            <div style={{ color: 'rgba(255,255,255,0.85)', fontSize: '0.95rem' }}>{booking.phone || 'Not provided'}</div>
          </div>
          <div>
            <label style={labelStyle}>Service</label>
            <div style={{ color: 'rgba(255,255,255,0.85)', fontSize: '0.95rem' }}>{booking.service || 'Not specified'} {booking.price && <span style={{ color: 'rgba(255,255,255,0.5)' }}>({booking.price})</span>}</div>
          </div>
          <div>
            <label style={labelStyle}>Preferred Date</label>
            <div style={{ color: '#e94480', fontSize: '0.95rem' }}>{formatDate(booking.date)}</div>
          </div>
          <div>
            <label style={labelStyle}>Preferred Time</label>
            <div style={{ color: '#e94480', fontSize: '0.95rem' }}>{booking.timeSlot || 'Not specified'}</div>
          </div>
        </div>
        {booking.message && (
          <div style={{ marginTop: '1rem', paddingTop: '1rem', borderTop: '1px solid rgba(255,255,255,0.06)' }}>
            <label style={labelStyle}>Message</label>
            <div style={{ color: 'rgba(255,255,255,0.7)', fontSize: '0.85rem', lineHeight: 1.6 }}>{booking.message}</div>
          </div>
        )}
      </div>

      {/* Actions */}
      {status === 'pending' && (
        <div style={{ marginBottom: '2rem' }}>
          <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
            <button
              onClick={confirmAsIs}
              disabled={loading}
              style={{ padding: '0.75rem 1.5rem', borderRadius: '50px', border: '1px solid rgba(76,175,80,0.4)', background: 'rgba(76,175,80,0.1)', color: '#81c784', fontSize: '0.75rem', fontWeight: 500, letterSpacing: '0.1em', textTransform: 'uppercase', cursor: loading ? 'not-allowed' : 'pointer', opacity: status === 'confirmed' ? 0.5 : 1 }}
            >
              {loading ? 'Processing...' : 'Confirm Booking'}
            </button>
            <button
              onClick={() => setShowPropose(!showPropose)}
              style={{ padding: '0.75rem 1.5rem', borderRadius: '50px', border: '1px solid rgba(233,68,128,0.4)', background: 'rgba(233,68,128,0.1)', color: '#e94480', fontSize: '0.75rem', fontWeight: 500, letterSpacing: '0.1em', textTransform: 'uppercase', cursor: 'pointer' }}
            >
              Propose Alternative
            </button>
            <button
              onClick={rejectBooking}
              disabled={loading}
              style={{ padding: '0.75rem 1.5rem', borderRadius: '50px', border: '1px solid rgba(244,67,54,0.4)', background: 'rgba(244,67,54,0.1)', color: '#e57373', fontSize: '0.75rem', fontWeight: 500, letterSpacing: '0.1em', textTransform: 'uppercase', cursor: loading ? 'not-allowed' : 'pointer', opacity: status === 'rejected' ? 0.5 : 1 }}
            >
              {loading ? 'Processing...' : 'Reject'}
            </button>
          </div>

          {showPropose && (
            <div style={{ marginTop: '1.5rem', padding: '1.5rem', background: 'rgba(233,68,128,0.05)', border: '1px solid rgba(233,68,128,0.15)', borderRadius: '12px' }}>
              <p style={{ fontSize: '0.85rem', color: 'rgba(255,255,255,0.6)', marginBottom: '1rem' }}>
                Propose an alternative date and time to the customer. They will receive an email with accept/decline links valid for 48 hours.
              </p>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div>
                  <label style={labelStyle}>Alternative Date</label>
                  <input type="date" value={altDate} onChange={(e) => setAltDate(e.target.value)} style={inputStyle} />
                </div>
                <div>
                  <label style={labelStyle}>Alternative Time</label>
                  <input type="time" value={altTime} onChange={(e) => setAltTime(e.target.value)} style={inputStyle} />
                </div>
              </div>
              <button
                onClick={proposeAlternative}
                disabled={loading || !altDate}
                style={{ marginTop: '1rem', padding: '0.75rem 1.5rem', borderRadius: '50px', border: '1px solid rgba(233,68,128,0.4)', background: 'rgba(233,68,128,0.15)', color: '#e94480', fontSize: '0.75rem', fontWeight: 500, letterSpacing: '0.1em', textTransform: 'uppercase', cursor: loading ? 'not-allowed' : 'pointer' }}
              >
                Send Proposal
              </button>
            </div>
          )}
        </div>
      )}

      {/* Notes */}
      <div style={{ marginBottom: '2rem' }}>
        <label style={labelStyle}>Internal Notes</label>
        <textarea
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          placeholder="Add internal notes..."
          rows={3}
          style={{ ...inputStyle, resize: 'vertical' }}
        />
      </div>

      {/* Metadata */}
      <div style={{ fontSize: '0.7rem', color: 'rgba(255,255,255,0.3)', letterSpacing: '0.05em' }}>
        <div>Created: {new Date(booking.createdAt).toLocaleString('en-GB')}</div>
        {booking.confirmedAt && <div>Confirmed: {new Date(booking.confirmedAt).toLocaleString('en-GB')}</div>}
        {booking.proposalToken && <div>Proposal sent (token: {booking.proposalToken.substring(0, 8)}...)</div>}
      </div>
    </div>
  )
}