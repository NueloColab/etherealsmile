'use client'

import { useState, useEffect } from 'react'
import { useSearchParams } from 'next/navigation'
import { useCmsContent } from '../../lib/useCmsContent'
import { MONTHS, WEEKDAYS, getCalendarDays, isDateInPast } from '../../lib/calendar'

const DEFAULT_TIME_SLOTS = ['10:00', '11:30', '13:00', '14:30', '16:00']

export default function Book() {
  const searchParams = useSearchParams()
  const { content: cmsContent } = useCmsContent('book')
  const [prefillService, setPrefillService] = useState('')
  const [prefillPrice, setPrefillPrice] = useState('')

  const bookHeading = cmsContent?.heading || 'Book an Appointment'
  const bookSubtitle = cmsContent?.subtitle || 'Select a date and send us an enquiry'
  const timeSlots = Array.isArray(cmsContent?.timeSlots) && cmsContent.timeSlots.length > 0
    ? cmsContent.timeSlots
    : DEFAULT_TIME_SLOTS

  // Listen for URL changes (from EnquireButton popstate)
  useEffect(() => {
    function readParams() {
      const params = new URLSearchParams(window.location.search)
      setPrefillService(params.get('service') || '')
      setPrefillPrice(params.get('price') || '')
    }
    readParams()
    window.addEventListener('popstate', readParams)
    return () => window.removeEventListener('popstate', readParams)
  }, [])

  // Also read from Next.js searchParams on initial load/navigation
  useEffect(() => {
    setPrefillService(searchParams.get('service') || '')
    setPrefillPrice(searchParams.get('price') || '')
  }, [searchParams])

  const today = new Date()
  const [year, setYear] = useState(today.getFullYear())
  const [month, setMonth] = useState(today.getMonth())
  const [selectedDate, setSelectedDate] = useState(null)
  const [selectedTime, setSelectedTime] = useState(null)
  const [form, setForm] = useState({
    name: '',
    email: '',
    phone: '',
    isMinor: false,
    message: '',
    service: '',
    price: '',
  })

  // Update form when prefill changes
  useEffect(() => {
    setForm((f) => ({ ...f, service: prefillService, price: prefillPrice }))
  }, [prefillService, prefillPrice])

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
    setSelectedTime(null)
    setSubmitted(false)
    setError(null)
    setTimeout(() => {
      const formCard = document.querySelector('#book-form-card')
      if (formCard && window.innerWidth < 768) {
        formCard.scrollIntoView({ behavior: 'smooth', block: 'center' })
      }
    }, 100)
  }

  async function handleSubmit(e) {
    e.preventDefault()
    if (!selectedDate) {
      setError('Please select a preferred date from the calendar.')
      return
    }
    if (!selectedTime) {
      setError('Please select a preferred time slot.')
      return
    }
    setLoading(true)
    setError(null)
    try {
      const res = await fetch('/api/bookings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...form,
          preferredDate: selectedDate.toISOString(),
          preferredTime: selectedTime,
        }),
      })
      if (!res.ok) throw new Error('Something went wrong. Please try again.')
      setSubmitted(true)
      setForm({ name: '', email: '', phone: '', isMinor: false, message: '', service: '', price: '' })
      setSelectedDate(null)
      setSelectedTime(null)
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
        background: 'linear-gradient(to bottom, transparent, rgba(0,0,0,0.6) 10%, rgba(0,0,0,0.6) 90%, transparent)',
        paddingTop: '6rem',
        paddingBottom: '6rem',
      }}
    >
      <div className="section-inner">
        <h2 className="section-title reveal">{bookHeading}</h2>
        <p className="section-subtitle reveal reveal-delay-1">{bookSubtitle}</p>

        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
            gap: '2rem',
            marginTop: '3rem',
          }}
        >
          {/* Calendar */}
          <div className="frame-card reveal reveal-scale reveal-delay-2">
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
                  color: '#e94480',
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
                      border: isSelected ? '1px solid #e94480' : '1px solid transparent',
                      background: isSelected
                        ? 'rgba(233, 68, 128, 0.25)'
                        : isPast
                        ? 'transparent'
                        : day
                        ? 'rgba(255,255,255,0.03)'
                        : 'transparent',
                      color: isSelected
                        ? '#e94480'
                        : isPast
                        ? 'rgba(255,255,255,0.15)'
                        : 'rgba(255,255,255,0.8)',
                      fontFamily: "'Inter', sans-serif",
                      fontSize: '0.8rem',
                      fontWeight: isSelected ? 600 : 400,
                      cursor: day && !isPast ? 'pointer' : 'default',
                      transition: 'all 0.2s ease',
                      boxShadow: isSelected ? '0 0 12px rgba(233, 68, 128, 0.3)' : 'none',
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
                  color: '#e94480',
                  textAlign: 'center',
                }}
              >
                Selected: {selectedDate.toLocaleDateString('en-GB', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
              </p>
            )}
          </div>

          {/* Form */}
          <div
            className="frame-card reveal reveal-scale reveal-delay-2"
            id="book-form-card"
            style={{
              border: selectedDate
                ? '1px solid rgba(233, 68, 128, 0.4)'
                : '1px solid rgba(255, 255, 255, 0.06)',
              boxShadow: selectedDate
                ? '0 0 30px rgba(233, 68, 128, 0.15), inset 0 0 20px rgba(233, 68, 128, 0.05)'
                : 'none',
              transition: 'border-color 0.4s ease, box-shadow 0.4s ease',
            }}
          >
            <h3
              style={{
                fontFamily: "'Playfair Display', serif",
                fontSize: '1.1rem',
                color: '#e94480',
                marginBottom: selectedDate ? '0.5rem' : '1.5rem',
                fontWeight: 500,
                transition: 'margin-bottom 0.3s ease',
              }}
            >
              Send an Enquiry
            </h3>

            {prefillService && (
              <div
                style={{
                  marginBottom: '1rem',
                  padding: '0.5rem 0.75rem',
                  background: 'rgba(233, 68, 128, 0.08)',
                  borderRadius: '6px',
                  border: '1px solid rgba(233, 68, 128, 0.15)',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  gap: '0.75rem',
                }}
              >
                <span style={{ fontFamily: "'Inter', sans-serif", fontSize: '0.8rem', color: '#e94480' }}>
                  <span style={{ opacity: 0.7 }}>Service:</span>{' '}
                  <strong>{prefillService}</strong>
                  {prefillPrice && (
                    <>{' '}
                      <span style={{ opacity: 0.7 }}>({prefillPrice})</span>
                    </>
                  )}
                </span>
                <a
                  href="/#book"
                  onClick={(e) => {
                    e.preventDefault()
                    setForm((f) => ({ ...f, service: '', price: '' }))
                    setPrefillService('')
                    setPrefillPrice('')
                    window.history.pushState(null, '', '/#book')
                    window.dispatchEvent(new Event('popstate'))
                  }}
                  style={{
                    fontSize: '0.65rem',
                    color: 'rgba(255,255,255,0.4)',
                    textDecoration: 'underline',
                    cursor: 'pointer',
                    whiteSpace: 'nowrap',
                  }}
                >
                  Change
                </a>
              </div>
            )}

            {selectedDate && (
              <>
                <p
                  style={{
                    fontFamily: "'Inter', sans-serif",
                    fontSize: '0.8rem',
                    color: '#e94480',
                    marginBottom: '0.75rem',
                    padding: '0.5rem 0.75rem',
                    background: 'rgba(233, 68, 128, 0.08)',
                    borderRadius: '6px',
                    border: '1px solid rgba(233, 68, 128, 0.15)',
                  }}
                >
                  <span style={{ opacity: 0.7 }}>Preferred date:</span>{' '}
                  <strong>
                    {selectedDate.toLocaleDateString('en-GB', {
                      weekday: 'long',
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric',
                    })}
                  </strong>
                </p>

                {/* Time slots */}
                <div style={{ marginBottom: '1.25rem' }}>
                  <label
                    style={{
                      display: 'block',
                      fontFamily: "'Inter', sans-serif",
                      fontSize: '0.7rem',
                      letterSpacing: '0.12em',
                      textTransform: 'uppercase',
                      color: 'rgba(255,255,255,0.5)',
                      marginBottom: '0.5rem',
                    }}
                  >
                    Preferred Time
                  </label>
                  <div
                    style={{
                      display: 'grid',
                      gridTemplateColumns: 'repeat(3, 1fr)',
                      gap: '0.5rem',
                    }}
                  >
                    {timeSlots.map((time) => {
                      const isSelected = selectedTime === time
                      return (
                        <button
                          key={time}
                          type="button"
                          onClick={() => setSelectedTime(time)}
                          style={{
                            padding: '0.6rem 0',
                            borderRadius: '6px',
                            border: isSelected
                              ? '1px solid #e94480'
                              : '1px solid rgba(255,255,255,0.1)',
                            background: isSelected
                              ? 'rgba(233, 68, 128, 0.15)'
                              : 'rgba(255,255,255,0.03)',
                            color: isSelected ? '#e94480' : 'rgba(255,255,255,0.7)',
                            fontFamily: "'Inter', sans-serif",
                            fontSize: '0.8rem',
                            fontWeight: isSelected ? 500 : 400,
                            cursor: 'pointer',
                            transition: 'all 0.2s ease',
                            boxShadow: isSelected
                              ? '0 0 10px rgba(233, 68, 128, 0.2)'
                              : 'none',
                          }}
                        >
                          {time}
                        </button>
                      )
                    })}
                  </div>
                </div>
              </>
            )}

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
                    background: 'rgba(233, 68, 128, 0.15)',
                    border: '1px solid rgba(233, 68, 128, 0.3)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    margin: '0 auto 1rem',
                    color: '#e94480',
                  }}
                >
                  &#10003;
                </div>
                <p style={{ color: '#e94480', fontSize: '0.9rem', marginBottom: '0.5rem' }}>
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
                    required
                    value={form.phone}
                    onChange={(e) => setForm({ ...form, phone: e.target.value })}
                    placeholder="+44 7..."
                  />
                </div>
                <div className="form-group">
                  <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer' }}>
                    <input
                      type="checkbox"
                      checked={form.isMinor}
                      onChange={(e) => setForm({ ...form, isMinor: e.target.checked })}
                      style={{ accentColor: '#e94480', width: '1rem', height: '1rem' }}
                    />
                    <span>This booking is for someone under 18</span>
                  </label>
                  <p style={{ fontSize: '0.75rem', color: 'rgba(255,255,255,0.4)', margin: '0.25rem 0 0', lineHeight: 1.4 }}>
                    A parent or guardian will need to sign the consent forms.
                  </p>
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
