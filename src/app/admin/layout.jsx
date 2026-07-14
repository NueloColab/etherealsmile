'use client'

import { useState, useEffect } from 'react'
import { useRouter, usePathname } from 'next/navigation'
import AdminSidebar from '../../components/AdminSidebar'

export default function AdminLayout({ children }) {
  const router = useRouter()
  const pathname = usePathname()
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
    
    fetch('/api/auth/session')
      .then((r) => r.json())
      .then((session) => {
        if (!session?.user && pathname !== '/admin/login') {
          router.push('/admin/login')
        }
      })
  }, [pathname, router])

  const isLogin = mounted && pathname === '/admin/login'

  if (isLogin) {
    return (
      <div style={{ minHeight: '100vh', background: '#000000', color: '#ffffff' }}>
        {children}
      </div>
    )
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
