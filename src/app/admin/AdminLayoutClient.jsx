'use client'

import { usePathname } from 'next/navigation'
import AdminSidebar from '../../components/AdminSidebar'

export default function AdminLayoutClient({ children }) {
  const pathname = usePathname()
  const isLogin = pathname === '/admin/login'

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
