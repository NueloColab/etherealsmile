import { db } from '../../lib/db'
import { services } from '../../lib/schema'
import { eq, asc } from 'drizzle-orm'

export default async function Services() {
  const items = await db.select().from(services).where(eq(services.active, true)).orderBy(asc(services.sortOrder))

  return (
    <section
      id="services"
      className="section"
      style={{
        background: 'linear-gradient(to bottom, transparent, rgba(0,0,0,0.5) 10%, rgba(0,0,0,0.5) 90%, transparent)',
        paddingTop: '6rem',
        paddingBottom: '6rem',
      }}
    >
      <div className="section-inner">
        <h2 className="section-title reveal">Services & Price List</h2>
        <p className="section-subtitle reveal reveal-delay-1">Luxury crystal options, priced with transparency</p>

        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
            gap: '1.5rem',
            marginTop: '3rem',
          }}
        >
          {items.length > 0 ? (
            items.map((item) => (
              <div
                key={item.id}
                className="glass-card card-hover"
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between',
                }}
              >
                <div>
                  <h3
                    style={{
                      fontFamily: "'Playfair Display', serif",
                      fontSize: '1.1rem',
                      color: '#e94480',
                      marginBottom: '0.5rem',
                      fontWeight: 500,
                    }}
                  >
                    {item.name}
                  </h3>
                  {item.duration && (
                    <p
                      style={{
                        fontFamily: "'Inter', sans-serif",
                        fontSize: '0.7rem',
                        letterSpacing: '0.1em',
                        textTransform: 'uppercase',
                        color: 'rgba(255,255,255,0.4)',
                        marginBottom: '0.75rem',
                      }}
                    >
                      {item.duration}
                    </p>
                  )}
                  <p
                    style={{
                      fontFamily: "'Inter', sans-serif",
                      fontSize: '0.8rem',
                      color: 'rgba(255,255,255,0.65)',
                      lineHeight: 1.7,
                    }}
                  >
                    {item.description}
                  </p>
                </div>
                <div
                  style={{
                    marginTop: '1.5rem',
                    paddingTop: '1rem',
                    borderTop: '1px solid rgba(255,255,255,0.05)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                  }}
                >
                  <span
                    style={{
                      fontFamily: "'Playfair Display', serif",
                      fontSize: '1.2rem',
                      color: '#ffffff',
                    }}
                  >
                    {item.price}
                  </span>
                  <a href="#book" className="btn btn-outline" style={{ padding: '0.5rem 1.25rem', fontSize: '0.6rem' }}>
                    Enquire
                  </a>
                </div>
              </div>
            ))
          ) : (
            <div
              className="glass-card"
              style={{
                gridColumn: '1 / -1',
                textAlign: 'center',
                padding: '3rem',
              }}
            >
              <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: '0.9rem' }}>
                Services coming soon. Please check back or send us an enquiry.
              </p>
            </div>
          )}
        </div>
      </div>
    </section>
  )
}
