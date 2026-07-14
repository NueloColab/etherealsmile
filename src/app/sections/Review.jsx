export default function Review() {
  return (
    <section
      id="review"
      className="section"
      style={{
        background: 'linear-gradient(to bottom, transparent, rgba(0,0,0,0.6) 10%, rgba(0,0,0,0.6) 90%, transparent)',
        paddingTop: '6rem',
        paddingBottom: '6rem',
      }}
    >
      <div className="section-inner">
        <div
          className="frame-card reveal reveal-scale reveal-delay-2"
          style={{
            textAlign: 'center',
            maxWidth: '600px',
            margin: '0 auto',
          }}
        >
          <h3
            className="reveal"
            style={{
              fontFamily: "'Playfair Display', serif",
              fontSize: '1.3rem',
              color: '#e94480',
              marginBottom: '0.75rem',
              fontWeight: 500,
            }}
          >
            Love Your Smile?
          </h3>

          <p
            className="reveal reveal-delay-1"
            style={{
              fontFamily: "'Inter', sans-serif",
              fontSize: '0.85rem',
              color: 'rgba(255,255,255,0.65)',
              lineHeight: 1.7,
              marginBottom: '1.5rem',
            }}
          >
            If you've visited Ethereal Smile, we'd be honoured if you left us a review. Your words help others discover the sparkle.
          </p>

          <a
            href="https://www.google.com/search?q=ethereal+smile+tooth+gems"
            target="_blank"
            rel="noopener noreferrer"
            className="btn btn-outline reveal reveal-delay-3"
          >
            Leave a Review on Google
          </a>
        </div>
      </div>
    </section>
  )
}
