'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'

const SOURCE_STYLES = {
  website: { color: '#e94480', label: 'Web' },
  booksy: { color: '#60a5fa', label: 'Booksy' },
  phone: { color: '#fbbf24', label: 'Phone' },
  walkin: { color: '#a78bfa', label: 'Walk-in' },
}

export default function AvailabilityPage() {
  const [blocks, setBlocks] = useState([])
  const [bookings, setBookings] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [saving, setSaving] = useState(false)

  const [form, setForm] = useState({ date: '', timeSlot: '', reason: '' })

  useEffect(() => {
    fetchAll()
  }, [])

  async function fetchAll() {
    setLoading(true)
    try {
      const [blocksRes, bookingsRes] = await Promise.all([
        fetch('/api/availability'),
        fetch('/api/bookings?limit=200'),
      ])
      const blocksData = await blocksRes.json()
      const bookingsData = await bookingsRes.json()

      if (blocksData.success) setBlocks(blocksData.data)
      else setError(blocksData.error)

      setBookings(Array.isArray(bookingsData) ? bookingsData : [])
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  async function addBlock(e) {
    e.preventDefault()
    if (!form.date) return
    setSaving(true)
    try {
      const res = await fetch('/api/availability', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      })
      const data = await res.json()
      if (data.success) {
        setBlocks((prev) => [...prev, data.data].sort((a, b) => new Date(a.date) - new Date(b.date)))
        setForm({ date: '', timeSlot: '', reason: '' })
      } else {
        alert(data.error)
      }
    } catch (err) {
      alert(err.message)
    } finally {
      setSaving(false)
    }
  }

  async function removeBlock(id) {
    if (!confirm('Remove this block?')) return
    try {
      const res = await fetch(`/api/availability/${id}`, { method: 'DELETE' })
      const data = await res.json()
      if (data.success) {
        setBlocks((prev) => prev.filter((b) => b.id !== id))
      }
    } catch (err) {
      alert(err.message)
    }
  }

  function formatDate(date) {
    if (!date) return '-'
    return new Date(date).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })
  }

  function getDateKey(date) {
    const d = new Date(date)
    const y = d.getFullYear()
    const m = String(d.getMonth() + 1).padStart(2, '0')
    const day = String(d.getDate()).padStart(2, '0')
    return `${y}-${m}-${day}`
  }

  // Merge blocks + bookings into a single diary view
  const diaryItems = [
    ...blocks.map((b) => ({ ...b, type: 'block' })),
    ...bookings
      .filter((b) => b.status === 'confirmed' || b.status === 'pending')
      .map((b) => ({ ...b, type: 'booking' })),
  ].sort((a, b) => new Date(a.date || a.preferredDate) - new Date(b.date || b.preferredDate))

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

  return (
    <div style={{ padding: '2.5rem 2rem', maxWidth: '900px' }}>
      <div style={{ marginBottom: '2rem' }}>
        <Link href="/admin" style={{ fontSize: '0.75rem', color: '#e94480', textDecoration: 'none', letterSpacing: '0.1em', textTransform: 'uppercase' }}>
          &larr; Dashboard
        </Link>
        <h1 style={{ fontFamily: "'Pirata One', 'Playfair Display', cursive", fontSize: '1.8rem', color: '#e94480', letterSpacing: '0.08em', textTransform: 'uppercase', marginTop: '0.5rem' }}>
          My Schedule
        </h1>
        <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: '0.85rem', marginTop: '0.5rem' }}>
          Your full diary — website bookings, Booksy, phone, and blocked slots all in one place.
        </p>
      </div>

      {/* Legend */}
      <div style={{ display: 'flex', gap: '1rem', marginBottom: '1.5rem', flexWrap: 'wrap' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
          <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#e94480' }} />
          <span style={{ fontSize: '0.7rem', color: 'rgba(255,255,255,0.5)' }}>Blocked / Unavailable</span>
        </div>
        {Object.entries(SOURCE_STYLES).map(([key, style]) => (
          <div key={key} style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
            <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: style.color }} />
            <span style={{ fontSize: '0.7rem', color: 'rgba(255,255,255,0.5)', textTransform: 'capitalize' }}>{style.label} Booking</span>
          </div>
        ))}
      </div>

      {error && (
        <div style={{ background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.2)', borderRadius: '8px', padding: '1rem', color: '#f87171', marginBottom: '1.5rem', fontSize: '0.85rem' }}>
          {error}
        </div>
      )}

      {/* Add block form */}
      <div style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)', borderRadius: '12px', padding: '1.5rem', marginBottom: '2rem' }}>
        <h3 style={{ fontFamily: "'Playfair Display', serif", fontSize: '1rem', color: '#e94480', marginBottom: '1.25rem', fontWeight: 500 }}>
          Block a Date / Time
        </h3>
        <form onSubmit={addBlock} className="admin-block-form" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '1rem', alignItems: 'end' }}>
          <div>
            <label style={labelStyle}>Date *</label>
            <input type="date" required value={form.date} onChange={(e) => setForm({ ...form, date: e.target.value })} style={inputStyle} />
          </div>
          <div>
            <label style={labelStyle}>Time Slot (optional)</label>
            <select value={form.timeSlot} onChange={(e) => setForm({ ...form, timeSlot: e.target.value })} style={inputStyle}>
              <option value="">Whole day</option>
              <option value="09:00">09:00</option>
              <option value="09:30">09:30</option>
              <option value="10:00">10:00</option>
              <option value="10:30">10:30</option>
              <option value="11:00">11:00</option>
              <option value="11:30">11:30</option>
              <option value="12:00">12:00</option>
              <option value="12:30">12:30</option>
              <option value="13:00">13:00</option>
              <option value="13:30">13:30</option>
              <option value="14:00">14:00</option>
              <option value="14:30">14:30</option>
              <option value="15:00">15:00</option>
              <option value="15:30">15:30</option>
              <option value="16:00">16:00</option>
              <option value="16:30">16:30</option>
              <option value="17:00">17:00</option>
              <option value="17:30">17:30</option>
              <option value="18:00">18:00</option>
              <option value="18:30">18:30</option>
              <option value="19:00">19:00</option>
              <option value="19:30">19:30</option>
              <option value="20:00">20:00</option>
            </select>
          </div>
          <div>
            <label style={labelStyle}>Reason (optional)</label>
            <input value={form.reason} onChange={(e) => setForm({ ...form, reason: e.target.value })} placeholder="e.g. Booksy booking" style={inputStyle} />
          </div>
          <div style={{ gridColumn: '1 / -1' }}>
            <button
              type="submit"
              disabled={saving}
              style={{
                padding: '0.85rem 2rem',
                background: saving ? 'rgba(233,68,128,0.5)' : '#e94480',
                color: '#ffffff',
                border: 'none',
                borderRadius: '50px',
                fontSize: '0.75rem',
                fontWeight: 500,
                letterSpacing: '0.18em',
                textTransform: 'uppercase',
                cursor: saving ? 'not-allowed' : 'pointer',
              }}
            >
              {saving ? 'Adding...' : '+ Block Slot'}
            </button>
          </div>
        </form>
        <style jsx>{`
          @media (max-width: 768px) {
            .admin-block-form {
              grid-template-columns: 1fr !important;
            }
          }
        `}</style>
      </div>

      {/* Diary list */}
      {loading ? (
        <p style={{ color: 'rgba(255,255,255,0.4)' }}>Loading diary...</p>
      ) : diaryItems.length === 0 ? (
        <p style={{ color: 'rgba(255,255,255,0.4)', textAlign: 'center', padding: '2rem' }}>
          Nothing in your diary yet. Add bookings from the Bookings page or block slots here.
        </p>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
          {diaryItems.map((item) => {
            if (item.type === 'block') {
              return (
                <div
                  key={`block-${item.id}`}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: '0.75rem 1rem',
                    background: 'rgba(239,68,68,0.04)',
                    borderRadius: '8px',
                    border: '1px solid rgba(239,68,68,0.15)',
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', flexWrap: 'wrap' }}>
                    <span style={{ color: '#e94480', fontWeight: 600, fontSize: '0.9rem' }}>
                      {formatDate(item.date)}
                    </span>
                    {item.timeSlot ? (
                      <span style={{ color: 'rgba(255,255,255,0.6)', fontSize: '0.8rem' }}>{item.timeSlot}</span>
                    ) : (
                      <span style={{ padding: '0.15rem 0.5rem', borderRadius: '4px', fontSize: '0.65rem', fontWeight: 600, letterSpacing: '0.08em', textTransform: 'uppercase', background: 'rgba(239,68,68,0.1)', color: '#f87171', border: '1px solid rgba(239,68,68,0.2)' }}>
                        All day
                      </span>
                    )}
                    <span style={{ padding: '0.15rem 0.5rem', borderRadius: '4px', fontSize: '0.6rem', fontWeight: 600, letterSpacing: '0.08em', textTransform: 'uppercase', background: 'rgba(239,68,68,0.08)', color: '#f87171', border: '1px solid rgba(239,68,68,0.15)' }}>
                      Blocked
                    </span>
                    {item.reason && (
                      <span style={{ color: 'rgba(255,255,255,0.4)', fontSize: '0.75rem' }}>{item.reason}</span>
                    )}
                  </div>
                  <button
                    onClick={() => removeBlock(item.id)}
                    style={{
                      background: 'none',
                      border: '1px solid rgba(239,68,68,0.3)',
                      color: '#f87171',
                      borderRadius: '4px',
                      padding: '0.3rem 0.6rem',
                      fontSize: '0.7rem',
                      cursor: 'pointer',
                    }}
                  >
                    Remove
                  </button>
                </div>
              )
            }

            const src = SOURCE_STYLES[item.source] || SOURCE_STYLES.website
            return (
              <Link
                key={`booking-${item.id}`}
                href={`/admin/bookings/${item.id}`}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: '0.75rem 1rem',
                  background: 'rgba(255,255,255,0.03)',
                  borderRadius: '8px',
                  border: '1px solid rgba(255,255,255,0.06)',
                  textDecoration: 'none',
                  transition: 'background 0.15s ease',
                }}
                onMouseEnter={(e) => (e.currentTarget.style.background = 'rgba(255,255,255,0.05)')}
                onMouseLeave={(e) => (e.currentTarget.style.background = 'rgba(255,255,255,0.03)')}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', flexWrap: 'wrap' }}>
                  <span style={{ color: '#e94480', fontWeight: 600, fontSize: '0.9rem' }}>
                    {formatDate(item.date)}
                  </span>
                  <span style={{ color: 'rgba(255,255,255,0.6)', fontSize: '0.8rem' }}>{item.timeSlot}</span>
                  <span style={{ color: 'rgba(255,255,255,0.85)', fontSize: '0.85rem' }}>{item.name}</span>
                  <span style={{ padding: '0.15rem 0.5rem', borderRadius: '4px', fontSize: '0.6rem', fontWeight: 600, letterSpacing: '0.08em', textTransform: 'uppercase', background: src.color + '1a', color: src.color, border: `1px solid ${src.color}33` }}>
                    {src.label}
                  </span>
                  {item.status === 'pending' && (
                    <span style={{ padding: '0.15rem 0.5rem', borderRadius: '4px', fontSize: '0.6rem', fontWeight: 600, letterSpacing: '0.08em', textTransform: 'uppercase', background: 'rgba(233,68,128,0.1)', color: '#e94480', border: '1px solid rgba(233,68,128,0.2)' }}>
                      Pending
                    </span>
                  )}
                  {item.service && (
                    <span style={{ color: 'rgba(255,255,255,0.4)', fontSize: '0.75rem' }}>{item.service}</span>
                  )}
                </div>
                <span style={{ color: '#e94480', fontSize: '0.75rem', letterSpacing: '0.05em' }}>
                  View &rarr;
                </span>
              </Link>
            )
          })}
        </div>
      )}
    </div>
  )
}
