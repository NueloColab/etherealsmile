'use client'

import { useCmsContent } from '../../lib/useCmsContent'

export default function Contact() {
  const { content } = useCmsContent('contact')

  const heading = content?.heading || 'Get in Touch'
  const subtitle = content?.subtitle || 'We would love to hear from you'
  const email = content?.email || 'etherealsmilex@gmail.com'
  const phone = content?.phone || ''
  const instagram = content?.instagram || '@etherealsmilex'
  const tiktok = content?.tiktok || '@etherealsmilex'

  return (
    <section
      id="contact"
      className="section"
      style={{
        background: 'linear-gradient(to bottom, transparent, rgba(0,0,0,0.6) 10%, rgba(0,0,0,0.6) 90%, transparent)',
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
            gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
            gap: '2rem',
            marginTop: '3rem',
          }}
        >
          <div className="frame-card reveal reveal-scale">
            <h3 style={{ fontFamily: "'Playfair Display', serif", fontSize: '1.1rem', color: '#e94480', marginBottom: '1.5rem' }}>
              Contact Details
            </h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <a href={`mailto:${email}`} style={{ color: 'rgba(255,255,255,0.8)', textDecoration: 'none', fontFamily: "'Inter', sans-serif", fontSize: '0.9rem' }}>
                {email}
              </a>
              {phone && (
                <a href={`tel:${phone}`} style={{ color: 'rgba(255,255,255,0.8)', textDecoration: 'none', fontFamily: "'Inter', sans-serif", fontSize: '0.9rem' }}>
                  {phone}
                </a>
              )}
              {instagram && (
                <a href={`https://instagram.com/${instagram.replace('@', '')}`} target="_blank" rel="noopener noreferrer" style={{ color: 'rgba(255,255,255,0.8)', textDecoration: 'none', fontFamily: "'Inter', sans-serif", fontSize: '0.9rem' }}>
                  {instagram}
                </a>
              )}
              {tiktok && (
                <a href={`https://tiktok.com/${tiktok.replace('@', '')}`} target="_blank" rel="noopener noreferrer" style={{ color: 'rgba(255,255,255,0.8)', textDecoration: 'none', fontFamily: "'Inter', sans-serif", fontSize: '0.9rem' }}>
                  {tiktok}
                </a>
              )}
            </div>
          </div>

          <div className="frame-card reveal reveal-scale reveal-delay-1">
            <h3 style={{ fontFamily: "'Playfair Display', serif", fontSize: '1.1rem', color: '#e94480', marginBottom: '1.5rem' }}>
              Send a Message
            </h3>
            <form
              onSubmit={async (e) => {
                e.preventDefault()
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
                if (res.ok) {
                  alert('Message sent successfully!')
                  form.reset()
                } else {
                  alert('Something went wrong. Please try again.')
                }
              }}
              style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}
            >
              <div className="form-group">
                <label>Name</label>
                <input type="text" name="name" required placeholder="Your name" />
              </div>
              <div className="form-group">
                <label>Email</label>
                <input type="email" name="email" required placeholder="your@email.com" />
              </div>
              <div className="form-group">
                <label>Message</label>
                <textarea name="message" rows={4} placeholder="Your message" />
              </div>
              <button type="submit" className="btn btn-primary">Send Message</button>
            </form>
          </div>
        </div>
      </div>
    </section>
  )
}