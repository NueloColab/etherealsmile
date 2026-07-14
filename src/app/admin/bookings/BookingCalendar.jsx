'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { MONTHS, WEEKDAYS, getCalendarDays, isDateInPast, getBookingDateKey } from '../../../lib/calendar'

const STATUS_DOT = {
  pending: { color: '#e94480', label: 'Pending' },
  confirmed: { color: '#4ade80', label: 'Confirmed' },
}

export default function BookingCalendar({ bookings }) {
  const today = new Date()
  const [year, setYear] = useState(today.getFullYear())
  const [month, setMonth] = useState(today.getMonth())
  const [selectedDay, setSelectedDay] = useState(null)

  const days = getCalendarDays(year, month)

  // Group bookings by date key (UK local time)
  const bookingsByDate = {}
  bookings.forEach(booking => {
    if (booking.status !== 'pending' && booking.status !== 'confirmed') return
    const key = getBookingDateKey(booking.date)
    if (!key) return
    if (!bookingsByDate[key]) bookingsByDate[key] = []
    bookingsByDate[key].push(booking)
  })

  const selectedKey = selectedDay
    ? `${year}-${String(month + 1).padStart(2, '0')}-${String(selectedDay).padStart(2, '0')}`
    : null
  const selectedBookings = selectedKey ? (bookingsByDate[selectedKey] || []) : []

  function prevMonth() {
    if (month === 0) { setMonth(11); setYear(year - 1) }
    else { setMonth(month - 1) }
    setSelectedDay(null)
  }

  function nextMonth() {
    if (month === 11) { setMonth(0); setYear(year + 1) }
    else { setMonth(month + 1) }
    setSelectedDay(null)
  }

  return (
    <div>
      {/* Month navigation */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.5rem' }}>
        <button
          onClick={prevMonth}
          style={{ padding: '0.5rem 1rem', borderRadius: '6px', border: '1px solid rgba(255,255,255,0.1)', background: 'rgba(255,255,255,0.04)', color: 'rgba(255,255,255,0.7)', fontSize: '0.7rem', letterSpacing: '0.1em', textTransform: 'uppercase', cursor: 'pointer' }}
        >
          &larr;
        </button>
        <span style={{ fontFamily: "'Playfair Display', serif", fontSize: '1.1rem', color: '#e94480', letterSpacing: '0.08em' }}>
          {MONTHS[month]} {year}
        </span>
        <button
          onClick={nextMonth}
          style={{ padding: '0.5rem 1rem', borderRadius: '6px', border: '1px solid rgba(255,255,255,0.1)', background: 'rgba(255,255,255,0.04)', color: 'rgba(255,255,255,0.7)', fontSize: '0.7rem', letterSpacing: '0.1em', textTransform: 'uppercase', cursor: 'pointer' }}
        >
          &rarr;
        </button>
      </div>

      {/* Calendar grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: '0.4rem', textAlign: 'center' }}>
        {WEEKDAYS.map(d => (
          <div key={d} style={{ fontFamily: "'Inter', sans-serif", fontSize: '0.65rem', letterSpacing: '0.1em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.4)', padding: '0.5rem 0' }}>
            {d}
          </div>
        ))}
        {days.map((day, i) => {
          if (!day) return <div key={i} style={{ aspectRatio: '1' }} />

          const past = isDateInPast(year, month, day)
          const dateKey = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`
          const dayBookings = bookingsByDate[dateKey] || []
          const isSelected = selectedDay === day
          const hasConfirmed = dayBookings.some(b => b.status === 'confirmed')
          const hasPending = dayBookings.some(b => b.status === 'pending')

          return (
            <button
              key={i}
              onClick={() => !past && setSelectedDay(day)}
              disabled={past}
              style={{
                aspectRatio: '1',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '2px',
                borderRadius: '6px',
                border: isSelected ? '1px solid #e94480' : '1px solid transparent',
                background: isSelected
                  ? 'rgba(233,68,128,0.15)'
                  : past
                  ? 'transparent'
                  : dayBookings.length > 0
                  ? 'rgba(255,255,255,0.04)'
                  : 'rgba(255,255,255,0.02)',
                color: isSelected
                  ? '#e94480'
                  : past
                  ? 'rgba(255,255,255,0.15)'
                  : 'rgba(255,255,255,0.8)',
                fontFamily: "'Inter', sans-serif",
                fontSize: '0.8rem',
                fontWeight: isSelected ? 600 : 400,
                cursor: past ? 'default' : 'pointer',
                transition: 'all 0.2s ease',
                boxShadow: isSelected ? '0 0 12px rgba(233,68,128,0.2)' : 'none',
                position: 'relative',
              }}
            >
              {day}
              {dayBookings.length > 0 && (
                <div style={{ display: 'flex', gap: '3px', marginTop: '1px' }}>
                  {hasConfirmed && (
                    <div style={{ width: '5px', height: '5px', borderRadius: '50%', background: '#4ade80' }} />
                  )}
                  {hasPending && (
                    <div style={{ width: '5px', height: '5px', borderRadius: '50%', background: '#e94480' }} />
                  )}
                </div>
              )}
            </button>
          )
        })}
      </div>

      {/* Selected day bookings */}
      {selectedDay && (
        <div style={{ marginTop: '1.5rem', padding: '1rem', background: 'rgba(233,68,128,0.05)', border: '1px solid rgba(233,68,128,0.15)', borderRadius: '12px' }}>
          <p style={{ fontFamily: "'Inter', sans-serif", fontSize: '0.7rem', letterSpacing: '0.12em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.5)', marginBottom: '0.75rem' }}>
            {new Date(year, month, selectedDay).toLocaleDateString('en-GB', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
          </p>
          {selectedBookings.length === 0 ? (
            <p style={{ color: 'rgba(255,255,255,0.3)', fontSize: '0.85rem' }}>No bookings on this date.</p>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              {selectedBookings.map(booking => {
                const dot = STATUS_DOT[booking.status] || STATUS_DOT.pending
                return (
                  <div key={booking.id} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0.75rem', background: 'rgba(255,255,255,0.03)', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.06)' }}>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.15rem' }}>
                      <span style={{ color: 'rgba(255,255,255,0.85)', fontSize: '0.85rem' }}>{booking.name}</span>
                      <span style={{ color: 'rgba(255,255,255,0.4)', fontSize: '0.75rem' }}>{booking.timeSlot}{booking.service ? ` · ${booking.service}` : ''}{booking.price ? ` · ${booking.price}` : ''}</span>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                      <span style={{ padding: '0.2rem 0.5rem', borderRadius: '4px', fontSize: '0.6rem', fontWeight: 600, letterSpacing: '0.08em', textTransform: 'uppercase', background: dot.color + '1a', color: dot.color, border: `1px solid ${dot.color}33` }}>
                        {dot.label}
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
      )}
    </div>
  )
}