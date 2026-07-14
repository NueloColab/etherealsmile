'use client'

import Link from 'next/link'

export default function DashboardStats({ stats }) {
  return (
    <div
      style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))',
        gap: '1.25rem',
        marginBottom: '2.5rem',
      }}
    >
      {stats.map((stat) => (
        <Link
          key={stat.label}
          href={stat.href}
          style={{ textDecoration: 'none' }}
        >
          <div
            style={{
              background: 'rgba(255,255,255,0.03)',
              border: '1px solid rgba(255,255,255,0.06)',
              borderRadius: '14px',
              padding: '1.75rem 1.5rem',
              textAlign: 'center',
              transition: 'all 0.3s ease',
              cursor: 'pointer',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.borderColor = 'rgba(233, 68, 128, 0.25)'
              e.currentTarget.style.transform = 'translateY(-3px)'
              e.currentTarget.style.boxShadow = '0 8px 24px rgba(233, 68, 128, 0.08)'
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.borderColor = 'rgba(255,255,255,0.06)'
              e.currentTarget.style.transform = 'translateY(0)'
              e.currentTarget.style.boxShadow = 'none'
            }}
          >
            <p
              style={{
                fontFamily: "'Pirata One', 'Playfair Display', cursive",
                fontSize: '2.5rem',
                color: stat.color,
                marginBottom: '0.5rem',
                lineHeight: 1,
              }}
            >
              {stat.count}
            </p>
            <p
              style={{
                fontFamily: "'Inter', sans-serif",
                fontSize: '0.7rem',
                letterSpacing: '0.15em',
                textTransform: 'uppercase',
                color: 'rgba(255,255,255,0.5)',
                fontWeight: 500,
              }}
            >
              {stat.label}
            </p>
          </div>
        </Link>
      ))}
    </div>
  )
}