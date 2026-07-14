'use client'

import { useEffect } from 'react'
import { useRouter, usePathname } from 'next/navigation'
import AdminSidebar from '../../components/AdminSidebar'

export default function AdminLayoutClient({ children }) {
  const router = useRouter()
  const pathname = usePathname()

  useEffect(() => {
    fetch('/api/auth/session')
      .then((r) => r.json())
      .then((session) => {
        if (!session?.user && pathname !== '/admin/login') {
          router.push('/admin/login')
        }
      })
  }, [pathname, router])

  const isLogin = pathname === '/admin/login'

  if (isLogin) {
    return (
      <div className="min-h-screen bg-black text-white">
        {children}
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-black text-white flex">
      <AdminSidebar />
      <main className="flex-1 ml-[260px] min-h-screen">
        {children}
      </main>
    </div>
  )
}
