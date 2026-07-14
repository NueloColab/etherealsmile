export default function Review() {
  return (
    <section
      id="review"
      className="section"
      style={{
        background: 'linear-gradient(to bottom, transparent, rgba(0,0,0,0.5) 20%, rgba(0,0,0,0.5) 80%, transparent)',
        padding: '4rem 1.5rem',
      }}
    >
      <div className="section-inner">
        <div
          className="frame-card"
          style={{
            textAlign: 'center',
            maxWidth: '600px',
            margin: '0 auto',
          }}
        >
          <h3
            style={{
              fontFamily: "'Playfair Display', serif",
              fontSize: '1.3rem',
              color: '#c9a96e',
              marginBottom: '0.75rem',
              fontWeight: 500,
            }}
          >
            Love Your Smile?
          </h3>

          <p
            style={{
              fontFamily: "'Inter', sans-serif",
              fontSize: '0.85rem',
              color: 'rgba(255,255,255,0.65)',
              lineHeight: 1.7,
              marginBottom: '1.5rem',
            }}
          >
            If you\u2019ve visited Ethereal Smile, we\u2019d be honoured if you left us a review. Your words help others discover the sparkle.
          </p>

          <a
            href="https://www.google.com/search?q=ethereal+smile+tooth+gems"
            target="_blank"
            rel="noopener noreferrer"
            className="btn btn-outline"
          >
            Leave a Review on Google
          </a>
        </div>
      </div>
    </section>
  )
}
