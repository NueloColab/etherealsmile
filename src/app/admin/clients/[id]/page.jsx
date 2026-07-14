'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useParams } from 'next/navigation'

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
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch(`/api/clients/${params.id}`)
      .then(r => r.json())
      .then(data => {
        setData(data)
        setLoading(false)
      })
      .catch(() => setLoading(false))
  }, [params.id])

  if (loading) {
    return <div style={{ padding: '2rem', color: 'rgba(255,255,255,0.4)' }}>Loading client...</div>
  }

  if (!data) {
    return <div style={{ padding: '2rem', color: 'rgba(255,255,255,0.4)' }}>Client not found.</div>
  }

  const { bookings: clientBookings, ...client } = data

  return (
    <div style={{ padding: '2.5rem 2rem', maxWidth: '900px' }}>
      <div style={{ marginBottom: '2rem' }}>
        <Link href="/admin/clients" style={{ fontSize: '0.75rem', color: '#e94480', textDecoration: 'none', letterSpacing: '0.1em', textTransform: 'uppercase' }}>
          &larr; Clients
        </Link>
        <h1 style={{ fontFamily: "'Pirata One', 'Playfair Display', cursive", fontSize: '1.8rem', color: '#e94480', letterSpacing: '0.08em', textTransform: 'uppercase', marginTop: '0.5rem' }}>
          {client.name}
        </h1>
      </div>

      {/* Client info card */}
      <div style={{ padding: '1.5rem', background: 'rgba(233,68,128,0.04)', border: '1px solid rgba(233,68,128,0.12)', borderRadius: '12px', marginBottom: '2rem' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
          <div>
            <span style={{ display: 'block', fontSize: '0.65rem', letterSpacing: '0.12em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.4)', marginBottom: '0.25rem' }}>Email</span>
            <span style={{ color: 'rgba(255,255,255,0.85)', fontSize: '0.9rem' }}>{client.email}</span>
          </div>
          <div>
            <span style={{ display: 'block', fontSize: '0.65rem', letterSpacing: '0.12em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.4)', marginBottom: '0.25rem' }}>Phone</span>
            <span style={{ color: 'rgba(255,255,255,0.85)', fontSize: '0.9rem' }}>{client.phone || '-'}</span>
          </div>
          <div>
            <span style={{ display: 'block', fontSize: '0.65rem', letterSpacing: '0.12em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.4)', marginBottom: '0.25rem' }}>Source</span>
            <span style={{ padding: '0.2rem 0.5rem', borderRadius: '4px', fontSize: '0.7rem', fontWeight: 600, letterSpacing: '0.06em', textTransform: 'uppercase', background: 'rgba(255,255,255,0.05)', color: 'rgba(255,255,255,0.5)', border: '1px solid rgba(255,255,255,0.1)' }}>
              {SOURCE_LABELS[client.source] || client.source}
            </span>
          </div>
          <div>
            <span style={{ display: 'block', fontSize: '0.65rem', letterSpacing: '0.12em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.4)', marginBottom: '0.25rem' }}>Marketing Consent</span>
            <span style={{ padding: '0.2rem 0.5rem', borderRadius: '4px', fontSize: '0.7rem', fontWeight: 600, letterSpacing: '0.06em', textTransform: 'uppercase', background: client.marketingConsent ? 'rgba(34,197,94,0.1)' : 'rgba(255,255,255,0.04)', color: client.marketingConsent ? '#4ade80' : 'rgba(255,255,255,0.3)', border: `1px solid ${client.marketingConsent ? 'rgba(34,197,94,0.2)' : 'rgba(255,255,255,0.08)'}` }}>
              {client.marketingConsent ? 'Opted In' : 'Not Opted In'}
            </span>
          </div>
          <div>
            <span style={{ display: 'block', fontSize: '0.65rem', letterSpacing: '0.12em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.4)', marginBottom: '0.25rem' }}>Instagram</span>
            <span style={{ color: 'rgba(255,255,255,0.85)', fontSize: '0.9rem' }}>{client.instagram || '-'}</span>
          </div>
          <div>
            <span style={{ display: 'block', fontSize: '0.65rem', letterSpacing: '0.12em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.4)', marginBottom: '0.25rem' }}>Client Since</span>
            <span style={{ color: 'rgba(255,255,255,0.85)', fontSize: '0.9rem' }}>
              {new Date(client.createdAt).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })}
            </span>
          </div>
        </div>
        {client.notes && (
          <div style={{ marginTop: '1rem', paddingTop: '1rem', borderTop: '1px solid rgba(255,255,255,0.06)' }}>
            <span style={{ display: 'block', fontSize: '0.65rem', letterSpacing: '0.12em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.4)', marginBottom: '0.25rem' }}>Notes</span>
            <span style={{ color: 'rgba(255,255,255,0.7)', fontSize: '0.85rem' }}>{client.notes}</span>
          </div>
        )}
      </div>

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
    </div>
  )
}