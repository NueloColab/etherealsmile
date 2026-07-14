'use client'

import { useState } from 'react'
import Link from 'next/link'

export default function BookingConfirmClient({ enquiry, action, isExpired, token }) {
  const [status, setStatus] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  const formattedOriginal = enquiry.preferredDate
    ? new Date(enquiry.preferredDate).toLocaleDateString('en-GB', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      })
    : 'TBC'

  const formattedProposed = enquiry.proposedDate
    ? new Date(enquiry.proposedDate).toLocaleDateString('en-GB', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      })
    : 'TBC'

  async function handleAction(choice) {
    setLoading(true)
    setError(null)
    try {
      const res = await fetch(`/api/booking/confirm/${token}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: choice }),
      })
      if (!res.ok) throw new Error('Failed to process')
      const data = await res.json()
      if (data.success) {
        setStatus(choice)
      }
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  if (status === 'accept') {
    return (
      <div
        style={{
          minHeight: '100vh',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '2rem',
          background: '#000',
        }}
      >
        <div
          style={{
            maxWidth: '480px',
            width: '100%',
            textAlign: 'center',
            padding: '3rem 2rem',
            border: '1px solid rgba(76, 175, 80, 0.3)',
            borderRadius: '16px',
            background: 'rgba(76, 175, 80, 0.05)',
          }}
        >
          <div
            style={{
              width: '64px',
              height: '64px',
              borderRadius: '50%',
              background: 'rgba(76, 175, 80, 0.15)',
              border: '1px solid rgba(76, 175, 80, 0.3)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 1.5rem',
              color: '#81c784',
              fontSize: '1.5rem',
            }}
          >
            &#10003;
          </div>
          <h1
            style={{
              fontFamily: "'Pirata One', 'Playfair Display', cursive",
              fontSize: '1.6rem',
              color: '#81c784',
              marginBottom: '1rem',
            }}
          >
            Booking Confirmed
          </h1>
          <p style={{ color: 'rgba(255,255,255,0.7)', fontSize: '0.9rem', lineHeight: 1.6, marginBottom: '1.5rem' }}>
            Your alternative booking has been confirmed.
            <br />
            <strong style={{ color: '#e94480' }}>
              {formattedProposed} at {enquiry.proposedTime}
            </strong>
          </p>
          <Link
            href="/"
            style={{
              display: 'inline-block',
              padding: '0.75rem 2rem',
              background: 'rgba(233, 68, 128, 0.15)',
              color: '#e94480',
              border: '1px solid rgba(233, 68, 128, 0.4)',
              borderRadius: '50px',
              textDecoration: 'none',
              fontSize: '0.8rem',
              letterSpacing: '0.15em',
              textTransform: 'uppercase',
            }}
          >
            Return to Website
          </Link>
        </div>
      </div>
    )
  }

  if (status === 'reject') {
    return (
      <div
        style={{
          minHeight: '100vh',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '2rem',
          background: '#000',
        }}
      >
        <div
          style={{
            maxWidth: '480px',
            width: '100%',
            textAlign: 'center',
            padding: '3rem 2rem',
            border: '1px solid rgba(244, 67, 54, 0.3)',
            borderRadius: '16px',
            background: 'rgba(244, 67, 54, 0.05)',
          }}
        >
          <div
            style={{
              width: '64px',
              height: '64px',
              borderRadius: '50%',
              background: 'rgba(244, 67, 54, 0.15)',
              border: '1px solid rgba(244, 67, 54, 0.3)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 1.5rem',
              color: '#e57373',
              fontSize: '1.5rem',
            }}
          >
            &times;
          </div>
          <h1
            style={{
              fontFamily: "'Pirata One', 'Playfair Display', cursive",
              fontSize: '1.6rem',
              color: '#e57373',
              marginBottom: '1rem',
            }}
          >
            Proposal Declined
          </h1>
          <p style={{ color: 'rgba(255,255,255,0.7)', fontSize: '0.9rem', lineHeight: 1.6, marginBottom: '1.5rem' }}>
            No problem. If you'd like to book a different time, please submit a new enquiry.
          </p>
          <Link
            href="/#book"
            style={{
              display: 'inline-block',
              padding: '0.75rem 2rem',
              background: 'rgba(233, 68, 128, 0.15)',
              color: '#e94480',
              border: '1px solid rgba(233, 68, 128, 0.4)',
              borderRadius: '50px',
              textDecoration: 'none',
              fontSize: '0.8rem',
              letterSpacing: '0.15em',
              textTransform: 'uppercase',
            }}
          >
            Book Again
          </Link>
        </div>
      </div>
    )
  }

  if (isExpired) {
    return (
      <div
        style={{
          minHeight: '100vh',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '2rem',
          background: '#000',
        }}
      >
        <div
          style={{
            maxWidth: '480px',
            width: '100%',
            textAlign: 'center',
            padding: '3rem 2rem',
            border: '1px solid rgba(255, 152, 0, 0.3)',
            borderRadius: '16px',
            background: 'rgba(255, 152, 0, 0.05)',
          }}
        >
          <h1
            style={{
              fontFamily: "'Pirata One', 'Playfair Display', cursive",
              fontSize: '1.6rem',
              color: '#ffb74d',
              marginBottom: '1rem',
            }}
          >
            Proposal Expired
          </h1>
          <p style={{ color: 'rgba(255,255,255,0.7)', fontSize: '0.9rem', lineHeight: 1.6, marginBottom: '1.5rem' }}>
            This booking proposal has expired. Please submit a new enquiry.
          </p>
          <Link
            href="/#book"
            style={{
              display: 'inline-block',
              padding: '0.75rem 2rem',
              background: 'rgba(233, 68, 128, 0.15)',
              color: '#e94480',
              border: '1px solid rgba(233, 68, 128, 0.4)',
              borderRadius: '50px',
              textDecoration: 'none',
              fontSize: '0.8rem',
              letterSpacing: '0.15em',
              textTransform: 'uppercase',
            }}
          >
            Book Again
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div
      style={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '2rem',
        background: '#000',
      }}
    >
      <div
        style={{
          maxWidth: '520px',
          width: '100%',
          padding: '2.5rem',
          border: '1px solid rgba(233, 68, 128, 0.2)',
          borderRadius: '16px',
          background: 'rgba(0,0,0,0.6)',
        }}
      >
        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <img
            src="/hero-logo-card.png"
            alt="Ethereal Smile"
            style={{ width: '80px', height: 'auto', marginBottom: '1rem', borderRadius: '8px' }}
          />
          <h1
            style={{
              fontFamily: "'Pirata One', 'Playfair Display', cursive",
              fontSize: '1.4rem',
              color: '#e94480',
              letterSpacing: '0.1em',
            }}
          >
            Alternative Proposal
          </h1>
        </div>

        <p style={{ color: 'rgba(255,255,255,0.7)', fontSize: '0.9rem', lineHeight: 1.6, marginBottom: '1.5rem', textAlign: 'center' }}>
          Hi {enquiry.name},<br />
          Your original request ({formattedOriginal} at {enquiry.preferredTime || 'TBC'}) is not available.
          We'd like to propose:
        </p>

        <div
          style={{
            background: 'rgba(233, 68, 128, 0.08)',
            border: '1px solid rgba(233, 68, 128, 0.2)',
            borderRadius: '12px',
            padding: '1.5rem',
            textAlign: 'center',
            marginBottom: '2rem',
          }}
        >
          <p style={{ margin: 0, color: 'rgba(255,255,255,0.5)', fontSize: '0.8rem', marginBottom: '0.5rem' }}>
            Proposed Date &amp; Time
          </p>
          <p
            style={{
              margin: 0,
              fontFamily: "'Pirata One', 'Playfair Display', cursive",
              fontSize: '1.2rem',
              color: '#e94480',
              letterSpacing: '0.05em',
            }}
          >
            {formattedProposed}
          </p>
          <p style={{ margin: '0.5rem 0 0', fontSize: '1rem', color: '#e94480' }}>
            at {enquiry.proposedTime}
          </p>
        </div>

        {error && (
          <p style={{ color: '#e57373', fontSize: '0.85rem', textAlign: 'center', marginBottom: '1rem' }}>{error}</p>
        )}

        <div style={{ display: 'flex', gap: '1rem' }}>
          <button
            onClick={() => handleAction('accept')}
            disabled={loading}
            style={{
              flex: 1,
              padding: '1rem',
              borderRadius: '10px',
              border: '1px solid rgba(76, 175, 80, 0.4)',
              background: 'rgba(76, 175, 80, 0.15)',
              color: '#81c784',
              fontFamily: "'Inter', sans-serif",
              fontSize: '0.85rem',
              fontWeight: 500,
              letterSpacing: '0.1em',
              textTransform: 'uppercase',
              cursor: 'pointer',
              transition: 'all 0.3s ease',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = 'rgba(76, 175, 80, 0.25)'
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = 'rgba(76, 175, 80, 0.15)'
            }}
          >
            {loading ? 'Processing...' : 'Accept'}
          </button>

          <button
            onClick={() => handleAction('reject')}
            disabled={loading}
            style={{
              flex: 1,
              padding: '1rem',
              borderRadius: '10px',
              border: '1px solid rgba(244, 67, 54, 0.3)',
              background: 'rgba(244, 67, 54, 0.08)',
              color: '#e57373',
              fontFamily: "'Inter', sans-serif",
              fontSize: '0.85rem',
              fontWeight: 500,
              letterSpacing: '0.1em',
              textTransform: 'uppercase',
              cursor: 'pointer',
              transition: 'all 0.3s ease',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = 'rgba(244, 67, 54, 0.15)'
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = 'rgba(244, 67, 54, 0.08)'
            }}
          >
            {loading ? 'Processing...' : 'Decline'}
          </button>
        </div>
      </div>
    </div>
  )
}
