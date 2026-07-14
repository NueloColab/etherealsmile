'use client'

import { useState, useEffect } from 'react'
import { useRouter, usePathname } from 'next/navigation'
import AdminSidebar from '../../components/AdminSidebar'

export default function AdminLayout({ children }) {
  const router = useRouter()
  const pathname = usePathname()
  const [mounted, setMounted] = useState(false)
  const [authed, setAuthed] = useState(false)
  const [checking, setChecking] = useState(true)

  useEffect(() => {
    setMounted(true)

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

  const isLogin = pathname === '/admin/login'

  if (isLogin) {
    return (
      <div style={{ minHeight: '100vh', background: '#000000', color: '#ffffff' }}>
        {children}
      </div>
    )
  }

  // Show loading spinner while checking auth
  if (checking || !mounted) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#000000' }}>
        <div style={{ width: '32px', height: '32px', border: '2px solid rgba(233,68,128,0.3)', borderTopColor: '#e94480', borderRadius: '50%', animation: 'spin 0.8s linear infinite' }} />
        <style>{`@keyframes spin { to { transform: rotate(360deg) } }`}</style>
      </div>
    )
  }

  if (!authed) {
    return null
  }

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
