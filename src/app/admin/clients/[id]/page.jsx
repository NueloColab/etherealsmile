'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useParams, useRouter } from 'next/navigation'
import ConsentRecordsPanel from '../../../../components/ConsentRecordsPanel'

const STATUS_STYLES = {
  pending: { bg: 'rgba(233,68,128,0.1)', color: '#e94480', border: 'rgba(233,68,128,0.2)' },
  confirmed: { bg: 'rgba(34,197,94,0.1)', color: '#4ade80', border: 'rgba(34,197,94,0.2)' },
  rejected: { bg: 'rgba(239,68,68,0.1)', color: '#f87171', border: 'rgba(239,68,68,0.2)' },
  cancelled: { bg: 'rgba(255,255,255,0.05)', color: 'rgba(255,255,255,0.4)', border: 'rgba(255,255,255,0.1)' },
}

const SOURCE_LABELS = {
  booking_confirmed: 'Auto (Booking Confirmed)',
  manual_promote: 'Promoted from Booking',
  manual: 'Manual Entry',
  newsletter: 'Newsletter Signup',
}

export default function ClientDetailPage() {
  const params = useParams()
  const router = useRouter()
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [notFound, setNotFound] = useState(false)
  const [editing, setEditing] = useState(false)
  const [saving, setSaving] = useState(false)
  const [editForm, setEditForm] = useState({})
  const [error, setError] = useState('')

  useEffect(() => {
    fetch(`/api/clients/${params.id}`)
      .then(r => {
        if (!r.ok) {
          setNotFound(true)
          setLoading(false)
          return null
        }
        return r.json()
      })
      .then(data => {
        if (data) setData(data)
        setLoading(false)
      })
      .catch(() => {
        setNotFound(true)
        setLoading(false)
      })
  }, [params.id])

  if (loading) {
    return <div style={{ padding: '2rem', color: 'rgba(255,255,255,0.4)' }}>Loading client...</div>
  }

  if (notFound || !data || data.error) {
    return <div style={{ padding: '2rem', color: 'rgba(255,255,255,0.4)' }}>
      <Link href="/admin/clients" style={{ fontSize: '0.75rem', color: '#e94480', textDecoration: 'none', letterSpacing: '0.1em', textTransform: 'uppercase' }}>&larr; Clients</Link>
      <p style={{ marginTop: '1rem', fontSize: '0.95rem' }}>Client not found.</p>
    </div>
  }

  const { bookings: clientBookings, ...client } = data
  const displayClient = editing ? editForm : client

  function startEditing() {
    setEditForm({ name: client.name, email: client.email, phone: client.phone || '', instagram: client.instagram || '', notes: client.notes || '', marketingConsent: client.marketingConsent })
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
      const res = await fetch(`/api/clients/${params.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(editForm),
      })
      if (!res.ok) {
        const errData = await res.json()
        if (errData.error === 'EMAIL_EXISTS') {
          setError('A client with this email already exists')
          setSaving(false)
          return
        }
        throw new Error(errData.error || 'Failed to save')
      }
      const updated = await res.json()
      // Re-fetch to get fresh data including bookings
      const freshRes = await fetch(`/api/clients/${params.id}`)
      const freshData = await freshRes.json()
      setData(freshData)
      setEditing(false)
    } catch (err) {
      setError(err.message || 'Failed to save')
    } finally {
      setSaving(false)
    }
  }

  async function deleteClient() {
    const name = client.name
    const email = client.email
    const confirmed = window.confirm(`Delete ${name} (${email})? Their bookings will be kept but unlinked from this client.`)
    if (!confirmed) return

    try {
      const res = await fetch(`/api/clients/${params.id}`, { method: 'DELETE' })
      if (!res.ok) throw new Error('Failed to delete')
      router.push('/admin/clients')
    } catch (err) {
      alert('Failed to delete: ' + err.message)
    }
  }

  const inputStyle = { width: '100%', padding: '0.6rem 0.75rem', background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.12)', borderRadius: '6px', color: '#ffffff', fontSize: '0.85rem', outline: 'none', fontFamily: "'Inter', sans-serif" }
  const labelStyle = { display: 'block', fontSize: '0.65rem', letterSpacing: '0.12em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.4)', marginBottom: '0.25rem' }

  return (
    <div style={{ padding: '2.5rem 2rem', maxWidth: '900px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '2rem' }}>
        <div>
          <Link href="/admin/clients" style={{ fontSize: '0.75rem', color: '#e94480', textDecoration: 'none', letterSpacing: '0.1em', textTransform: 'uppercase' }}>
            &larr; Clients
          </Link>
          <h1 style={{ fontFamily: "'Pirata One', 'Playfair Display', cursive", fontSize: '1.8rem', color: '#e94480', letterSpacing: '0.08em', textTransform: 'uppercase', marginTop: '0.5rem' }}>
            {editing ? editForm.name : client.name}
          </h1>
        </div>
        <div style={{ display: 'flex', gap: '0.5rem' }}>
          {!editing ? (
            <>
              <button onClick={startEditing} style={{ padding: '0.5rem 1rem', borderRadius: '6px', border: '1px solid rgba(233,68,128,0.4)', background: 'rgba(233,68,128,0.1)', color: '#e94480', fontSize: '0.7rem', fontWeight: 500, letterSpacing: '0.08em', textTransform: 'uppercase', cursor: 'pointer' }}>
                Edit
              </button>
              <button onClick={deleteClient} style={{ padding: '0.5rem 1rem', borderRadius: '6px', border: '1px solid rgba(239,68,68,0.4)', background: 'rgba(239,68,68,0.1)', color: '#e57373', fontSize: '0.7rem', fontWeight: 500, letterSpacing: '0.08em', textTransform: 'uppercase', cursor: 'pointer' }}>
                Delete
              </button>
            </>
          ) : (
            <>
              <button onClick={saveEditing} disabled={saving} style={{ padding: '0.5rem 1rem', borderRadius: '6px', border: '1px solid rgba(34,197,94,0.4)', background: 'rgba(34,197,94,0.1)', color: '#4ade80', fontSize: '0.7rem', fontWeight: 500, letterSpacing: '0.08em', textTransform: 'uppercase', cursor: saving ? 'not-allowed' : 'pointer' }}>
                {saving ? 'Saving...' : 'Save'}
              </button>
              <button onClick={cancelEditing} style={{ padding: '0.5rem 1rem', borderRadius: '6px', border: '1px solid rgba(255,255,255,0.1)', background: 'rgba(255,255,255,0.04)', color: 'rgba(255,255,255,0.6)', fontSize: '0.7rem', fontWeight: 500, letterSpacing: '0.08em', textTransform: 'uppercase', cursor: 'pointer' }}>
                Cancel
              </button>
            </>
          )}
        </div>
      </div>

      {error && (
        <div style={{ padding: '0.75rem 1rem', marginBottom: '1rem', background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.3)', borderRadius: '6px', color: '#f87171', fontSize: '0.85rem' }}>
          {error}
        </div>
      )}

      {/* Client info card */}
      <div style={{ padding: '1.5rem', background: 'rgba(233,68,128,0.04)', border: '1px solid rgba(233,68,128,0.12)', borderRadius: '12px', marginBottom: '2rem' }}>
        <div className="admin-client-grid" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
          <div>
            <span style={labelStyle}>Email</span>
            {editing ? (
              <input value={editForm.email} onChange={e => setEditForm({ ...editForm, email: e.target.value })} style={inputStyle} />
            ) : (
              <span style={{ color: 'rgba(255,255,255,0.85)', fontSize: '0.9rem' }}>{client.email}</span>
            )}
          </div>
          <div>
            <span style={labelStyle}>Phone</span>
            {editing ? (
              <input value={editForm.phone} onChange={e => setEditForm({ ...editForm, phone: e.target.value })} style={inputStyle} />
            ) : (
              <span style={{ color: 'rgba(255,255,255,0.85)', fontSize: '0.9rem' }}>{client.phone || '-'}</span>
            )}
          </div>
          <div>
            <span style={labelStyle}>Name</span>
            {editing ? (
              <input value={editForm.name} onChange={e => setEditForm({ ...editForm, name: e.target.value })} style={inputStyle} />
            ) : (
              <span style={{ color: 'rgba(255,255,255,0.85)', fontSize: '0.9rem' }}>{client.name}</span>
            )}
          </div>
          <div>
            <span style={labelStyle}>Instagram</span>
            {editing ? (
              <input value={editForm.instagram} onChange={e => setEditForm({ ...editForm, instagram: e.target.value })} style={inputStyle} placeholder="@username" />
            ) : (
              <span style={{ color: 'rgba(255,255,255,0.85)', fontSize: '0.9rem' }}>{client.instagram || '-'}</span>
            )}
          </div>
          <div>
            <span style={labelStyle}>Source</span>
            <span style={{ padding: '0.2rem 0.5rem', borderRadius: '4px', fontSize: '0.7rem', fontWeight: 600, letterSpacing: '0.06em', textTransform: 'uppercase', background: 'rgba(255,255,255,0.05)', color: 'rgba(255,255,255,0.5)', border: '1px solid rgba(255,255,255,0.1)' }}>
              {SOURCE_LABELS[client.source] || client.source}
            </span>
          </div>
          <div>
            <span style={labelStyle}>Marketing Consent</span>
            {editing ? (
              <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer', color: 'rgba(255,255,255,0.85)', fontSize: '0.85rem' }}>
                <input type="checkbox" checked={editForm.marketingConsent} onChange={e => setEditForm({ ...editForm, marketingConsent: e.target.checked })} style={{ accentColor: '#e94480' }} />
                {editForm.marketingConsent ? 'Opted In' : 'Not Opted In'}
              </label>
            ) : (
              <span style={{ padding: '0.2rem 0.5rem', borderRadius: '4px', fontSize: '0.7rem', fontWeight: 600, letterSpacing: '0.06em', textTransform: 'uppercase', background: client.marketingConsent ? 'rgba(34,197,94,0.1)' : 'rgba(255,255,255,0.04)', color: client.marketingConsent ? '#4ade80' : 'rgba(255,255,255,0.3)', border: `1px solid ${client.marketingConsent ? 'rgba(34,197,94,0.2)' : 'rgba(255,255,255,0.08)'}` }}>
                {client.marketingConsent ? 'Opted In' : 'Not Opted In'}
              </span>
            )}
          </div>
          <div style={{ gridColumn: '1 / -1' }}>
            <span style={labelStyle}>Client Since</span>
            <span style={{ color: 'rgba(255,255,255,0.85)', fontSize: '0.9rem' }}>
              {new Date(client.createdAt).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })}
            </span>
          </div>
        </div>
        <div style={{ marginTop: '1rem' }}>
          <span style={labelStyle}>Notes</span>
          {editing ? (
            <textarea value={editForm.notes} onChange={e => setEditForm({ ...editForm, notes: e.target.value })} rows={3} style={{ ...inputStyle, resize: 'vertical' }} placeholder="Add notes..." />
          ) : (
            <span style={{ color: client.notes ? 'rgba(255,255,255,0.7)' : 'rgba(255,255,255,0.3)', fontSize: '0.85rem' }}>{client.notes || 'No notes'}</span>
          )}
        </div>
      </div>

      {/* Consent Records */}
      <ConsentRecordsPanel scope="client" targetId={client.id} />

      {/* Booking history */}
      <h2 style={{ fontFamily: "'Inter', sans-serif", fontSize: '0.8rem', letterSpacing: '0.12em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.5)', marginBottom: '1rem' }}>
        Booking History ({clientBookings?.length || 0})
      </h2>

      {(!clientBookings || clientBookings.length === 0) ? (
        <p style={{ color: 'rgba(255,255,255,0.3)', fontSize: '0.85rem' }}>No linked bookings.</p>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
          {clientBookings.map(booking => {
            const status = booking.status || 'pending'
            const style = STATUS_STYLES[status] || STATUS_STYLES.pending
            return (
              <div key={booking.id} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0.75rem', background: 'rgba(255,255,255,0.03)', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.06)' }}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.15rem' }}>
                  <span style={{ color: 'rgba(255,255,255,0.85)', fontSize: '0.85rem' }}>
                    {booking.date ? new Date(booking.date).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }) : '-'}
                    {booking.timeSlot && <span style={{ color: 'rgba(255,255,255,0.4)' }}> at {booking.timeSlot}</span>}
                  </span>
                  <span style={{ color: 'rgba(255,255,255,0.4)', fontSize: '0.75rem' }}>
                    {booking.service}{booking.price ? ` · ${booking.price}` : ''}
                  </span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                  <span style={{ padding: '0.2rem 0.6rem', borderRadius: '4px', fontSize: '0.6rem', fontWeight: 600, letterSpacing: '0.08em', textTransform: 'uppercase', background: style.bg, color: style.color, border: `1px solid ${style.border}` }}>
                    {status}
                  </span>
                  <Link href={`/admin/bookings/${booking.id}`} style={{ color: '#e94480', fontSize: '0.75rem', textDecoration: 'none', letterSpacing: '0.05em' }}>
                    View &rarr;
                  </Link>
                </div>
              </div>
            )
          })}
        </div>
      )}
      <style jsx>{`
        @media (max-width: 768px) {
          .admin-client-grid {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>
    </div>
  )
}