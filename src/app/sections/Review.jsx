'use client'

import { useCmsContent } from '../../lib/useCmsContent'

export default function Review() {
  const { content } = useCmsContent('review')

  const heading = content?.heading || 'Leave a Review'
  const subtitle = content?.subtitle || 'Share your experience with others'
  const linkText = content?.linkText || 'Leave us a review on Google'
  const reviewUrl = content?.reviewUrl || 'https://search.google.com/local/writereview?placeid=ChIJ'

  return (
    <section
      id="review"
      className="section"
      style={{
        background: 'linear-gradient(to bottom, transparent, rgba(0,0,0,0.4) 20%, rgba(0,0,0,0.4) 80%, transparent)',
        paddingTop: '5rem',
        paddingBottom: '5rem',
        textAlign: 'center',
      }}
    >
      <div className="section-inner">
        <h2 className="section-title reveal">{heading}</h2>
        {subtitle && <p className="section-subtitle reveal reveal-delay-1">{subtitle}</p>}
        <div style={{ marginTop: '2rem' }} className="reveal reveal-delay-2">
          <a
            href={reviewUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="btn btn-primary"
            style={{
              display: 'inline-block',
              padding: '0.85rem 2.5rem',
              background: '#e94480',
              color: '#ffffff',
              border: 'none',
              borderRadius: '50px',
              fontSize: '0.75rem',
              fontWeight: 500,
              letterSpacing: '0.18em',
              textTransform: 'uppercase',
              textDecoration: 'none',
              cursor: 'pointer',
              transition: 'all 0.3s ease',
            }}
          >
            {linkText}
          </a>
        </div>
      </div>
    </section>
  )
}