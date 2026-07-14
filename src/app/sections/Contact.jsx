'use client'

import { useState } from 'react'

export default function Contact() {
  const [form, setForm] = useState({ name: '', email: '', message: '' })
  const [submitted, setSubmitted] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  async function handleSubmit(e) {
    e.preventDefault()
    setLoading(true)
    setError(null)
    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      })
      if (!res.ok) throw new Error('Something went wrong. Please try again.')
      setSubmitted(true)
      setForm({ name: '', email: '', message: '' })
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <section
      id="contact"
      className="section"
      style={{
        background: 'rgba(0, 0, 0, 0.6)',
        borderTop: '1px solid rgba(233, 68, 128, 0.08)',
        borderBottom: '1px solid rgba(233, 68, 128, 0.08)',
        paddingTop: '6rem',
        paddingBottom: '6rem',
      }}
    >
      <div className="section-inner">
        <h2 className="section-title">Contact</h2>
        <p className="section-subtitle">We'd love to hear from you</p>

        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
            gap: '3rem',
            marginTop: '3rem',
            alignItems: 'start',
          }}
        >
          <div className="frame-card">
            <h3
              style={{
                fontFamily: "'Playfair Display', serif",
                fontSize: '1.1rem',
                color: '#e94480',
                marginBottom: '1.5rem',
                fontWeight: 500,
              }}
            >
              Get in Touch
            </h3>

            <div style={{ marginBottom: '1.5rem' }}>
              <p
                style={{
                  fontFamily: "'Inter', sans-serif",
                  fontSize: '0.7rem',
                  letterSpacing: '0.12em',
                  textTransform: 'uppercase',
                  color: 'rgba(255,255,255,0.4)',
                  marginBottom: '0.35rem',
                }}
              >
                Email
              </p>
              <a
                href="mailto:etherealsmilex@gmail.com"
                style={{
                  fontFamily: "'Inter', sans-serif",
                  fontSize: '0.9rem',
                  color: 'rgba(255,255,255,0.8)',
                  textDecoration: 'none',
                }}
              >
                etherealsmilex@gmail.com
              </a>
            </div>

            <div style={{ marginBottom: '1.5rem' }}>
              <p
                style={{
                  fontFamily: "'Inter', sans-serif",
                  fontSize: '0.7rem',
                  letterSpacing: '0.12em',
                  textTransform: 'uppercase',
                  color: 'rgba(255,255,255,0.4)',
                  marginBottom: '0.35rem',
                }}
              >
                Social
              </p>
              <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
                <a
                  href="https://www.instagram.com/etherealsmilex"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn btn-outline"
                  style={{ padding: '0.5rem 1rem', fontSize: '0.65rem' }}
                >
                  Instagram
                </a>
                <a
                  href="https://www.tiktok.com/@etherealsmilex"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn btn-outline"
                  style={{ padding: '0.5rem 1rem', fontSize: '0.65rem' }}
                >
                  TikTok
                </a>
              </div>
            </div>

            <div>
              <p
                style={{
                  fontFamily: "'Inter', sans-serif",
                  fontSize: '0.7rem',
                  letterSpacing: '0.12em',
                  textTransform: 'uppercase',
                  color: 'rgba(255,255,255,0.4)',
                  marginBottom: '0.35rem',
                }}
              >
                Bookings
              </p>
              <a href="#book" style={{ fontSize: '0.85rem', color: '#e94480', textDecoration: 'none' }}>
                Use our enquiry calendar &rarr;
              </a>
            </div>
          </div>

          <div className="frame-card">
            <h3
              style={{
                fontFamily: "'Playfair Display', serif",
                fontSize: '1.1rem',
                color: '#e94480',
                marginBottom: '1.5rem',
                fontWeight: 500,
              }}
            >
              Send a Message
            </h3>

            {submitted ? (
              <div style={{ textAlign: 'center', padding: '2rem 0' }}>
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
                <p style={{ color: '#e94480', fontSize: '0.9rem' }}>Message sent. We'll be in touch soon.</p>
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
                    placeholder="Your name"
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
                  <label>Message</label>
                  <textarea
                    rows={4}
                    required
                    value={form.message}
                    onChange={(e) => setForm({ ...form, message: e.target.value })}
                    placeholder="What would you like to ask?"
                  />
                </div>
                {error && (
                  <p style={{ color: '#e57373', fontSize: '0.8rem', marginBottom: '1rem' }}>{error}</p>
                )}
                <button type="submit" className="btn btn-primary" disabled={loading} style={{ width: '100%' }}>
                  {loading ? 'Sending...' : 'Send Message'}
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </section>
  )
}
