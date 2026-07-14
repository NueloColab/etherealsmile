'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'

const SOURCE_LABELS = {
  booking_confirmed: 'Booking',
  manual_promote: 'Promoted',
  manual: 'Manual',
  newsletter: 'Newsletter',
}

export default function ClientsPage() {
  const [clients, setClients] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch('/api/clients')
      .then(r => r.json())
      .then(data => {
        setClients(data || [])
        setLoading(false)
      })
      .catch(() => setLoading(false))
  }, [])

  if (loading) {
    return <div style={{ padding: '2rem', color: 'rgba(255,255,255,0.4)' }}>Loading clients...</div>
  }

  return (
    <div style={{ padding: '2.5rem 2rem', maxWidth: '1100px' }}>
      <div style={{ marginBottom: '2rem' }}>
        <Link href="/admin" style={{ fontSize: '0.75rem', color: '#e94480', textDecoration: 'none', letterSpacing: '0.1em', textTransform: 'uppercase' }}>
          &larr; Dashboard
        </Link>
        <h1 style={{ fontFamily: "'Pirata One', 'Playfair Display', cursive", fontSize: '1.8rem', color: '#e94480', letterSpacing: '0.08em', textTransform: 'uppercase', marginTop: '0.5rem' }}>
          Clients
        </h1>
        <p style={{ fontSize: '0.85rem', color: 'rgba(255,255,255,0.4)', marginTop: '0.5rem' }}>
          {clients.length} client{clients.length !== 1 ? 's' : ''} · auto-created from confirmed bookings
        </p>
      </div>

      {clients.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '3rem', color: 'rgba(255,255,255,0.4)' }}>
          No clients yet. Clients are created automatically when bookings are confirmed.
        </div>
      ) : (
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
                {['Name', 'Email', 'Phone', 'Bookings', 'Source', 'Consent', 'Created'].map(h => (
                  <th key={h} style={{ textAlign: 'left', padding: '0.75rem', fontSize: '0.7rem', letterSpacing: '0.12em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.4)', fontWeight: 500 }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {clients.map(client => (
                <tr key={client.id} style={{ borderBottom: '1px solid rgba(255,255,255,0.04)' }}>
                  <td style={{ padding: '0.75rem' }}>
                    <Link href={`/admin/clients/${client.id}`} style={{ color: 'rgba(255,255,255,0.85)', fontSize: '0.85rem', textDecoration: 'none' }}>
                      {client.name}
                    </Link>
                  </td>
                  <td style={{ padding: '0.75rem', color: 'rgba(255,255,255,0.6)', fontSize: '0.85rem' }}>
                    {client.email}
                  </td>
                  <td style={{ padding: '0.75rem', color: 'rgba(255,255,255,0.4)', fontSize: '0.85rem' }}>
                    {client.phone || '-'}
                  </td>
                  <td style={{ padding: '0.75rem' }}>
                    <span style={{ padding: '0.2rem 0.5rem', borderRadius: '4px', fontSize: '0.65rem', fontWeight: 600, background: 'rgba(233,68,128,0.1)', color: '#e94480', border: '1px solid rgba(233,68,128,0.2)' }}>
                      {client.bookingCount || 0}
                    </span>
                  </td>
                  <td style={{ padding: '0.75rem' }}>
                    <span style={{ padding: '0.2rem 0.5rem', borderRadius: '4px', fontSize: '0.65rem', fontWeight: 600, letterSpacing: '0.06em', textTransform: 'uppercase', background: 'rgba(255,255,255,0.05)', color: 'rgba(255,255,255,0.5)', border: '1px solid rgba(255,255,255,0.1)' }}>
                      {SOURCE_LABELS[client.source] || client.source}
                    </span>
                  </td>
                  <td style={{ padding: '0.75rem' }}>
                    <span style={{ padding: '0.2rem 0.5rem', borderRadius: '4px', fontSize: '0.65rem', fontWeight: 600, letterSpacing: '0.06em', textTransform: 'uppercase', background: client.marketingConsent ? 'rgba(34,197,94,0.1)' : 'rgba(255,255,255,0.04)', color: client.marketingConsent ? '#4ade80' : 'rgba(255,255,255,0.3)', border: `1px solid ${client.marketingConsent ? 'rgba(34,197,94,0.2)' : 'rgba(255,255,255,0.08)'}` }}>
                      {client.marketingConsent ? 'Yes' : 'No'}
                    </span>
                  </td>
                  <td style={{ padding: '0.75rem', color: 'rgba(255,255,255,0.4)', fontSize: '0.8rem' }}>
                    {new Date(client.createdAt).toLocaleDateString('en-GB', { day: '2-digit', month: 'short' })}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}