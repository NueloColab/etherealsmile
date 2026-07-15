'use client'

import { useEffect, useState } from 'react'

const STATUS_CONFIG = {
  sent:     { label: 'Sent',     bg: 'rgba(74,143,217,0.15)',  color: '#4A8FD9', border: 'rgba(74,143,217,0.3)' },
  viewed:   { label: 'Viewed',   bg: 'rgba(123,107,165,0.15)', color: '#7B6BA5', border: 'rgba(123,107,165,0.3)' },
  signed:   { label: 'Signed',   bg: 'rgba(46,196,182,0.15)',  color: '#2EC4B6', border: 'rgba(46,196,182,0.3)' },
  declined: { label: 'Declined', bg: 'rgba(255,255,255,0.06)', color: 'rgba(255,255,255,0.5)', border: 'rgba(255,255,255,0.12)' },
  expired:  { label: 'Expired',  bg: 'rgba(255,255,255,0.06)', color: 'rgba(255,255,255,0.5)', border: 'rgba(255,255,255,0.12)' },
}

const DOC_TYPES = [
  { type: 'consent', label: 'Consent Form' },
  { type: 'consultation', label: 'Consultation Form' },
  { type: 'guardian_consent', label: 'Guardian Consent' },
  { type: 'aftercare', label: 'Aftercare Instructions' },
]

function formatDate(d) {
  if (!d) return '-'
  return new Date(d).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' })
}

function formatDocType(t) {
  const map = { consent: 'Consent', consultation: 'Consultation', guardian_consent: 'Guardian Consent', aftercare: 'Aftercare' }
  return map[t] || t
}

