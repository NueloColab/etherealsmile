'use client'

import { useState } from 'react'
import { useCmsContent } from '../../lib/useCmsContent'

// Social icon SVGs
const InstagramIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <rect x="2" y="2" width="20" height="20" rx="5"/>
    <circle cx="12" cy="12" r="5"/>
    <circle cx="17.5" cy="6.5" r="1.5" fill="currentColor" stroke="none"/>
  </svg>
)

const TikTokIcon = () => (
  <svg viewBox="0 0 24 24" fill="currentColor">
    <path d="M19.59 6.69a4.83 4.83 0 01-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 01-2.88 2.5 2.89 2.89 0 01-2.89-2.89 2.89 2.89 0 012.89-2.89c.28 0 .54.04.79.1v-3.5a6.37 6.37 0 00-.79-.05A6.34 6.34 0 003.15 15.2a6.34 6.34 0 0010.86 4.46v-7.15a8.16 8.16 0 005.58 2.18V11.2a4.85 4.85 0 01-3.77-1.58V6.69h3.77z"/>
  </svg>
)

const EmailIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <rect x="2" y="4" width="20" height="16" rx="2"/>
    <path d="M22 7l-8.97 5.7a1.94 1.94 0 01-2.06 0L2 7"/>
  </svg>
)

const PhoneIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07 19.5 19.5 0 01-6-6 19.79 19.79 0 01-3.07-8.67A2 2 0 014.11 2h3a2 2 0 012 1.72 12.84 12.84 0 00.7 2.81 2 2 0 01-.45 2.11L8.09 9.91a16 16 0 006 6l1.27-1.27a2 2 0 012.11-.45 12.84 12.84 0 002.81.7A2 2 0 0122 16.92z"/>
  </svg>
)

