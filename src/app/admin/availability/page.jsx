'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'

export default function AvailabilityPage() {
  const [blocks, setBlocks] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [saving, setSaving] = useState(false)

  const [form, setForm] = useState({ date: '', timeSlot: '', reason: '' })

  useEffect(() => {
    fetchBlocks()
  }, [])

  async function fetchBlocks() {
    setLoading(true)
    try {
      const res = await fetch('/api/availability')
      const data = await res.json()
      if (data.success) setBlocks(data.data)
      else setError(data.error)
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
          Block dates and times you are not available. Customers will not be able to book these slots.
        </p>
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
              <option value="10:00">10:00</option>
              <option value="11:30">11:30</option>
              <option value="13:00">13:00</option>
              <option value="14:30">14:30</option>
              <option value="16:00">16:00</option>
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

      {/* List */}
      {loading ? (
        <p style={{ color: 'rgba(255,255,255,0.4)' }}>Loading...</p>
      ) : blocks.length === 0 ? (
        <p style={{ color: 'rgba(255,255,255,0.4)', textAlign: 'center', padding: '2rem' }}>
          No blocked slots yet. Add your Booksy bookings and holidays here to prevent double-booking.
        </p>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
          {blocks.map((block) => (
            <div
              key={block.id}
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '0.75rem 1rem',
                background: 'rgba(255,255,255,0.03)',
                borderRadius: '8px',
                border: '1px solid rgba(255,255,255,0.06)',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', flexWrap: 'wrap' }}>
                <span style={{ color: '#e94480', fontWeight: 600, fontSize: '0.9rem' }}>
                  {formatDate(block.date)}
                </span>
                {block.timeSlot ? (
                  <span style={{ color: 'rgba(255,255,255,0.6)', fontSize: '0.8rem' }}>
                    {block.timeSlot}
                  </span>
                ) : (
                  <span style={{ padding: '0.15rem 0.5rem', borderRadius: '4px', fontSize: '0.65rem', fontWeight: 600, letterSpacing: '0.08em', textTransform: 'uppercase', background: 'rgba(233,68,128,0.1)', color: '#e94480', border: '1px solid rgba(233,68,128,0.2)' }}>
                    All day
                  </span>
                )}
                {block.reason && (
                  <span style={{ color: 'rgba(255,255,255,0.4)', fontSize: '0.75rem' }}>
                    {block.reason}
                  </span>
                )}
              </div>
              <button
                onClick={() => removeBlock(block.id)}
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
          ))}
        </div>
      )}
    </div>
  )
}
