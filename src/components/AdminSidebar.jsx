'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'

const menuItems = [
  { label: 'Dashboard', href: '/admin', icon: '📊' },
  { label: 'Enquiries', href: '/admin/enquiries', icon: '📩' },
  { label: 'Bookings', href: '/admin/bookings', icon: '📅' },
  { label: 'CMS Editor', href: '/admin/cms', icon: '✏️' },
  { label: 'Services', href: '/admin/services', icon: '💎' },
  { label: 'Journal', href: '/admin/blog', icon: '📝' },
  { label: 'Gallery', href: '/admin/gallery', icon: '🖼️' },
  { label: 'Invoices', href: '/admin/invoices', icon: '💷' },
]

export default function AdminSidebar({ isOpen, onClose }) {
  const pathname = usePathname()

  return (
    <>
      {/* Mobile overlay */}
      {isOpen && (
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
          transform: isOpen ? 'translateX(0)' : 'translateX(-100%)',
          transition: 'transform 0.3s ease',
        }}
        className="lg:translate-x-0"
      >
        {/* Logo */}
        <div style={{ padding: '1.5rem 1.25rem', borderBottom: '1px solid rgba(233,68,128,0.1)' }}>
          <Link href="/admin" style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', textDecoration: 'none' }}>
            <img
              src="/ethereal-logo.png"
              alt="Ethereal Smile"
              style={{ height: '40px', width: 'auto', display: 'block' }}
            />
          </Link>
        </div>

        {/* Navigation */}
        <nav style={{ flex: 1, padding: '0.75rem 0.5rem', overflowY: 'auto' }}>
          {menuItems.map((item) => {
            const isActive = pathname === item.href || (item.href !== '/admin' && pathname?.startsWith(item.href))
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={onClose}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.75rem',
                  padding: '0.7rem 1rem',
                  borderRadius: '8px',
                  fontSize: '0.8rem',
                  fontWeight: isActive ? 600 : 500,
                  letterSpacing: '0.02em',
                  color: isActive ? '#e94480' : 'rgba(255,255,255,0.55)',
                  background: isActive ? 'rgba(233,68,128,0.1)' : 'transparent',
                  border: isActive ? '1px solid rgba(233,68,128,0.2)' : '1px solid transparent',
                  textDecoration: 'none',
                  transition: 'all 0.2s ease',
                  marginBottom: '2px',
                }}
              >
                <span style={{ fontSize: '1rem', lineHeight: 1 }}>{item.icon}</span>
                {item.label}
              </Link>
            )
          })}
        </nav>

        {/* Bottom */}
        <div style={{ padding: '1rem 1.25rem', borderTop: '1px solid rgba(255,255,255,0.05)' }}>
          <Link
            href="/"
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
              fontSize: '0.75rem',
              color: 'rgba(255,255,255,0.35)',
              textDecoration: 'none',
              transition: 'color 0.2s ease',
            }}
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
            </svg>
            Back to Site
          </Link>
        </div>
      </aside>
    </>
  )
}