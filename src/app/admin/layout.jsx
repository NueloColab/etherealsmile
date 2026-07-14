'use client'

import { useState, useEffect } from 'react'
import { useRouter, usePathname } from 'next/navigation'
import AdminSidebar from '../../components/AdminSidebar'

export default function AdminLayout({ children }) {
  const router = useRouter()
  const pathname = usePathname()
  const [authed, setAuthed] = useState(false)
  const [checking, setChecking] = useState(true)
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [isMobile, setIsMobile] = useState(false)

  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 1024)
    check()
    window.addEventListener('resize', check)
    return () => window.removeEventListener('resize', check)
  }, [])

  useEffect(() => {
    if (pathname === '/admin/login') {
      setChecking(false)
      return
    }

    fetch('/api/auth/session')
      .then((r) => r.json())
      .then((session) => {
        if (session?.user) {
          setAuthed(true)
        } else {
          router.replace('/admin/login')
        }
      })
      .catch(() => {
        router.replace('/admin/login')
      })
      .finally(() => {
        setChecking(false)
      })
  }, [pathname, router])

  // Login page: no sidebar, no header
  if (pathname === '/admin/login') {
    return (
      <div style={{ minHeight: '100vh', background: '#0a0e17', color: '#ffffff', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        {children}
      </div>
    )
  }

  // Checking auth: show spinner
  if (checking || !authed) {
    return (
      <div style={{ minHeight: '100vh', background: '#0a0e17', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ width: '32px', height: '32px', border: '2px solid rgba(233,68,128,0.3)', borderTopColor: '#e94480', borderRadius: '50%', animation: 'eth-admin-spin 0.8s linear infinite' }}>
          <style>{`@keyframes eth-admin-spin { to { transform: rotate(360deg) } }`}</style>
        </div>
      </div>
    )
  }

  // Authenticated layout: sidebar + content area
  return (
    <div style={{ minHeight: '100vh', background: '#0a0e17', color: '#ffffff', fontFamily: "'Inter', sans-serif" }}>
      <AdminSidebar isOpen={sidebarOpen || !isMobile} onClose={() => setSidebarOpen(false)} />

      {/* Main content area */}
      <div style={{
        marginLeft: isMobile ? 0 : '260px',
        minHeight: '100vh',
        transition: 'margin-left 0.3s ease',
      }}>
        {/* Top header bar */}
        <header style={{
          height: '56px',
          borderBottom: '1px solid rgba(233,68,128,0.1)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '0 1.5rem',
          background: '#0a0e17',
          position: 'sticky',
          top: 0,
          zIndex: 30,
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            {/* Mobile menu button */}
            {isMobile && (
              <button
                onClick={() => setSidebarOpen(true)}
                style={{
                  background: 'none',
                  border: 'none',
                  color: '#e94480',
                  cursor: 'pointer',
                  padding: '0.5rem',
                  display: 'flex',
                  alignItems: 'center',
                }}
              >
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="3" y1="6" x2="21" y2="6" />
                  <line x1="3" y1="12" x2="21" y2="12" />
                  <line x1="3" y1="18" x2="21" y2="18" />
                </svg>
              </button>
            )}
            <span style={{ fontSize: '0.75rem', color: 'rgba(255,255,255,0.3)', letterSpacing: '0.1em', textTransform: 'uppercase' }}>
              Admin Portal
            </span>
          </div>

          <a
            href="/"
            target="_blank"
            rel="noopener noreferrer"
            style={{
              fontSize: '0.7rem',
              color: 'rgba(255,255,255,0.4)',
              textDecoration: 'none',
              padding: '0.4rem 1rem',
              border: '1px solid rgba(255,255,255,0.1)',
              borderRadius: '50px',
              transition: 'all 0.2s ease',
            }}
          >
            View Site &rarr;
          </a>
        </header>

        {/* Page content */}
        <main style={{ padding: '2rem', maxWidth: '1200px', width: '100%' }}>
          {children}
        </main>
      </div>

      {/* Responsive styles */}
      <style>{`
        @media (max-width: 1023px) {
          .admin-main-content {
            margin-left: 0 !important;
          }
        }
      `}</style>
    </div>
  )
}