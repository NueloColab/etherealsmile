'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'

const menuItems = [
  { label: 'Dashboard', href: '/admin', icon: 'M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6' },
  { label: 'Enquiries', href: '/admin/enquiries', icon: 'M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z' },
  { label: 'Services', href: '/admin/services', icon: 'M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M12 16h.01M8 16h.01' },
  { label: 'Journal', href: '/admin/blog', icon: 'M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 20h6' },
  { label: 'Gallery', href: '/admin/gallery', icon: 'M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z' },
]

export default function AdminSidebar({ onClose }) {
  const pathname = usePathname()

  return (
    <aside
      style={{
        width: '260px',
        height: '100vh',
        background: '#0a0a0a',
        borderRight: '1px solid rgba(233, 68, 128, 0.15)',
        display: 'flex',
        flexDirection: 'column',
        position: 'fixed',
        left: 0,
        top: 0,
        zIndex: 50,
      }}
    >
      {/* Logo */}
      <div style={{ padding: '2rem 1.5rem 1.5rem' }}>
        <Link href="/admin" onClick={onClose}>
          <img
            src="/hero-logo-card.png"
            alt="Ethereal Smile"
            style={{
              height: '48px',
              width: 'auto',
              display: 'block',
              opacity: 0.9,
            }}
          />
        </Link>
        <p
          style={{
            fontFamily: "'Inter', sans-serif",
            fontSize: '0.65rem',
            color: 'rgba(255,255,255,0.3)',
            letterSpacing: '0.15em',
            textTransform: 'uppercase',
            marginTop: '0.5rem',
          }}
        >
          Admin Portal
        </p>
      </div>

      {/* Navigation */}
      <nav style={{ flex: 1, padding: '0 0.75rem' }}>
        {menuItems.map((item) => {
          const isActive = pathname === item.href || pathname?.startsWith(item.href + '/')
          return (
            <Link
              key={item.href}
              href={item.href}
              onClick={onClose}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.75rem',
                padding: '0.85rem 1rem',
                borderRadius: '8px',
                textDecoration: 'none',
                fontFamily: "'Inter', sans-serif",
                fontSize: '0.8rem',
                fontWeight: 500,
                letterSpacing: '0.04em',
                color: isActive ? '#e94480' : 'rgba(255,255,255,0.6)',
                background: isActive ? 'rgba(233, 68, 128, 0.1)' : 'transparent',
                border: isActive ? '1px solid rgba(233, 68, 128, 0.2)' : '1px solid transparent',
                transition: 'all 0.2s ease',
                marginBottom: '0.25rem',
              }}
              onMouseEnter={(e) => {
                if (!isActive) {
                  e.currentTarget.style.background = 'rgba(255,255,255,0.04)'
                  e.currentTarget.style.color = 'rgba(255,255,255,0.85)'
                }
              }}
              onMouseLeave={(e) => {
                if (!isActive) {
                  e.currentTarget.style.background = 'transparent'
                  e.currentTarget.style.color = 'rgba(255,255,255,0.6)'
                }
              }}
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d={item.icon} />
              </svg>
              {item.label}
            </Link>
          )
        })}
      </nav>

      {/* Bottom */}
      <div
        style={{
          padding: '1rem 1.5rem',
          borderTop: '1px solid rgba(255,255,255,0.05)',
        }}
      >
        <Link
          href="/"
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem',
            fontFamily: "'Inter', sans-serif",
            fontSize: '0.75rem',
            color: 'rgba(255,255,255,0.4)',
            textDecoration: 'none',
            transition: 'color 0.2s',
          }}
          onMouseEnter={(e) => (e.target.style.color = '#e94480')}
          onMouseLeave={(e) => (e.target.style.color = 'rgba(255,255,255,0.4)')}
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
          </svg>
          Back to Site
        </Link>
      </div>
    </aside>
  )
}
