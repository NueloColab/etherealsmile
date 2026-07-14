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
    // Skip auth check on login page
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
          router.push('/admin/login')
        }
      })
      .catch(() => {
        router.push('/admin/login')
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

  // Still checking auth: show nothing (prevents flash)
  if (checking || !authed) {
    return null
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