export default function Contact() {
  const { content } = useCmsContent('contact')
  const [sent, setSent] = useState(false)
  const [sending, setSending] = useState(false)

  const heading = content?.heading || 'Contact'
  const subtitle = content?.subtitle || 'We would love to hear from you'
  const email = content?.email || 'etherealsmilex@gmail.com'
  const phone = content?.phone || ''
  const instagram = content?.instagram || 'etherealsmilex'
  const tiktok = content?.tiktok || 'etherealsmilex'

  async function handleSubmit(e) {
    e.preventDefault()
    setSending(true)
    const form = e.target
    const res = await fetch('/api/contact', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name: form.name.value,
        email: form.email.value,
        message: form.message.value,
      }),
    })
    setSending(false)
    if (res.ok) {
      setSent(true)
      form.reset()
    }
  }

  return (
    <section
      id="contact"
      className="section"
      style={{
        paddingTop: '6rem',
        paddingBottom: '6rem',
      }}
    >
      <div className="section-inner">
        <h2 className="section-title reveal">{heading}</h2>
        {subtitle && <p className="section-subtitle reveal reveal-delay-1">{subtitle}</p>}

        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
            gap: '2rem',
            marginTop: '3rem',
            maxWidth: '1000px',
            marginLeft: 'auto',
            marginRight: 'auto',
          }}
        >
          {/* Left: Social + Contact */}
          <div className="reveal reveal-scale"
            style={{
              display: 'flex',
              flexDirection: 'column',
              gap: '2rem',
            }}
          >
            {/* Social Icons Row */}
            <div
              style={{
                display: 'flex',
                gap: '1rem',
                justifyContent: 'center',
                flexWrap: 'wrap',
              }}
            >
              {[
                { href: `mailto:${email}`, icon: <EmailIcon />, label: 'Email' },
                { href: `https://instagram.com/${instagram.replace('@', '')}`, icon: <InstagramIcon />, label: 'Instagram' },
                { href: `https://tiktok.com/@${tiktok.replace('@', '')}`, icon: <TikTokIcon />, label: 'TikTok' },
                ...(phone ? [{ href: `tel:${phone}`, icon: <PhoneIcon />, label: 'Phone' }] : []),
              ].map((social) => (
                <a
                  key={social.label}
                  href={social.href}
                  target={social.href.startsWith('http') ? '_blank' : undefined}
                  rel={social.href.startsWith('http') ? 'noopener noreferrer' : undefined}
                  aria-label={social.label}
                  style={{
                    width: '56px',
                    height: '56px',
                    borderRadius: '14px',
                    border: '1.5px solid rgba(233, 68, 128, 0.35)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: '#e94480',
                    background: 'rgba(233, 68, 128, 0.06)',
                    backdropFilter: 'blur(8px)',
                    transition: 'all 0.35s cubic-bezier(0.16,1,0.3,1)',
                    cursor: 'pointer',
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.background = 'rgba(233, 68, 128, 0.2)'
                    e.currentTarget.style.borderColor = 'rgba(233, 68, 128, 0.8)'
                    e.currentTarget.style.transform = 'translateY(-4px) scale(1.08)'
                    e.currentTarget.style.boxShadow = '0 8px 24px rgba(233, 68, 128, 0.2)'
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.background = 'rgba(233, 68, 128, 0.06)'
                    e.currentTarget.style.borderColor = 'rgba(233, 68, 128, 0.35)'
                    e.currentTarget.style.transform = 'translateY(0) scale(1)'
                    e.currentTarget.style.boxShadow = 'none'
                  }}
                >
                  <div style={{ width: '22px', height: '22px' }}>{social.icon}</div>
                </a>
              ))}
            </div>

            {/* Contact Info Card */}
            <div
              style={{
                borderRadius: '20px',
                border: '1px solid rgba(233, 68, 128, 0.15)',
                background: 'rgba(0,0,0,0.25)',
                backdropFilter: 'blur(12px)',
                padding: '2rem',
                textAlign: 'center',
              }}
            >
              <p
                style={{
                  fontFamily: "'Pirata One', 'Playfair Display', cursive",
                  fontSize: '1.1rem',
                  color: '#e94480',
                  marginBottom: '1.25rem',
                  letterSpacing: '0.05em',
                }}
              >
                Get in Touch
              </p>

              <div
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '0.75rem',
                  fontFamily: "'Inter', sans-serif",
                  fontSize: '0.85rem',
                  color: 'rgba(255,255,255,0.7)',
                }}
              >
                <a
                  href={`mailto:${email}`}
                  style={{
                    color: 'rgba(255,255,255,0.7)',
                    textDecoration: 'none',
                    transition: 'color 0.3s ease',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '0.5rem',
                  }}
                  onMouseEnter={(e) => (e.currentTarget.style.color = '#e94480')}
                  onMouseLeave={(e) => (e.currentTarget.style.color = 'rgba(255,255,255,0.7)')}
                >
                  <span style={{ color: '#e94480', fontSize: '0.7rem' }}>\u2709</span> {email}
                </a>
                {phone && (
                  <a
                    href={`tel:${phone}`}
                    style={{
                      color: 'rgba(255,255,255,0.7)',
                      textDecoration: 'none',
                      transition: 'color 0.3s ease',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: '0.5rem',
                    }}
                    onMouseEnter={(e) => (e.currentTarget.style.color = '#e94480')}
                    onMouseLeave={(e) => (e.currentTarget.style.color = 'rgba(255,255,255,0.7)')}
                  >
                    <span style={{ color: '#e94480', fontSize: '0.7rem' }}>\u260e</span> {phone}
                  </a>
                )}
              </div>
            </div>
          </div>

          {/* Right: Form */}
          <div className="reveal reveal-scale reveal-delay-1"
            style={{
              borderRadius: '20px',
              border: '1px solid rgba(233, 68, 128, 0.15)',
              background: 'rgba(0,0,0,0.25)',
              backdropFilter: 'blur(12px)',
              padding: '2rem',
            }}
          >
            {sent ? (
              <div style={{ textAlign: 'center', padding: '2rem 0' }}>
                <div
                  style={{
                    width: '56px',
                    height: '56px',
                    borderRadius: '50%',
                    border: '2px solid rgba(233,68,128,0.4)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    margin: '0 auto 1.25rem',
                    color: '#e94480',
                  }}
                >
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
                    <path d="M20 6L9 17l-5-5" />
                  </svg>
                </div>
                <p
                  style={{
                    fontFamily: "'Pirata One', 'Playfair Display', cursive",
                    fontSize: '1.3rem',
                    color: '#e94480',
                    marginBottom: '0.5rem',
                  }}
                >
                  Message Sent
                </p>
                <p style={{ fontSize: '0.85rem', color: 'rgba(255,255,255,0.6)' }}>
                  We will be in touch soon.
                </p>
                <button
                  onClick={() => setSent(false)}
                  style={{
                    marginTop: '1.5rem',
                    padding: '0.75rem 2rem',
                    background: 'transparent',
                    border: '1.5px solid rgba(233,68,128,0.4)',
                    borderRadius: '50px',
                    color: '#e94480',
                    fontSize: '0.7rem',
                    fontWeight: 600,
                    letterSpacing: '0.15em',
                    textTransform: 'uppercase',
                    cursor: 'pointer',
                    transition: 'all 0.3s ease',
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.background = 'rgba(233,68,128,0.15)'
                    e.currentTarget.style.borderColor = 'rgba(233,68,128,0.7)'
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.background = 'transparent'
                    e.currentTarget.style.borderColor = 'rgba(233,68,128,0.4)'
                  }}
                >
                  Send Another
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                <div>
                  <label
                    style={{
                      display: 'block',
                      fontFamily: "'Inter', sans-serif",
                      fontSize: '0.65rem',
                      letterSpacing: '0.18em',
                      textTransform: 'uppercase',
                      color: 'rgba(255,255,255,0.45)',
                      marginBottom: '0.6rem',
                    }}
                  >
                    Name
                  </label>
                  <input
                    type="text"
                    name="name"
                    required
                    placeholder="Your name"
                    style={{
                      width: '100%',
                      padding: '0.85rem 1rem',
                      background: 'rgba(255,255,255,0.04)',
                      border: '1px solid rgba(233,68,128,0.15)',
                      borderRadius: '12px',
                      color: '#ffffff',
                      fontSize: '0.9rem',
                      outline: 'none',
                      fontFamily: "'Inter', sans-serif",
                      transition: 'border-color 0.3s ease, box-shadow 0.3s ease',
                    }}
                    onFocus={(e) => {
                      e.currentTarget.style.borderColor = 'rgba(233,68,128,0.5)'
                      e.currentTarget.style.boxShadow = '0 0 0 3px rgba(233,68,128,0.08)'
                    }}
                    onBlur={(e) => {
                      e.currentTarget.style.borderColor = 'rgba(233,68,128,0.15)'
                      e.currentTarget.style.boxShadow = 'none'
                    }}
                  />
                </div>

                <div>
                  <label
                    style={{
                      display: 'block',
                      fontFamily: "'Inter', sans-serif",
                      fontSize: '0.65rem',
                      letterSpacing: '0.18em',
                      textTransform: 'uppercase',
                      color: 'rgba(255,255,255,0.45)',
                      marginBottom: '0.6rem',
                    }}
                  >
                    Email
                  </label>
                  <input
                    type="email"
                    name="email"
                    required
                    placeholder="your@email.com"
                    style={{
                      width: '100%',
                      padding: '0.85rem 1rem',
                      background: 'rgba(255,255,255,0.04)',
                      border: '1px solid rgba(233,68,128,0.15)',
                      borderRadius: '12px',
                      color: '#ffffff',
                      fontSize: '0.9rem',
                      outline: 'none',
                      fontFamily: "'Inter', sans-serif",
                      transition: 'border-color 0.3s ease, box-shadow 0.3s ease',
                    }}
                    onFocus={(e) => {
                      e.currentTarget.style.borderColor = 'rgba(233,68,128,0.5)'
                      e.currentTarget.style.boxShadow = '0 0 0 3px rgba(233,68,128,0.08)'
                    }}
                    onBlur={(e) => {
                      e.currentTarget.style.borderColor = 'rgba(233,68,128,0.15)'
                      e.currentTarget.style.boxShadow = 'none'
                    }}
                  />
                </div>

                <div>
                  <label
                    style={{
                      display: 'block',
                      fontFamily: "'Inter', sans-serif",
                      fontSize: '0.65rem',
                      letterSpacing: '0.18em',
                      textTransform: 'uppercase',
                      color: 'rgba(255,255,255,0.45)',
                      marginBottom: '0.6rem',
                    }}
                  >
                    Message
                  </label>
                  <textarea
                    name="message"
                    rows={4}
                    placeholder="Tell us what you need..."
                    style={{
                      width: '100%',
                      padding: '0.85rem 1rem',
                      background: 'rgba(255,255,255,0.04)',
                      border: '1px solid rgba(233,68,128,0.15)',
                      borderRadius: '12px',
                      color: '#ffffff',
                      fontSize: '0.9rem',
                      outline: 'none',
                      fontFamily: "'Inter', sans-serif",
                      resize: 'vertical',
                      minHeight: '100px',
                      transition: 'border-color 0.3s ease, box-shadow 0.3s ease',
                    }}
                    onFocus={(e) => {
                      e.currentTarget.style.borderColor = 'rgba(233,68,128,0.5)'
                      e.currentTarget.style.boxShadow = '0 0 0 3px rgba(233,68,128,0.08)'
                    }}
                    onBlur={(e) => {
                      e.currentTarget.style.borderColor = 'rgba(233,68,128,0.15)'
                      e.currentTarget.style.boxShadow = 'none'
                    }}
                  />
                </div>

                <button
                  type="submit"
                  disabled={sending}
                  style={{
                    width: '100%',
                    padding: '1rem',
                    background: 'transparent',
                    border: '2px solid rgba(233,68,128,0.4)',
                    borderRadius: '50px',
                    color: '#e94480',
                    fontSize: '0.75rem',
                    fontWeight: 600,
                    letterSpacing: '0.2em',
                    textTransform: 'uppercase',
                    cursor: 'pointer',
                    transition: 'all 0.35s cubic-bezier(0.16,1,0.3,1)',
                    marginTop: '0.5rem',
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.background = 'rgba(233,68,128,0.15)'
                    e.currentTarget.style.borderColor = 'rgba(233,68,128,0.8)'
                    e.currentTarget.style.boxShadow = '0 4px 20px rgba(233,68,128,0.2)'
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.background = 'transparent'
                    e.currentTarget.style.borderColor = 'rgba(233,68,128,0.4)'
                    e.currentTarget.style.boxShadow = 'none'
                  }}
                >
                  {sending ? 'Sending...' : 'Send Message'}
                </button>
              </form>
            )}
          </div>

          {/* Third card: Review */}
          <div
            className="reveal reveal-scale reveal-delay-2"
            style={{
              gridColumn: '1 / -1',
              borderRadius: '20px',
              border: '1px solid rgba(233, 68, 128, 0.15)',
              background: 'rgba(0,0,0,0.2)',
              backdropFilter: 'blur(12px)',
              padding: '2.5rem 2rem',
              textAlign: 'center',
              position: 'relative',
              overflow: 'hidden',
              maxWidth: '600px',
              margin: '0 auto',
              width: '100%',
            }}
          >
            {/* Decorative corner stars */}
            {[
              { top: '1rem', left: '1rem' },
              { top: '1rem', right: '1rem' },
              { bottom: '1rem', left: '1rem' },
              { bottom: '1rem', right: '1rem' },
            ].map((pos, i) => (
              <div
                key={i}
                style={{
                  position: 'absolute',
                  ...pos,
                  color: 'rgba(233,68,128,0.2)',
                }}
              >
                <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 0L14.59 9.41L24 12L14.59 14.59L12 24L9.41 14.59L0 12L9.41 9.41L12 0Z"/>
                </svg>
              </div>
            ))}

            {/* Star row */}
            <div
              style={{
                display: 'flex',
                justifyContent: 'center',
                gap: '0.35rem',
                marginBottom: '1rem',
                color: '#e94480',
              }}
            >
              {[...Array(5)].map((_, i) => (
                <div
                  key={i}
                  style={{
                    animation: `float ${2 + i * 0.3}s ease-in-out infinite`,
                    animationDelay: `${i * 0.15}s`,
                  }}
                >
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
                  </svg>
                </div>
              ))}
            </div>

            <p
              style={{
                fontFamily: "'Pirata One', 'Playfair Display', cursive",
                fontSize: '1.2rem',
                color: '#e94480',
                marginBottom: '0.5rem',
                letterSpacing: '0.05em',
              }}
            >
              Love Your Experience?
            </p>
            <p
              style={{
                fontFamily: "'Playfair Display', serif",
                fontStyle: 'italic',
                fontSize: '0.85rem',
                color: 'rgba(255,255,255,0.5)',
                marginBottom: '1.5rem',
              }}
            >
              Leave a review and help others discover Ethereal Smile
            </p>

            <a
              href="https://search.google.com/local/writereview?placeid=ChIJ"
              target="_blank"
              rel="noopener noreferrer"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.6rem',
                padding: '0.75rem 2rem',
                background: 'transparent',
                border: '2px solid rgba(233,68,128,0.35)',
                borderRadius: '50px',
                color: '#e94480',
                fontFamily: "'Inter', sans-serif",
                fontSize: '0.7rem',
                fontWeight: 600,
                letterSpacing: '0.18em',
                textTransform: 'uppercase',
                textDecoration: 'none',
                cursor: 'pointer',
                transition: 'all 0.35s cubic-bezier(0.16,1,0.3,1)',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = 'rgba(233,68,128,0.12)'
                e.currentTarget.style.borderColor = 'rgba(233,68,128,0.7)'
                e.currentTarget.style.transform = 'translateY(-2px)'
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = 'transparent'
                e.currentTarget.style.borderColor = 'rgba(233,68,128,0.35)'
                e.currentTarget.style.transform = 'translateY(0)'
              }}
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
                <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
              </svg>
              Leave a Review
            </a>
          </div>
        </div>
      </div>
    </section>
  )
}
