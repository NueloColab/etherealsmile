'use client'

import { useCmsContent } from '../../lib/useCmsContent'

const StarIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
    <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
  </svg>
)

const GoogleIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
    <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
    <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
    <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
    <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
  </svg>
)

export default function Review() {
  const { content } = useCmsContent('review')

  const heading = content?.heading || 'Leave a Review'
  const subtitle = content?.subtitle || 'Share your Ethereal Smile experience'
  const reviewUrl = content?.reviewUrl || 'https://search.google.com/local/writereview?placeid=ChIJ'

  return (
    <section
      id="review"
      className="section"
      style={{
        paddingTop: '5rem',
        paddingBottom: '5rem',
        textAlign: 'center',
      }}
    >
      <div className="section-inner">
        <div className="reveal"
          style={{
            maxWidth: '600px',
            margin: '0 auto',
            borderRadius: '24px',
            border: '1px solid rgba(233, 68, 128, 0.2)',
            background: 'rgba(0,0,0,0.2)',
            backdropFilter: 'blur(12px)',
            padding: '3rem 2rem',
            position: 'relative',
            overflow: 'hidden',
          }}
        >
          {/* Decorative corner stars */}
          <div
            style={{
              position: 'absolute',
              top: '1rem',
              left: '1rem',
              color: 'rgba(233,68,128,0.25)',
            }}
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 0L14.59 9.41L24 12L14.59 14.59L12 24L9.41 14.59L0 12L9.41 9.41L12 0Z"/>
            </svg>
          </div>
          <div
            style={{
              position: 'absolute',
              top: '1rem',
              right: '1rem',
              color: 'rgba(233,68,128,0.25)',
            }}
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 0L14.59 9.41L24 12L14.59 14.59L12 24L9.41 14.59L0 12L9.41 9.41L12 0Z"/>
            </svg>
          </div>
          <div
            style={{
              position: 'absolute',
              bottom: '1rem',
              left: '1rem',
              color: 'rgba(233,68,128,0.25)',
            }}
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 0L14.59 9.41L24 12L14.59 14.59L12 24L9.41 14.59L0 12L9.41 9.41L12 0Z"/>
            </svg>
          </div>
          <div
            style={{
              position: 'absolute',
              bottom: '1rem',
              right: '1rem',
              color: 'rgba(233,68,128,0.25)',
            }}
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 0L14.59 9.41L24 12L14.59 14.59L12 24L9.41 14.59L0 12L9.41 9.41L12 0Z"/>
            </svg>
          </div>

          {/* Star row */}
          <div
            style={{
              display: 'flex',
              justifyContent: 'center',
              gap: '0.35rem',
              marginBottom: '1.5rem',
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
                <StarIcon />
              </div>
            ))}
          </div>

          <h2
            style={{
              fontFamily: "'Pirata One', 'Playfair Display', cursive",
              fontSize: 'clamp(1.5rem, 4vw, 2.2rem)',
              color: '#e94480',
              marginBottom: '0.5rem',
              letterSpacing: '0.05em',
              textShadow: '0 0 30px rgba(233,68,128,0.2)',
            }}
          >
            {heading}
          </h2>

          {subtitle && (
            <p
              style={{
                fontFamily: "'Playfair Display', serif",
                fontStyle: 'italic',
                fontSize: 'clamp(0.9rem, 1.5vw, 1.1rem)',
                color: 'rgba(255,255,255,0.6)',
                marginBottom: '2rem',
                letterSpacing: '0.02em',
              }}
            >
              {subtitle}
            </p>
          )}

          <a
            href={reviewUrl}
            target="_blank"
            rel="noopener noreferrer"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.75rem',
              padding: '0.9rem 2.5rem',
              background: 'transparent',
              border: '2px solid rgba(233,68,128,0.4)',
              borderRadius: '50px',
              color: '#e94480',
              fontFamily: "'Inter', sans-serif",
              fontSize: '0.75rem',
              fontWeight: 600,
              letterSpacing: '0.2em',
              textTransform: 'uppercase',
              textDecoration: 'none',
              cursor: 'pointer',
              transition: 'all 0.35s cubic-bezier(0.16,1,0.3,1)',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = 'rgba(233,68,128,0.15)'
              e.currentTarget.style.borderColor = 'rgba(233,68,128,0.8)'
              e.currentTarget.style.boxShadow = '0 4px 24px rgba(233,68,128,0.2)'
              e.currentTarget.style.transform = 'translateY(-2px)'
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = 'transparent'
              e.currentTarget.style.borderColor = 'rgba(233,68,128,0.4)'
              e.currentTarget.style.boxShadow = 'none'
              e.currentTarget.style.transform = 'translateY(0)'
            }}
          >
            <GoogleIcon />
            Leave a Review
          </a>
        </div>
      </div>
    </section>
  )
}
