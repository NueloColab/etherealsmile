'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'

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

export default function BookingDetailClient({ booking: initialBooking }) {
  const router = useRouter()
  const [booking, setBooking] = useState(initialBooking)
  const [status, setStatus] = useState(initialBooking?.status || 'pending')
  const [loading, setLoading] = useState(false)
  const [notes, setNotes] = useState(initialBooking?.notes || '')
  const [altDate, setAltDate] = useState('')
  const [altTime, setAltTime] = useState('')
  const [showPropose, setShowPropose] = useState(false)
  const [editing, setEditing] = useState(false)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')
  const [editForm, setEditForm] = useState({})

  if (!booking) {
    return <div style={{ padding: '2rem', color: 'rgba(255,255,255,0.4)' }}>Booking not found.</div>
  }

  const style = STATUS_STYLES[status] || STATUS_STYLES.pending
  const display = editing ? editForm : booking
  const inputStyle = { width: '100%', padding: '0.6rem 0.75rem', background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.12)', borderRadius: '6px', color: '#ffffff', fontSize: '0.85rem', outline: 'none', fontFamily: "'Inter', sans-serif" }
  const labelStyle = { display: 'block', fontSize: '0.7rem', letterSpacing: '0.12em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.5)', marginBottom: '0.25rem' }

  function startEditing() {
    setEditForm({
      name: booking.name || '',
      email: booking.email || '',
      phone: booking.phone || '',
      date: booking.date ? new Date(booking.date).toISOString().split('T')[0] : '',
      timeSlot: booking.timeSlot || '',
      service: booking.service || '',
      price: booking.price || '',
      message: booking.message || '',
      notes: booking.notes || '',
    })
    setEditing(true)
    setError('')
  }

  function cancelEditing() {
    setEditing(false)
    setError('')
  }

  async function saveEditing() {
    setSaving(true)
    setError('')
    try {
      const res = await fetch(`/api/bookings/${booking.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(editForm),
      })
      if (!res.ok) {
        const errData = await res.json()
        throw new Error(errData.error || 'Failed to save')
      }
      // Re-fetch fresh data
      const freshRes = await fetch(`/api/bookings/${booking.id}`)
      const freshData = await freshRes.json()
      setBooking(freshData)
      setStatus(freshData.status)
      setNotes(freshData.notes || '')
      setEditing(false)
    } catch (err) {
      setError(err.message || 'Failed to save')
    } finally {
      setSaving(false)
    }
  }

  async function deleteBooking() {
    const name = booking.name
    const date = booking.date ? new Date(booking.date).toLocaleDateString('en-GB', { day: '2-digit', month: 'short' }) : 'No date'
    const confirmed = window.confirm(`Delete this booking for ${name} on ${date}?`)
    if (!confirmed) return

    try {
      const res = await fetch(`/api/bookings/${booking.id}`, { method: 'DELETE' })
      if (!res.ok) throw new Error('Failed to delete')
      router.push('/admin/bookings')
    } catch (err) {
      alert('Failed to delete: ' + err.message)
    }
  }

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
      // Re-fetch to update booking data
      const freshRes = await fetch(`/api/bookings/${booking.id}`)
      const freshData = await freshRes.json()
      setBooking(freshData)
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
          notes: notes || `Proposed alternative: ${altDate} at ${altTime || 'TBC'}. Customer preferred: ${formatDate(booking.date)} at ${booking.timeSlot || 'TBC'}`,
        }),
      })
      if (!res.ok) throw new Error('Failed to propose alternative')
      const data = await res.json()
      setStatus('pending')
      setShowPropose(false)
      alert('Alternative proposed! An email has been sent to the customer with accept/decline links.')
      // Re-fetch
      const freshRes = await fetch(`/api/bookings/${booking.id}`)
      const freshData = await freshRes.json()
      setBooking(freshData)
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
      const freshRes = await fetch(`/api/bookings/${booking.id}`)
      const freshData = await freshRes.json()
      setBooking(freshData)
    } catch (err) {
      alert('Failed to reject: ' + err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div style={{ padding: '2.5rem 2rem', maxWidth: '800px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '2rem' }}>
        <div>
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
        {!editing && (
          <div style={{ display: 'flex', gap: '0.5rem' }}>
            <button onClick={startEditing} style={{ padding: '0.5rem 1rem', borderRadius: '6px', border: '1px solid rgba(233,68,128,0.4)', background: 'rgba(233,68,128,0.1)', color: '#e94480', fontSize: '0.7rem', fontWeight: 500, letterSpacing: '0.08em', textTransform: 'uppercase', cursor: 'pointer' }}>
              Edit
            </button>
            <button onClick={deleteBooking} style={{ padding: '0.5rem 1rem', borderRadius: '6px', border: '1px solid rgba(239,68,68,0.4)', background: 'rgba(239,68,68,0.1)', color: '#e57373', fontSize: '0.7rem', fontWeight: 500, letterSpacing: '0.08em', textTransform: 'uppercase', cursor: 'pointer' }}>
              Delete
            </button>
          </div>
        )}
      </div>

      {error && (
        <div style={{ padding: '0.75rem 1rem', marginBottom: '1rem', background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.3)', borderRadius: '6px', color: '#f87171', fontSize: '0.85rem' }}>
          {error}
        </div>
      )}

      {/* Booking Details */}
      <div style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)', borderRadius: '12px', padding: '1.5rem', marginBottom: '2rem' }}>
        <div className="admin-booking-grid" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
          <div>
            <label style={labelStyle}>Customer</label>
            {editing ? (
              <input value={editForm.name} onChange={e => setEditForm({ ...editForm, name: e.target.value })} style={inputStyle} />
            ) : (
              <div style={{ color: 'rgba(255,255,255,0.85)', fontSize: '0.95rem' }}>{booking.name}</div>
            )}
          </div>
          <div>
            <label style={labelStyle}>Email</label>
            {editing ? (
              <input value={editForm.email} onChange={e => setEditForm({ ...editForm, email: e.target.value })} style={inputStyle} />
            ) : (
              <div style={{ color: 'rgba(255,255,255,0.85)', fontSize: '0.95rem' }}>{booking.email}</div>
            )}
          </div>
          <div>
            <label style={labelStyle}>Phone</label>
            {editing ? (
              <input value={editForm.phone} onChange={e => setEditForm({ ...editForm, phone: e.target.value })} style={inputStyle} />
            ) : (
              <div style={{ color: 'rgba(255,255,255,0.85)', fontSize: '0.95rem' }}>{booking.phone || 'Not provided'}</div>
            )}
          </div>
          <div>
            <label style={labelStyle}>Service</label>
            {editing ? (
              <input value={editForm.service} onChange={e => setEditForm({ ...editForm, service: e.target.value })} style={inputStyle} />
            ) : (
              <div style={{ color: 'rgba(255,255,255,0.85)', fontSize: '0.95rem' }}>{booking.service || 'Not specified'} {booking.price && <span style={{ color: 'rgba(255,255,255,0.5)' }}>({booking.price})</span>}</div>
            )}
          </div>
          <div>
            <label style={labelStyle}>Preferred Date</label>
            {editing ? (
              <input type="date" value={editForm.date} onChange={e => setEditForm({ ...editForm, date: e.target.value })} style={inputStyle} />
            ) : (
              <div style={{ color: '#e94480', fontSize: '0.95rem' }}>{formatDate(booking.date)}</div>
            )}
          </div>
          <div>
            <label style={labelStyle}>Preferred Time</label>
            {editing ? (
              <input value={editForm.timeSlot} onChange={e => setEditForm({ ...editForm, timeSlot: e.target.value })} style={inputStyle} placeholder="e.g. 14:30" />
            ) : (
              <div style={{ color: '#e94480', fontSize: '0.95rem' }}>{booking.timeSlot || 'Not specified'}</div>
            )}
          </div>
          {editing && (
            <>
              <div>
                <label style={labelStyle}>Price</label>
                <input value={editForm.price} onChange={e => setEditForm({ ...editForm, price: e.target.value })} style={inputStyle} placeholder="e.g. £35" />
              </div>
              <div style={{ gridColumn: '1 / -1' }}>
                <label style={labelStyle}>Message</label>
                <textarea value={editForm.message} onChange={e => setEditForm({ ...editForm, message: e.target.value })} rows={3} style={{ ...inputStyle, resize: 'vertical' }} />
              </div>
            </>
          )}
        </div>
        {!editing && booking.message && (
          <div style={{ marginTop: '1rem', paddingTop: '1rem', borderTop: '1px solid rgba(255,255,255,0.06)' }}>
            <label style={labelStyle}>Message</label>
            <div style={{ color: 'rgba(255,255,255,0.7)', fontSize: '0.85rem', lineHeight: 1.6 }}>{booking.message}</div>
          </div>
        )}
        {editing && (
          <div style={{ marginTop: '1rem', display: 'flex', gap: '0.5rem' }}>
            <button onClick={saveEditing} disabled={saving} style={{ padding: '0.5rem 1rem', borderRadius: '6px', border: '1px solid rgba(34,197,94,0.4)', background: 'rgba(34,197,94,0.1)', color: '#4ade80', fontSize: '0.7rem', fontWeight: 500, letterSpacing: '0.08em', textTransform: 'uppercase', cursor: saving ? 'not-allowed' : 'pointer' }}>
              {saving ? 'Saving...' : 'Save'}
            </button>
            <button onClick={cancelEditing} style={{ padding: '0.5rem 1rem', borderRadius: '6px', border: '1px solid rgba(255,255,255,0.1)', background: 'rgba(255,255,255,0.04)', color: 'rgba(255,255,255,0.6)', fontSize: '0.7rem', fontWeight: 500, letterSpacing: '0.08em', textTransform: 'uppercase', cursor: 'pointer' }}>
              Cancel
            </button>
          </div>
        )}
      </div>

      {/* Actions (only when not editing) */}
      {status === 'pending' && !editing && (
        <div style={{ marginBottom: '2rem' }}>
          <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
            <button onClick={confirmAsIs} disabled={loading} style={{ padding: '0.75rem 1.5rem', borderRadius: '50px', border: '1px solid rgba(76,175,80,0.4)', background: 'rgba(76,175,80,0.1)', color: '#81c784', fontSize: '0.75rem', fontWeight: 500, letterSpacing: '0.1em', textTransform: 'uppercase', cursor: loading ? 'not-allowed' : 'pointer' }}>
              {loading ? 'Processing...' : 'Confirm Booking'}
            </button>
            <button onClick={() => setShowPropose(!showPropose)} style={{ padding: '0.75rem 1.5rem', borderRadius: '50px', border: '1px solid rgba(233,68,128,0.4)', background: 'rgba(233,68,128,0.1)', color: '#e94480', fontSize: '0.75rem', fontWeight: 500, letterSpacing: '0.1em', textTransform: 'uppercase', cursor: 'pointer' }}>
              Propose Alternative
            </button>
            <button onClick={rejectBooking} disabled={loading} style={{ padding: '0.75rem 1.5rem', borderRadius: '50px', border: '1px solid rgba(244,67,54,0.4)', background: 'rgba(244,67,54,0.1)', color: '#e57373', fontSize: '0.75rem', fontWeight: 500, letterSpacing: '0.1em', textTransform: 'uppercase', cursor: loading ? 'not-allowed' : 'pointer' }}>
              {loading ? 'Processing...' : 'Reject'}
            </button>
          </div>

          {showPropose && (
            <div style={{ marginTop: '1.5rem', padding: '1.5rem', background: 'rgba(233,68,128,0.05)', border: '1px solid rgba(233,68,128,0.15)', borderRadius: '12px' }}>
              <p style={{ fontSize: '0.85rem', color: 'rgba(255,255,255,0.6)', marginBottom: '1rem' }}>
                Propose an alternative date and time to the customer. They will receive an email with accept/decline links valid for 48 hours.
              </p>
              <div className="admin-booking-grid" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div>
                  <label style={labelStyle}>Alternative Date</label>
                  <input type="date" value={altDate} onChange={(e) => setAltDate(e.target.value)} style={inputStyle} />
                </div>
                <div>
                  <label style={labelStyle}>Alternative Time</label>
                  <input type="time" value={altTime} onChange={(e) => setAltTime(e.target.value)} style={inputStyle} />
                </div>
              </div>
              <button onClick={proposeAlternative} disabled={loading || !altDate} style={{ marginTop: '1rem', padding: '0.75rem 1.5rem', borderRadius: '50px', border: '1px solid rgba(233,68,128,0.4)', background: 'rgba(233,68,128,0.15)', color: '#e94480', fontSize: '0.75rem', fontWeight: 500, letterSpacing: '0.1em', textTransform: 'uppercase', cursor: loading ? 'not-allowed' : 'pointer' }}>
                Send Proposal
              </button>
            </div>
          )}
        </div>
      )}

      {/* Notes */}
      {!editing && (
        <div style={{ marginBottom: '2rem' }}>
          <label style={labelStyle}>Internal Notes</label>
          <textarea value={notes} onChange={(e) => setNotes(e.target.value)} placeholder="Add internal notes..." rows={3} style={{ ...inputStyle, resize: 'vertical' }} />
        </div>
      )}

      {/* Metadata */}
      <div style={{ fontSize: '0.7rem', color: 'rgba(255,255,255,0.3)', letterSpacing: '0.05em' }}>
        <div>Created: {new Date(booking.createdAt).toLocaleString('en-GB')}</div>
        {booking.confirmedAt && <div>Confirmed: {new Date(booking.confirmedAt).toLocaleString('en-GB')}</div>}
        {booking.proposalToken && <div>Proposal sent (token: {booking.proposalToken.substring(0, 8)}...)</div>}
      </div>

      {/* Consent Status */}
      {booking.status === 'confirmed' && (
        <div style={{ marginTop: '1rem', padding: '0.75rem', borderRadius: '8px', background: booking.consentSendError ? 'rgba(239,68,68,0.08)' : booking.consentSentAt ? 'rgba(34,197,94,0.08)' : 'rgba(255,255,255,0.03)', border: `1px solid ${booking.consentSendError ? 'rgba(239,68,68,0.2)' : booking.consentSentAt ? 'rgba(34,197,94,0.2)' : 'rgba(255,255,255,0.06)'}` }}>
          <div style={{ fontSize: '0.7rem', letterSpacing: '0.1em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.4)', marginBottom: '0.25rem' }}>Consent Forms</div>
          {booking.consentSentAt && !booking.consentSendError && (
            <div style={{ fontSize: '0.85rem', color: '#4ade80' }}>
              Sent {new Date(booking.consentSentAt).toLocaleString('en-GB')}
            </div>
          )}
          {booking.consentSendError && (
            <div style={{ fontSize: '0.85rem', color: '#f87171' }}>
              Failed: {booking.consentSendError}
            </div>
          )}
          {!booking.consentSentAt && !booking.consentSendError && (
            <div style={{ fontSize: '0.85rem', color: 'rgba(255,255,255,0.4)' }}>
              Not yet sent
            </div>
          )}
          {booking.isMinor && (
            <div style={{ fontSize: '0.75rem', color: '#e94480', marginTop: '0.25rem' }}>
              Under 18 booking - guardian consent required
            </div>
          )}
        </div>
      )}
      <style jsx>{`
        @media (max-width: 768px) {
          .admin-booking-grid {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>
    </div>
  )
}