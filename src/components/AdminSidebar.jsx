'use client'

import { useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'

const mainMenuItems = [
  { label: 'Overview', href: '/admin', icon: 'M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6' },
  { label: 'Enquiries', href: '/admin/enquiries', icon: 'M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z' },
  { label: 'Bookings', href: '/admin/bookings', icon: 'M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z' },
  { label: 'CMS Editor', href: '/admin/cms', icon: 'M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z' },
  { label: 'Services', href: '/admin/services', icon: 'M5 3v4M3 5h4M6 17v4m-2-2h4M19 3v4m-2-2h4M19 17v4m-2-2h4' },
  { label: 'Journal', href: '/admin/blog', icon: 'M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9m7 4H9m7 4H9' },
  { label: 'Gallery', href: '/admin/gallery', icon: 'M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z' },
  { label: 'Invoices', href: '/admin/invoices', icon: 'M9 14l6-6m-5.5.5h.01m4.99 5h.01M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16l3.5-2 3.5 2 3.5-2 3.5 2z' },
]

const bottomMenuItems = [
  { label: 'Back to Site', href: '/', icon: 'M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3' },
]

export default function AdminSidebar({ isOpen, onClose, isMobile }) {
  const pathname = usePathname()

  return (
    <>
      {/* Mobile overlay - only shows when sidebar is open on mobile */}
      {isMobile && isOpen && (
        <div
          onClick={onClose}
          style={{
            position: 'fixed',
            inset: 0,
            background: 'rgba(0,0,0,0.5)',
            zIndex: 40,
          }}
        />
      )}

      {/* Sidebar */}
      <aside
        style={{
          position: 'fixed',
          left: 0,
          top: 0,
          bottom: 0,
          width: '260px',
          background: '#0a0e17',
          borderRight: '1px solid rgba(233,68,128,0.1)',
          zIndex: 50,
          display: 'flex',
          flexDirection: 'column',
          overflowY: 'auto',
          scrollbarWidth: 'thin',
          scrollbarColor: 'rgba(233,68,128,0.2) transparent',
          transition: 'transform 0.3s ease',
        }}
      >
        {/* Logo */}
        <Link
          href="/admin"
          onClick={onClose}
          style={{
            display: 'block',
            padding: '1.75rem 1.25rem 1rem',
            textDecoration: 'none',
            textAlign: 'center',
            borderBottom: '1px solid rgba(233,68,128,0.1)',
          }}
        >
          <img
            src="/ethereal-logo.png"
            alt="Ethereal Smile"
            style={{ height: '48px', width: 'auto', margin: '0 auto 0.5rem', display: 'block' }}
          />
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.75rem' }}>
            <div style={{ width: '24px', height: '1px', background: 'rgba(233,68,128,0.3)' }} />
            <p style={{ fontSize: '9px', letterSpacing: '3px', textTransform: 'uppercase', color: 'rgba(233,68,128,0.5)', margin: 0, fontFamily: "'Inter', sans-serif" }}>
              Admin Portal
            </p>
            <div style={{ width: '24px', height: '1px', background: 'rgba(233,68,128,0.3)' }} />
          </div>
        </Link>

        {/* Main Navigation */}
        <nav style={{ flex: 1, padding: '0.75rem 0.5rem', marginTop: '0.5rem' }}>
          <div style={{ marginBottom: '1.5rem' }}>
            {mainMenuItems.map((item) => {
              const isActive = item.href === '/admin'
                ? pathname === '/admin'
                : pathname?.startsWith(item.href)
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={onClose}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.75rem',
                    padding: '0.65rem 1rem',
                    borderRadius: '8px',
                    fontSize: '0.8rem',
                    fontWeight: isActive ? 600 : 500,
                    letterSpacing: '0.02em',
                    color: isActive ? '#e94480' : 'rgba(255,255,255,0.5)',
                    background: isActive ? 'rgba(233,68,128,0.1)' : 'transparent',
                    borderLeft: isActive ? '2px solid #e94480' : '2px solid transparent',
                    textDecoration: 'none',
                    transition: 'all 0.2s ease',
                    marginBottom: '2px',
                  }}
                >
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0 }}>
                    <path d={item.icon} />
                  </svg>
                  {item.label}
                </Link>
              )
            })}
          </div>
        </nav>

        {/* Bottom */}
        <div style={{ padding: '0.75rem 0.5rem', borderTop: '1px solid rgba(255,255,255,0.05)' }}>
          {bottomMenuItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              onClick={onClose}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.75rem',
                padding: '0.65rem 1rem',
                borderRadius: '8px',
                fontSize: '0.75rem',
                fontWeight: 500,
                letterSpacing: '0.02em',
                color: 'rgba(255,255,255,0.35)',
                textDecoration: 'none',
                transition: 'color 0.2s ease',
                marginBottom: '2px',
              }}
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d={item.icon} />
              </svg>
              {item.label}
            </Link>
          ))}
        </div>
      </aside>
    </>
  )
}