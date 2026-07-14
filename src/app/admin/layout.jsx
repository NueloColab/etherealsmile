'use client'

import { useEffect } from 'react'
import { useRouter, usePathname } from 'next/navigation'
import AdminSidebar from '../../components/AdminSidebar'

export default function AdminLayout({ children }) {
  const router = useRouter()
  const pathname = usePathname()

  useEffect(() => {
    // Only run auth check on client side
    if (typeof window === 'undefined') return
    
    fetch('/api/auth/session')
      .then((r) => r.json())
      .then((session) => {
        if (!session?.user && pathname !== '/admin/login') {
          router.push('/admin/login')
        }
      })
  }, [pathname, router])

  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: '#000000' }}>
      <AdminSidebar />
      <main style={{ flex: 1, marginLeft: '260px', minHeight: '100vh', background: '#000000', color: '#ffffff' }}>
        {children}
      </main>
    </div>
  )
}