export default function ConsentRecordsPanel({ scope, targetId, bookingStatus }) {
  const [records, setRecords] = useState([])
  const [loading, setLoading] = useState(true)
  const [sending, setSending] = useState(null)
  const [resending, setResending] = useState(null)
  const [downloading, setDownloading] = useState(null)
  const [error, setError] = useState(null)
  const [successMsg, setSuccessMsg] = useState(null)

  // For booking scope, only allow sending when the booking is confirmed (has a clientId)
  const canSend = scope === 'client' || bookingStatus === 'confirmed'

  async function fetchRecords() {
    setLoading(true)
    try {
      const param = scope === 'booking' ? `bookingId=${targetId}` : `clientId=${targetId}`
      const res = await fetch(`/api/consent-records?${param}`)
      const data = await res.json()
      setRecords(data)
    } catch (err) {
      console.error('Failed to fetch consent records:', err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (targetId) fetchRecords()
  }, [scope, targetId])

  // Determine which document types don't have a live (sent/viewed) record
  const liveDocTypes = new Set(
    records
      .filter(r => r.status === 'sent' || r.status === 'viewed')
      .map(r => r.documentType)
  )

  async function handleSend(documentType) {
    setSending(documentType)
    setError(null)
    setSuccessMsg(null)
    try {
      let clientId = scope === 'client' ? targetId : null

      if (scope === 'booking') {
        // Confirmed bookings always have a clientId, but resolve it from records first
        const recordsWithClient = records.filter(r => r.clientId)
        if (recordsWithClient.length > 0) {
          clientId = recordsWithClient[0].clientId
        } else {
          // Fetch the booking to get the client ID
          const bookingRes = await fetch(`/api/bookings/${targetId}`)
          if (bookingRes.ok) {
            const bookingData = await bookingRes.json()
            clientId = bookingData.clientId
          }
        }
      }

      if (!clientId) {
        setError('Client not linked to this booking. Try refreshing the page.')
        setSending(null)
        return
      }

      const body = { clientId, documentType }
      if (scope === 'booking') {
        body.bookingId = targetId
      }

      const res = await fetch('/api/consent-records', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      })

      const data = await res.json()

      if (res.status === 409) {
        setError(`A live record already exists for ${formatDocType(documentType)}`)
        return
      }

      if (!res.ok) {
        setError(data.error || 'Failed to send')
        return
      }

      setSuccessMsg(`${formatDocType(documentType)} sent`)
      await fetchRecords()
    } catch (err) {
      setError('Failed to send consent form')
    } finally {
      setSending(null)
    }
  }

  async function handleResend(recordId, currentStatus) {
    setResending(recordId)
    setError(null)
    setSuccessMsg(null)
    try {
      const res = await fetch(`/api/consent-records/${recordId}/resend`, { method: 'POST' })
      const data = await res.json()

      if (res.status === 409) {
        setError(data.error || 'Cannot resend')
        return
      }

      if (!res.ok) {
        setError(data.error || 'Failed to resend')
        return
      }

      setSuccessMsg(data.freshToken
        ? 'Fresh link sent (new token generated)'
        : 'Consent form re-sent'
      )
      await fetchRecords()
    } catch (err) {
      setError('Failed to resend')
    } finally {
      setResending(null)
    }
  }

  async function handleDownload(recordId) {
    setDownloading(recordId)
    setError(null)
    try {
      const res = await fetch(`/api/consent-records/${recordId}/download`)
      const data = await res.json()

      if (!res.ok) {
        setError(data.error || 'Download failed')
        return
      }

      // Use direct link assignment (survives Safari popup blocker)
      window.location.href = data.downloadUrl
    } catch (err) {
      setError('Download failed')
    } finally {
      setDownloading(null)
    }
  }

  if (loading) {
    return (
      <div style={{ padding: '1.5rem', color: 'rgba(255,255,255,0.4)', fontSize: '0.85rem' }}>
        Loading consent records...
      </div>
    )
  }

  return (
    <div style={{ marginTop: '1.5rem' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem' }}>
        <h3 style={{ margin: 0, fontSize: '0.85rem', fontWeight: 600, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.6)' }}>
          Consent Forms
        </h3>
        {scope === 'client' && records.length > 0 && (
          <span style={{ fontSize: '0.7rem', color: 'rgba(255,255,255,0.35)' }}>
            {records.length} record{records.length !== 1 ? 's' : ''} across all bookings
          </span>
        )}
      </div>

      {error && (
        <div style={{ padding: '0.5rem 0.75rem', marginBottom: '0.75rem', borderRadius: '6px', background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.3)', color: '#f87171', fontSize: '0.8rem' }}>
          {error}
        </div>
      )}

      {successMsg && (
        <div style={{ padding: '0.5rem 0.75rem', marginBottom: '0.75rem', borderRadius: '6px', background: 'rgba(46,196,182,0.1)', border: '1px solid rgba(46,196,182,0.3)', color: '#2EC4B6', fontSize: '0.8rem' }}>
          {successMsg}
        </div>
      )}

      {/* Pending booking notice - gate sending on confirmed status */}
      {scope === 'booking' && !canSend && (
        <div style={{ padding: '0.75rem 1rem', borderRadius: '8px', background: 'rgba(233,68,128,0.06)', border: '1px solid rgba(233,68,128,0.2)', marginBottom: '1rem' }}>
          <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0.5rem' }}>
            <span style={{ fontSize: '1rem', lineHeight: 1 }}>&#128274;</span>
            <div>
              <p style={{ margin: 0, fontSize: '0.85rem', color: '#e94480', fontWeight: 500 }}>Confirm this booking to send consent forms</p>
              <p style={{ margin: '0.25rem 0 0', fontSize: '0.75rem', color: 'rgba(255,255,255,0.4)', lineHeight: 1.5 }}>
                Consent forms can only be sent once a booking is confirmed and linked to a client record.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Existing records */}
      {records.length === 0 && (
        <div style={{ padding: '1rem', borderRadius: '8px', background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)', marginBottom: '1rem' }}>
          <p style={{ margin: 0, color: 'rgba(255,255,255,0.4)', fontSize: '0.8rem' }}>No consent forms sent yet</p>
        </div>
      )}

      {records.map(record => {
        const statusCfg = STATUS_CONFIG[record.status] || STATUS_CONFIG.sent
        return (
          <div key={record.id} style={{ padding: '0.75rem 1rem', borderRadius: '8px', background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)', marginBottom: '0.5rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '0.5rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flexWrap: 'wrap' }}>
                <span style={{ fontSize: '0.85rem', color: 'rgba(255,255,255,0.85)', fontWeight: 500 }}>
                  {formatDocType(record.documentType)}
                </span>
                <span style={{ fontSize: '0.7rem', color: 'rgba(255,255,255,0.35)' }}>
                  v{record.documentVersion}
                </span>
                <span style={{
                  padding: '0.15rem 0.5rem',
                  borderRadius: '4px',
                  fontSize: '0.65rem',
                  fontWeight: 600,
                  letterSpacing: '0.08em',
                  textTransform: 'uppercase',
                  background: statusCfg.bg,
                  color: statusCfg.color,
                  border: `1px solid ${statusCfg.border}`,
                }}>
                  {statusCfg.label}
                </span>
              </div>

              <div style={{ display: 'flex', gap: '0.5rem' }}>
                {(record.status === 'sent' || record.status === 'viewed') && (
                  <button type="button"
                    onClick={() => handleResend(record.id, record.status)}
                    disabled={resending === record.id}
                    style={{
                      padding: '0.3rem 0.7rem',
                      borderRadius: '4px',
                      border: '1px solid rgba(74,143,217,0.3)',
                      background: 'rgba(74,143,217,0.1)',
                      color: '#4A8FD9',
                      fontSize: '0.7rem',
                      fontWeight: 500,
                      cursor: resending === record.id ? 'not-allowed' : 'pointer',
                      letterSpacing: '0.05em',
                    }}
                  >
                    {resending === record.id ? 'Sending...' : 'Resend'}
                  </button>
                )}
                {(record.status === 'declined' || record.status === 'expired') && (
                  <button type="button"
                    onClick={() => handleResend(record.id, record.status)}
                    disabled={resending === record.id}
                    style={{
                      padding: '0.3rem 0.7rem',
                      borderRadius: '4px',
                      border: '1px solid rgba(233,68,128,0.3)',
                      background: 'rgba(233,68,128,0.1)',
                      color: '#e94480',
                      fontSize: '0.7rem',
                      fontWeight: 500,
                      cursor: resending === record.id ? 'not-allowed' : 'pointer',
                      letterSpacing: '0.05em',
                    }}
                  >
                    {resending === record.id ? 'Sending...' : 'Resend (fresh link)'}
                  </button>
                )}
                {record.status === 'signed' && (
                  <button type="button"
                    onClick={() => handleDownload(record.id)}
                    disabled={downloading === record.id}
                    style={{
                      padding: '0.3rem 0.7rem',
                      borderRadius: '4px',
                      border: '1px solid rgba(46,196,182,0.3)',
                      background: 'rgba(46,196,182,0.1)',
                      color: '#2EC4B6',
                      fontSize: '0.7rem',
                      fontWeight: 500,
                      cursor: downloading === record.id ? 'not-allowed' : 'pointer',
                      letterSpacing: '0.05em',
                    }}
                  >
                    {downloading === record.id ? 'Loading...' : 'Download PDF'}
                  </button>
                )}
              </div>
            </div>

            <div style={{ marginTop: '0.4rem', display: 'flex', gap: '1rem', flexWrap: 'wrap', fontSize: '0.7rem', color: 'rgba(255,255,255,0.4)' }}>
              <span>Sent: {formatDate(record.sentAt)}</span>
              {record.viewedAt && <span>Viewed: {formatDate(record.viewedAt)}</span>}
              {record.signedAt && <span>Signed: {formatDate(record.signedAt)}</span>}
              {record.declinedAt && <span>Declined: {formatDate(record.declinedAt)}</span>}
              {record.signatoryName && <span>By: {record.signatoryName}{record.signatoryRelationship ? ` (${record.signatoryRelationship})` : ''}</span>}
              {scope === 'client' && record.bookingId && <span>Booking #{record.bookingId}</span>}
            </div>
          </div>
        )
      })}

      {/* Send new document section */}
      {canSend ? (
        <div style={{ marginTop: '1rem', padding: '1rem', borderRadius: '8px', background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.06)' }}>
          <div style={{ fontSize: '0.75rem', color: 'rgba(255,255,255,0.5)', marginBottom: '0.5rem', fontWeight: 500, letterSpacing: '0.08em', textTransform: 'uppercase' }}>
            Send consent form
          </div>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
            {DOC_TYPES.map(doc => {
              const isLive = liveDocTypes.has(doc.type)
              return (
                <button type="button"
                  key={doc.type}
                  onClick={() => !isLive && handleSend(doc.type)}
                  disabled={isLive || sending !== null}
                  style={{
                    padding: '0.4rem 0.8rem',
                    borderRadius: '6px',
                    border: isLive ? '1px solid rgba(255,255,255,0.08)' : '1px solid rgba(233,68,128,0.3)',
                    background: isLive ? 'rgba(255,255,255,0.03)' : 'rgba(233,68,128,0.08)',
                    color: isLive ? 'rgba(255,255,255,0.2)' : '#e94480',
                    fontSize: '0.7rem',
                    fontWeight: 500,
                    cursor: isLive || sending !== null ? 'not-allowed' : 'pointer',
                    letterSpacing: '0.03em',
                  }}
                >
                  {sending === doc.type ? 'Sending...' : isLive ? `${doc.label} (sent)` : doc.label}
                </button>
              )
            })}
          </div>
        </div>
      ) : scope === 'booking' ? null : (
        <div style={{ marginTop: '1rem', padding: '1rem', borderRadius: '8px', background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.06)' }}>
          <div style={{ fontSize: '0.75rem', color: 'rgba(255,255,255,0.5)', marginBottom: '0.5rem', fontWeight: 500, letterSpacing: '0.08em', textTransform: 'uppercase' }}>
            Send consent form
          </div>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
            {DOC_TYPES.map(doc => {
              const isLive = liveDocTypes.has(doc.type)
              return (
                <button type="button"
                  key={doc.type}
                  onClick={() => !isLive && handleSend(doc.type)}
                  disabled={isLive || sending !== null}
                  style={{
                    padding: '0.4rem 0.8rem',
                    borderRadius: '6px',
                    border: isLive ? '1px solid rgba(255,255,255,0.08)' : '1px solid rgba(233,68,128,0.3)',
                    background: isLive ? 'rgba(255,255,255,0.03)' : 'rgba(233,68,128,0.08)',
                    color: isLive ? 'rgba(255,255,255,0.2)' : '#e94480',
                    fontSize: '0.7rem',
                    fontWeight: 500,
                    cursor: isLive || sending !== null ? 'not-allowed' : 'pointer',
                    letterSpacing: '0.03em',
                  }}
                >
                  {sending === doc.type ? 'Sending...' : isLive ? `${doc.label} (sent)` : doc.label}
                </button>
              )
            })}
          </div>
        </div>
      )}
    </div>
  )
}