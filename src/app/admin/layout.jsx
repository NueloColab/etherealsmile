'use client'

import { useState, useEffect } from 'react'
import { useRouter, usePathname } from 'next/navigation'
import AdminSidebar from '../../components/AdminSidebar'

export default function AdminLayout({ children }) {
  const router = useRouter()
  const pathname = usePathname()
  const [authed, setAuthed] = useState(false)
  const [checking, setChecking] = useState(true)

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

  // Login page: no sidebar, no auth needed
  if (pathname === '/admin/login') {
    return (
      <div style={{ minHeight: '100vh', background: '#000000', color: '#ffffff' }}>
        {children}
      </div>
    )
  }

  // Checking auth or not authenticated: show minimal spinner
  if (checking || !authed) {
    return (
      <div style={{ minHeight: '100vh', background: '#000000', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ width: '32px', height: '32px', border: '2px solid rgba(233,68,128,0.3)', borderTopColor: '#e94480', borderRadius: '50%', animation: 'eth-admin-spin 0.8s linear infinite' }}>
          <style>{`@keyframes eth-admin-spin { to { transform: rotate(360deg) } }`}</style>
        </div>
      </div>
    )
  }

  // Authenticated: show sidebar + content
  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: '#000000' }}>
      <AdminSidebar />
      <main
        style={{
          flex: 1,
          marginLeft: '260px',
          minHeight: '100vh',
          background: '#000000',
          color: '#ffffff',
        }}
      >
        {children}
      </main>
    </div>
  )
}