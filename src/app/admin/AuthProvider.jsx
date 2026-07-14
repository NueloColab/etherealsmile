'use client'

import { SessionProvider } from 'next-auth/react'

export default function AdminAuthProvider({ children }) {
  return (
    <SessionProvider>
      {children}
    </SessionProvider>
  )
}
