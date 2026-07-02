'use client'

export default function Home() {
  const stars = Array.from({ length: 80 }, (_, i) => ({
    id: i,
    left: `${Math.random() * 100}%`,
    top: `${Math.random() * 100}%`,
    duration: `${2 + Math.random() * 4}s`,
    delay: `${Math.random() * 5}s`,
    isGold: i % 5 === 0,
  }))

  return (
    <main style={{ minHeight: '100vh', position: 'relative', overflow: 'hidden' }}>
      {/* Stars background */}
      {stars.map((star) => (
        <div
          key={star.id}
          className={`star ${star.isGold ? 'gold' : ''}`}
          style={{
            left: star.left,
            top: star.top,
            '--duration': star.duration,
            '--delay': star.delay,
          }}
        />
      ))}

      {/* Top radial glow */}
      <div style={{
        position: 'absolute',
        top: '20%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        width: '800px',
        height: '800px',
        background: 'radial-gradient(circle, rgba(139,0,70,0.12) 0%, transparent 70%)',
        pointerEvents: 'none',
      }} />

      {/* ===== HERO SECTION ===== */}
      <section style={{
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '2rem 1.5rem',
        position: 'relative',
        zIndex: 1,
      }}>
        {/* Logo - the mouth illustration */}
        <div style={{
          animation: 'float 6s ease-in-out infinite',
          maxWidth: '380px',
          width: '100%',
          marginBottom: '1.5rem',
        }}>
          <img
            src="/logo.jpg"
            alt="Ethereal Smile - Crystal Tooth Gems"
            className="image-glow"
            style={{
              width: '100%',
              height: 'auto',
              borderRadius: '16px',
              filter: 'drop-shadow(0 0 50px rgba(139,0,70,0.4))',
            }}
          />
        </div>

        {/* Brand name */}
        <h1 style={{
          fontFamily: "'Playfair Display', serif",
          fontSize: 'clamp(2.2rem, 6vw, 4rem)',
          fontWeight: 700,
          letterSpacing: '0.2em',
          textTransform: 'uppercase',
          textAlign: 'center',
          lineHeight: 1.1,
          animation: 'fadeInUp 1s ease-out 0.3s both',
          background: 'linear-gradient(135deg, #ffffff 0%, #c9a96e 50%, #ffffff 100%)',
          backgroundSize: '200% auto',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          backgroundClip: 'text',
          animationName: 'fadeInUp, shimmer',
          animationDuration: '1s, 4s',
          animationTimingFunction: 'ease-out, linear',
          animationFillMode: 'both, none',
          animationIterationCount: '1, infinite',
          animationDelay: '0.3s, 0s',
        }}>
          Ethereal Smile
        </h1>

        {/* Tagline */}
        <p style={{
          fontFamily: "'Playfair Display', serif",
          fontStyle: 'italic',
          fontSize: 'clamp(0.95rem, 2.2vw, 1.15rem)',
          color: '#c9a96e',
          textAlign: 'center',
          letterSpacing: '0.12em',
          animation: 'fadeInUp 1s ease-out 0.6s both',
          marginTop: '0.75rem',
        }}>
          Genuine Swarovski &amp; Preciosa Crystal Tooth Gems
        </p>

        {/* By Hattie Clifford */}
        <p style={{
          fontFamily: "'Inter', sans-serif",
          fontSize: '0.8rem',
          color: 'rgba(255,255,255,0.5)',
          letterSpacing: '0.25em',
          textTransform: 'uppercase',
          animation: 'fadeInUp 1s ease-out 0.8s both',
          marginTop: '0.5rem',
        }}>
          by Hattie Clifford
        </p>

        {/* Coming Soon */}
        <div style={{
          animation: 'fadeInUp 1s ease-out 1s both',
          textAlign: 'center',
          marginTop: '2rem',
          padding: '1rem 2rem',
          border: '1px solid rgba(201, 169, 110, 0.25)',
          borderRadius: '4px',
          background: 'rgba(139, 0, 70, 0.06)',
        }}>
          <p style={{
            fontFamily: "'Inter', sans-serif",
            fontSize: 'clamp(1rem, 2.5vw, 1.3rem)',
            fontWeight: 300,
            letterSpacing: '0.35em',
            textTransform: 'uppercase',
          }}>
            Coming Soon
          </p>
          <p style={{
            fontFamily: "'Inter', sans-serif",
            fontSize: '0.8rem',
            color: 'rgba(255,255,255,0.45)',
            letterSpacing: '0.06em',
            marginTop: '0.4rem',
          }}>
            Follow us for upcoming events and bookings
          </p>
        </div>

        {/* Scroll indicator */}
        <div style={{
          position: 'absolute',
          bottom: '2rem',
          animation: 'bounce 2s ease-in-out infinite',
          opacity: 0.4,
        }}>
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
            <path d="M12 5v14M5 12l7 7 7-7" />
          </svg>
        </div>
      </section>

      {/* ===== ABOUT SECTION ===== */}
      <section style={{
        position: 'relative',
        zIndex: 1,
        padding: '4rem 1.5rem',
        maxWidth: '900px',
        margin: '0 auto',
      }}>
        <div className="section-divider" style={{ marginBottom: '3rem' }} />

        <div style={{
          display: 'grid',
          gridTemplateColumns: '1fr',
          gap: '2.5rem',
          alignItems: 'center',
        }}>
          {/* Hattie portrait */}
          <div style={{
            animation: 'fadeIn 1.5s ease-out both',
            textAlign: 'center',
          }}>
            <img
              src="/hattie-portrait.jpg"
              alt="Hattie Clifford - Ethereal Smile tooth gem technician"
              className="image-glow"
              style={{
                width: '100%',
                maxWidth: '340px',
                height: 'auto',
                borderRadius: '12px',
                filter: 'drop-shadow(0 0 30px rgba(139,0,70,0.25))',
                objectFit: 'cover',
              }}
            />
          </div>

          {/* About text */}
          <div style={{
            animation: 'fadeInUp 1s ease-out 0.3s both',
          }}>
            <h2 style={{
              fontFamily: "'Playfair Display', serif",
              fontSize: 'clamp(1.4rem, 3vw, 1.8rem)',
              fontWeight: 600,
              letterSpacing: '0.1em',
              marginBottom: '1rem',
              color: '#c9a96e',
            }}>
              Hattie Clifford
            </h2>
            <p style={{
              fontFamily: "'Inter', sans-serif",
              fontSize: '0.95rem',
              lineHeight: 1.7,
              color: 'rgba(255,255,255,0.75)',
              fontWeight: 300,
            }}>
              Professional tooth gem technician specialising in genuine Swarovski and Preciosa crystal applications. 
              Each gem is carefully selected and precision-placed to create stunning, lasting smiles that catch the light.
            </p>
            <p style={{
              fontFamily: "'Inter', sans-serif",
              fontSize: '0.85rem',
              lineHeight: 1.7,
              color: 'rgba(255,255,255,0.5)',
              marginTop: '1rem',
              fontWeight: 300,
            }}>
              Based in the UK. Available for events, studio appointments, and private bookings.
            </p>
          </div>
        </div>
      </section>

      {/* ===== PORTFOLIO / IN ACTION SECTION ===== */}
      <section style={{
        position: 'relative',
        zIndex: 1,
        padding: '4rem 1.5rem',
        maxWidth: '900px',
        margin: '0 auto',
      }}>
        <div className="section-divider" style={{ marginBottom: '3rem' }} />

        <h2 style={{
          fontFamily: "'Playfair Display', serif",
          fontSize: 'clamp(1.3rem, 2.5vw, 1.6rem)',
          fontWeight: 500,
          letterSpacing: '0.15em',
          textTransform: 'uppercase',
          textAlign: 'center',
          marginBottom: '2rem',
          animation: 'fadeInUp 1s ease-out both',
        }}>
          In Action
        </h2>

        <div style={{
          animation: 'fadeIn 1.5s ease-out 0.3s both',
          textAlign: 'center',
        }}>
          <img
            src="/hattie-working.jpg"
            alt="Hattie Clifford applying a crystal tooth gem"
            className="image-glow"
            style={{
              width: '100%',
              maxWidth: '600px',
              height: 'auto',
              borderRadius: '12px',
              filter: 'drop-shadow(0 0 30px rgba(139,0,70,0.2))',
            }}
          />
          <p style={{
            fontFamily: "'Inter', sans-serif",
            fontSize: '0.75rem',
            color: 'rgba(255,255,255,0.35)',
            letterSpacing: '0.1em',
            marginTop: '0.75rem',
            textTransform: 'uppercase',
          }}>
            Precision. Care. Artistry.
          </p>
        </div>
      </section>

      {/* ===== BRAND CARD SECTION ===== */}
      <section style={{
        position: 'relative',
        zIndex: 1,
        padding: '4rem 1.5rem',
        maxWidth: '600px',
        margin: '0 auto',
      }}>
        <div className="section-divider" style={{ marginBottom: '3rem' }} />

        <div style={{
          animation: 'fadeIn 1.5s ease-out both',
          textAlign: 'center',
        }}>
          <img
            src="/brand-card-2.png"
            alt="Ethereal Smile - Theeth Smile brand design"
            style={{
              width: '100%',
              maxWidth: '480px',
              height: 'auto',
              borderRadius: '12px',
              filter: 'drop-shadow(0 0 30px rgba(139,0,70,0.3))',
            }}
          />
        </div>
      </section>

      {/* ===== CONTACT SECTION ===== */}
      <section style={{
        position: 'relative',
        zIndex: 1,
        padding: '4rem 1.5rem 3rem',
        maxWidth: '600px',
        margin: '0 auto',
      }}>
        <div className="section-divider" style={{ marginBottom: '2.5rem' }} />

        <h2 style={{
          fontFamily: "'Playfair Display', serif",
          fontSize: 'clamp(1.3rem, 2.5vw, 1.6rem)',
          fontWeight: 500,
          letterSpacing: '0.15em',
          textTransform: 'uppercase',
          textAlign: 'center',
          marginBottom: '2rem',
          animation: 'fadeInUp 1s ease-out both',
        }}>
          Get in Touch
        </h2>

        <div style={{
          display: 'flex',
          gap: '1rem',
          justifyContent: 'center',
          flexWrap: 'wrap',
          animation: 'fadeInUp 1s ease-out 0.3s both',
        }}>
          <a
            href="https://www.instagram.com/etherealsmilex"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Instagram"
            className="social-link"
          >
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
              <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
              <circle cx="12" cy="12" r="5" />
              <circle cx="17.5" cy="6.5" r="1" fill="currentColor" stroke="none" />
            </svg>
            <span>Instagram</span>
          </a>

          <a
            href="https://www.tiktok.com/@etherealsmilex"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="TikTok"
            className="social-link"
          >
            <svg width="28" height="28" viewBox="0 0 24 24" fill="currentColor">
              <path d="M19.59 6.69a4.83 4.83 0 01-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 01-2.88 2.5 2.89 2.89 0 01-2.89-2.89 2.89 2.89 0 012.89-2.89c.28 0 .54.04.79.1v-3.5a6.37 6.37 0 00-.79-.05A6.34 6.34 0 003.15 15.2a6.34 6.34 0 006.34 6.34 6.34 6.34 0 006.34-6.34V8.57a8.27 8.27 0 004.76 1.5V6.69h-1z"/>
            </svg>
            <span>TikTok</span>
          </a>

          <a
            href="mailto:etherealsmilex@gmail.com"
            aria-label="Email"
            className="social-link"
          >
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
              <rect x="2" y="4" width="20" height="16" rx="2" />
              <path d="M22 4L12 13L2 4" />
            </svg>
            <span>Email</span>
          </a>
        </div>

        {/* QR Code note */}
        <p style={{
          fontFamily: "'Inter', sans-serif",
          fontSize: '0.7rem',
          color: 'rgba(255,255,255,0.25)',
          textAlign: 'center',
          marginTop: '1.5rem',
          letterSpacing: '0.1em',
        }}>
          @etherealsmilex on Instagram &amp; TikTok
        </p>
      </section>

      {/* ===== FOOTER ===== */}
      <footer style={{
        position: 'relative',
        zIndex: 1,
        padding: '2rem 1.5rem',
        textAlign: 'center',
        borderTop: '1px solid rgba(201, 169, 110, 0.15)',
      }}>
        <div style={{
          width: '40px',
          height: '1px',
          background: 'linear-gradient(90deg, transparent, #c9a96e, transparent)',
          margin: '0 auto 1rem',
        }} />
        <p style={{
          fontFamily: "'Playfair Display', serif",
          fontSize: '0.75rem',
          color: 'rgba(255,255,255,0.2)',
          letterSpacing: '0.2em',
          textTransform: 'uppercase',
        }}>
          Ethereal Smile &mdash; Hattie Clifford
        </p>
        <p style={{
          fontFamily: "'Inter', sans-serif",
          fontSize: '0.6rem',
          color: 'rgba(255,255,255,0.12)',
          marginTop: '0.5rem',
        }}>
          etherealsmile.co.uk
        </p>
      </footer>
    </main>
  )
}