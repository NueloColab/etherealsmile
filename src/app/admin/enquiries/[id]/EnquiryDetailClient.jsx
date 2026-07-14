'use client'

import { useState } from 'react'
import Link from 'next/link'

export default function EnquiryDetailClient({ enquiry }) {
  const [status, setStatus] = useState(enquiry.status)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [altDate, setAltDate] = useState('')
  const [altTime, setAltTime] = useState('')
  const [notes, setNotes] = useState(enquiry.notes || '')
  const [showAltForm, setShowAltForm] = useState(false)

  async function updateEnquiry(updates) {
    setLoading(true)
    setError(null)
    try {
      const res = await fetch(`/api/enquiries/${enquiry.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updates),
      })
      if (!res.ok) throw new Error('Failed to update')
      const data = await res.json()
      if (data.success) {
        if (updates.status) setStatus(updates.status)
        if (updates.notes !== undefined) setNotes(updates.notes)
      }
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  async function confirmAsIs() {
    await updateEnquiry({
      status: 'confirmed',
      notes: notes || `Confirmed for ${formatDate(enquiry.preferredDate)} at ${enquiry.preferredTime || 'TBC'}`,
    })
  }

  async function proposeAlternative() {
    if (!altDate || !altTime) {
      setError('Please enter both alternative date and time')
      return
    }
    await updateEnquiry({
      status: 'pending',
      proposedDate: altDate,
      proposedTime: altTime,
      notes: `Proposed alternative: ${formatDateStr(altDate)} at ${altTime}. Customer preferred: ${formatDate(enquiry.preferredDate)} at ${enquiry.preferredTime || 'TBC'}`,
    })
    setShowAltForm(false)
  }

  async function rejectEnquiry() {
    await updateEnquiry({
      status: 'rejected',
      notes: notes || 'Rejected - no slots available',
    })
  }

  function formatDate(date) {
    if (!date) return '-'
    return new Date(date).toLocaleDateString('en-GB', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    })
  }

  function formatDateStr(str) {
    if (!str) return '-'
    return new Date(str).toLocaleDateString('en-GB', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    })
  }

  const statusColors = {
    pending: { bg: 'rgba(233, 68, 128, 0.15)', color: '#e94480', border: 'rgba(233, 68, 128, 0.3)' },
    confirmed: { bg: 'rgba(76, 175, 80, 0.15)', color: '#81c784', border: 'rgba(76, 175, 80, 0.3)' },
    rejected: { bg: 'rgba(244, 67, 54, 0.15)', color: '#e57373', border: 'rgba(244, 67, 54, 0.3)' },
    cancelled: { bg: 'rgba(255, 152, 0, 0.15)', color: '#ffb74d', border: 'rgba(255, 152, 0, 0.3)' },
  }

  const sc = statusColors[status] || statusColors.pending

  return (
    <div style={{ padding: '2rem 1.5rem', maxWidth: '800px', margin: '0 auto' }}>
      <div style={{ marginBottom: '2rem' }}>
        <Link
          href="/admin/enquiries"
          style={{
            fontFamily: "'Inter', sans-serif",
            fontSize: '0.75rem',
            color: 'rgba(255,255,255,0.5)',
            textDecoration: 'none',
            letterSpacing: '0.1em',
            textTransform: 'uppercase',
          }}
        >
          &larr; Back to Enquiries
        </Link>
      </div>

      <h1
        style={{
          fontFamily: "'Playfair Display', serif",
          fontSize: '1.4rem',
          color: '#e94480',
          letterSpacing: '0.08em',
          textTransform: 'uppercase',
          marginBottom: '0.5rem',
        }}
      >
        Enquiry #{enquiry.id}
      </h1>

      <div
        style={{
          display: 'inline-block',
          padding: '0.35rem 0.75rem',
          borderRadius: '4px',
          fontSize: '0.7rem',
          letterSpacing: '0.08em',
          textTransform: 'uppercase',
          background: sc.bg,
          color: sc.color,
          border: `1px solid ${sc.border}`,
          marginBottom: '2rem',
        }}
      >
        {status}
      </div>

      {error && (
        <p style={{ color: '#e57373', fontSize: '0.85rem', marginBottom: '1rem', padding: '0.75rem', background: 'rgba(244,67,54,0.1)', borderRadius: '6px' }}>{error}</p>
      )}

      <div className="frame-card" style={{ marginBottom: '2rem' }}>
        <h3
          style={{
            fontFamily: "'Playfair Display', serif",
            fontSize: '1rem',
            color: '#e94480',
            marginBottom: '1.25rem',
            fontWeight: 500,
          }}
        >
          Customer Details
        </h3>

        <div style={{ display: 'grid', gap: '1rem' }}>
          <DetailRow label="Name" value={enquiry.name} />
          <DetailRow label="Email" value={enquiry.email} />
          <DetailRow label="Phone" value={enquiry.phone || '-'} />
          <DetailRow label="Service" value={enquiry.service ? `${enquiry.service} (${enquiry.price || 'TBC'})` : '-'} />
          <DetailRow label="Preferred Date" value={formatDate(enquiry.preferredDate)} />
          <DetailRow label="Preferred Time" value={enquiry.preferredTime || '-'} />
          <DetailRow label="Message" value={enquiry.message || '-'} />
          <DetailRow label="Submitted" value={enquiry.createdAt ? new Date(enquiry.createdAt).toLocaleString('en-GB') : '-'} />
        </div>
      </div>

      <div className="frame-card" style={{ marginBottom: '2rem' }}>
        <h3
          style={{
            fontFamily: "'Playfair Display', serif",
            fontSize: '1rem',
            color: '#e94480',
            marginBottom: '1.25rem',
            fontWeight: 500,
          }}
        >
          Actions
        </h3>

        <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap', marginBottom: '1.5rem' }}>
          <button
            onClick={confirmAsIs}
            disabled={loading || status === 'confirmed'}
            className="btn btn-primary"
            style={{
              opacity: status === 'confirmed' ? 0.5 : 1,
              background: 'rgba(76, 175, 80, 0.2)',
              color: '#81c784',
              border: '1px solid rgba(76, 175, 80, 0.4)',
            }}
          >
            {loading ? 'Processing...' : 'Confirm As-Is'}
          </button>

          <button
            onClick={() => setShowAltForm(!showAltForm)}
            disabled={loading}
            className="btn btn-outline"
            style={{
              border: '1px solid rgba(233, 68, 128, 0.4)',
              color: '#e94480',
            }}
          >
            Propose Alternative
          </button>

          <button
            onClick={rejectEnquiry}
            disabled={loading || status === 'rejected'}
            className="btn btn-outline"
            style={{
              opacity: status === 'rejected' ? 0.5 : 1,
              border: '1px solid rgba(244, 67, 54, 0.4)',
              color: '#e57373',
            }}
          >
            {loading ? 'Processing...' : 'Reject'}
          </button>
        </div>

        {showAltForm && (
          <div
            style={{
              padding: '1.25rem',
              background: 'rgba(233, 68, 128, 0.05)',
              borderRadius: '8px',
              border: '1px solid rgba(233, 68, 128, 0.15)',
            }}
          >
            <p style={{ fontSize: '0.85rem', color: 'rgba(255,255,255,0.7)', marginBottom: '1rem' }}>
              Propose an alternative date and time to the customer.
            </p>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1rem' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.7rem', letterSpacing: '0.12em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.5)', marginBottom: '0.5rem' }}>
                  Alternative Date
                </label>
                <input
                  type="date"
                  value={altDate}
                  onChange={(e) => setAltDate(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '0.75rem',
                    background: 'rgba(255,255,255,0.04)',
                    border: '1px solid rgba(255,255,255,0.1)',
                    borderRadius: '6px',
                    color: '#fff',
                    fontFamily: "'Inter', sans-serif",
                  }}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.7rem', letterSpacing: '0.12em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.5)', marginBottom: '0.5rem' }}>
                  Alternative Time
                </label>
                <input
                  type="text"
                  value={altTime}
                  onChange={(e) => setAltTime(e.target.value)}
                  placeholder="e.g. 15:30"
                  style={{
                    width: '100%',
                    padding: '0.75rem',
                    background: 'rgba(255,255,255,0.04)',
                    border: '1px solid rgba(255,255,255,0.1)',
                    borderRadius: '6px',
                    color: '#fff',
                    fontFamily: "'Inter', sans-serif",
                  }}
                />
              </div>
            </div>

            <button
              onClick={proposeAlternative}
              disabled={loading}
              className="btn btn-primary"
              style={{ width: '100%' }}
            >
              {loading ? 'Sending...' : 'Send Alternative Proposal'}
            </button>
          </div>
        )}
      </div>

      <div className="frame-card">
        <h3
          style={{
            fontFamily: "'Playfair Display', serif",
            fontSize: '1rem',
            color: '#e94480',
            marginBottom: '1.25rem',
            fontWeight: 500,
          }}
        >
          Internal Notes
        </h3>

        <textarea
          rows={4}
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          placeholder="Add notes about this enquiry..."
          style={{
            width: '100%',
            padding: '0.75rem',
            background: 'rgba(255,255,255,0.04)',
            border: '1px solid rgba(255,255,255,0.1)',
            borderRadius: '6px',
            color: '#fff',
            fontFamily: "'Inter', sans-serif",
            fontSize: '0.85rem',
            marginBottom: '1rem',
            resize: 'vertical',
          }}
        />

        <button
          onClick={() => updateEnquiry({ notes })}
          disabled={loading}
          className="btn btn-outline"
        >
          {loading ? 'Saving...' : 'Save Notes'}
        </button>
      </div>
    </div>
  )
}

function DetailRow({ label, value }) {
  return (
    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '1rem' }}>
      <span
        style={{
          fontFamily: "'Inter', sans-serif",
          fontSize: '0.7rem',
          letterSpacing: '0.12em',
          textTransform: 'uppercase',
          color: 'rgba(255,255,255,0.4)',
          minWidth: '120px',
          flexShrink: 0,
        }}
      >
        {label}
      </span>
      <span
        style={{
          fontFamily: "'Inter', sans-serif",
          fontSize: '0.85rem',
          color: 'rgba(255,255,255,0.85)',
          textAlign: 'right',
          wordBreak: 'break-word',
        }}
      >
        {value}
      </span>
    </div>
  )
}
