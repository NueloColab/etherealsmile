import { db } from '../../lib/db'
import { services } from '../../lib/schema'
import { eq, asc } from 'drizzle-orm'
import EnquireButton from '../../components/EnquireButton'

export default async function Services() {
  const items = await db.select().from(services).where(eq(services.active, true)).orderBy(asc(services.sortOrder))

  return (
    <section
      id="services"
      className="section"
      style={{
        background: 'linear-gradient(to bottom, transparent, rgba(0,0,0,0.6) 10%, rgba(0,0,0,0.6) 90%, transparent)',
        paddingTop: '6rem',
        paddingBottom: '6rem',
      }}
    >
      <div className="section-inner">
        <h2 className="section-title reveal">Services &amp; Price List</h2>
        <p className="section-subtitle reveal reveal-delay-1">Luxury crystal options, priced with transparency</p>

        <div
          style={{
            maxWidth: '720px',
            margin: '3rem auto 0',
          }}
        >
          {items.length > 0 ? (
            items.map((item, i) => (
              <div
                key={item.id}
                className="reveal"
                style={{
                  borderBottom: '1px solid rgba(255,255,255,0.06)',
                  padding: '1.75rem 0',
                  transition: 'border-color 0.3s ease',
                }}
              >
                <div
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'flex-start',
                    gap: '1.5rem',
                    marginBottom: item.description ? '0.5rem' : '0',
                  }}
                >
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <h3
                      style={{
                        fontFamily: "'Pirata One', 'Playfair Display', cursive",
                        fontSize: '1.15rem',
                        color: '#e94480',
                        fontWeight: 400,
                        letterSpacing: '0.05em',
                        marginBottom: '0.35rem',
                      }}
                    >
                      {item.name}
                    </h3>
                    {item.duration && (
                      <p
                        style={{
                          fontFamily: "'Inter', sans-serif",
                          fontSize: '0.65rem',
                          letterSpacing: '0.15em',
                          textTransform: 'uppercase',
                          color: 'rgba(255,255,255,0.35)',
                        }}
                      >
                        {item.duration}
                      </p>
                    )}
                  </div>

                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '1.25rem',
                      flexShrink: 0,
                    }}
                  >
                    <span
                      style={{
                        fontFamily: "'Playfair Display', serif",
                        fontSize: '1.1rem',
                        color: '#ffffff',
                        whiteSpace: 'nowrap',
                      }}
                    >
                      {item.price}
                    </span>
                    <EnquireButton name={item.name} price={item.price} />
                  </div>
                </div>

                {item.description && (
                  <p
                    style={{
                      fontFamily: "'Inter', sans-serif",
                      fontSize: '0.8rem',
                      color: 'rgba(255,255,255,0.55)',
                      lineHeight: 1.7,
                      maxWidth: '85%',
                    }}
                  >
                    {item.description}
                  </p>
                )}
              </div>
            ))
          ) : (
            <div
              className="frame-card"
              style={{
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