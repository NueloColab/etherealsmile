'use client'

import { useState, useEffect } from 'react'

const MONTHS = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December',
]

const WEEKDAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']

function getCalendarDays(year, month) {
  const firstDay = new Date(year, month, 1).getDay()
  const daysInMonth = new Date(year, month + 1, 0).getDate()
  const days = []
  for (let i = 0; i < firstDay; i++) {
    days.push(null)
  }
  for (let i = 1; i <= daysInMonth; i++) {
    days.push(i)
  }
  return days
}

function isDateInPast(year, month, day) {
  const today = new Date()
  today.setHours(0, 0, 0, 0)
  const check = new Date(year, month, day)
  return check < today
}

export default function Book() {
  const today = new Date()
  const [year, setYear] = useState(today.getFullYear())
  const [month, setMonth] = useState(today.getMonth())
  const [selectedDate, setSelectedDate] = useState(null)
  const [form, setForm] = useState({ name: '', email: '', phone: '', message: '' })
  const [submitted, setSubmitted] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  const days = getCalendarDays(year, month)

  function prevMonth() {
    if (month === 0) {
      setMonth(11)
      setYear(year - 1)
    } else {
      setMonth(month - 1)
    }
  }

  function nextMonth() {
    if (month === 11) {
      setMonth(0)
      setYear(year + 1)
    } else {
      setMonth(month + 1)
    }
  }

  function selectDate(day) {
    if (!day || isDateInPast(year, month, day)) return
    setSelectedDate(new Date(year, month, day))
    setSubmitted(false)
    setError(null)
  }

  async function handleSubmit(e) {
    e.preventDefault()
    if (!selectedDate) {
      setError('Please select a preferred date from the calendar.')
      return
    }
    setLoading(true)
    setError(null)
    try {
      const res = await fetch('/api/enquiries', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...form,
          preferredDate: selectedDate.toISOString(),
        }),
      })
      if (!res.ok) throw new Error('Something went wrong. Please try again.')
      setSubmitted(true)
      setForm({ name: '', email: '', phone: '', message: '' })
      setSelectedDate(null)
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <section
      id="book"
      className="section"
      style={{
        background: 'linear-gradient(to bottom, transparent, rgba(0,0,0,0.5) 20%, rgba(0,0,0,0.5) 80%, transparent)',
      }}
    >
      <div className="section-inner">
        <h2 className="section-title">Book an Appointment</h2>
        <p className="section-subtitle">Select a date and send us an enquiry</p>
        <div className="gold-line" />

        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
            gap: '2rem',
            marginTop: '3rem',
          }}
        >
          {/* Calendar */}
          <div className="frame-card">
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                marginBottom: '1.5rem',
              }}
            >
              <button
                onClick={prevMonth}
                className="btn btn-outline"
                style={{ padding: '0.5rem 1rem', fontSize: '0.65rem' }}
              >
                &larr;
              </button>
              <span
                style={{
                  fontFamily: "'Playfair Display', serif",
                  fontSize: '1.1rem',
                  color: '#c9a96e',
                  letterSpacing: '0.08em',
                }}
              >
                {MONTHS[month]} {year}
              </span>
              <button
                onClick={nextMonth}
                className="btn btn-outline"
                style={{ padding: '0.5rem 1rem', fontSize: '0.65rem' }}
              >
                &rarr;
              </button>
            </div>

            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(7, 1fr)',
                gap: '0.4rem',
                textAlign: 'center',
              }}
            >
              {WEEKDAYS.map((d) => (
                <div
                  key={d}
                  style={{
                    fontFamily: "'Inter', sans-serif",
                    fontSize: '0.65rem',
                    letterSpacing: '0.1em',
                    textTransform: 'uppercase',
                    color: 'rgba(255,255,255,0.4)',
                    padding: '0.5rem 0',
                  }}
                >
                  {d}
                </div>
              ))}
              {days.map((day, i) => {
                const isPast = day && isDateInPast(year, month, day)
                const isSelected =
                  day &&
                  selectedDate &&
                  selectedDate.getDate() === day &&
                  selectedDate.getMonth() === month &&
                  selectedDate.getFullYear() === year

                return (
                  <button
                    key={i}
                    onClick={() => selectDate(day)}
                    disabled={!day || isPast}
                    style={{
                      aspectRatio: '1',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      borderRadius: '6px',
                      border: isSelected ? '1px solid #c9a96e' : '1px solid transparent',
                      background: isSelected
                        ? 'rgba(201, 169, 110, 0.15)'
                        : isPast
                        ? 'transparent'
                        : day
                        ? 'rgba(255,255,255,0.03)'
                        : 'transparent',
                      color: isSelected
                        ? '#c9a96e'
                        : isPast
                        ? 'rgba(255,255,255,0.15)'
                        : 'rgba(255,255,255,0.8)',
                      fontFamily: "'Inter', sans-serif",
                      fontSize: '0.8rem',
                      cursor: day && !isPast ? 'pointer' : 'default',
                      transition: 'all 0.2s ease',
                    }}
                  >
                    {day || ''}
                  </button>
                )
              })}
            </div>

            {selectedDate && (
              <p
                style={{
                  marginTop: '1rem',
                  fontFamily: "'Inter', sans-serif",
                  fontSize: '0.8rem',
                  color: '#c9a96e',
                  textAlign: 'center',
                }}
              >
                Selected: {selectedDate.toLocaleDateString('en-GB', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
              </p>
            )}
          </div>

          {/* Form */}
          <div className="frame-card">
            <h3
              style={{
                fontFamily: "'Playfair Display', serif",
                fontSize: '1.1rem',
                color: '#c9a96e',
                marginBottom: '1.5rem',
                fontWeight: 500,
              }}
            >
              Send an Enquiry
            </h3>

            {submitted ? (
              <div
                style={{
                  textAlign: 'center',
                  padding: '2rem 0',
                }}
              >
                <div
                  style={{
                    width: '48px',
                    height: '48px',
                    borderRadius: '50%',
                    background: 'rgba(201, 169, 110, 0.15)',
                    border: '1px solid rgba(201, 169, 110, 0.3)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    margin: '0 auto 1rem',
                    color: '#c9a96e',
                  }}
                >
                  &#10003;
                </div>
                <p style={{ color: '#c9a96e', fontSize: '0.9rem', marginBottom: '0.5rem' }}>
                  Enquiry sent successfully.
                </p>
                <p style={{ fontSize: '0.8rem', color: 'rgba(255,255,255,0.5)' }}>
                  Hattie will review your request and confirm your booking soon.
                </p>
              </div>
            ) : (
              <form onSubmit={handleSubmit}>
                <div className="form-group">
                  <label>Name</label>
                  <input
                    type="text"
                    required
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                    placeholder="Your full name"
                  />
                </div>
                <div className="form-group">
                  <label>Email</label>
                  <input
                    type="email"
                    required
                    value={form.email}
                    onChange={(e) => setForm({ ...form, email: e.target.value })}
                    placeholder="your@email.com"
                  />
                </div>
                <div className="form-group">
                  <label>Phone</label>
                  <input
                    type="tel"
                    value={form.phone}
                    onChange={(e) => setForm({ ...form, phone: e.target.value })}
                    placeholder="+44 7..."
                  />
                </div>
                <div className="form-group">
                  <label>Message</label>
                  <textarea
                    rows={3}
                    value={form.message}
                    onChange={(e) => setForm({ ...form, message: e.target.value })}
                    placeholder="Any questions or preferences?"
                  />
                </div>
                {error && (
                  <p style={{ color: '#e57373', fontSize: '0.8rem', marginBottom: '1rem' }}>{error}</p>
                )}
                <button type="submit" className="btn btn-primary" disabled={loading} style={{ width: '100%' }}>
                  {loading ? 'Sending...' : 'Send Enquiry'}
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </section>
  )
}
