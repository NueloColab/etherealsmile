import { getServerSession } from 'next-auth/next'
import { authOptions } from '../api/auth/[...nextauth]/route'
import AuthProvider from './AuthProvider'
import AdminLayoutClient from './AdminLayoutClient'

export default async function AdminLayout({ children }) {
  const session = await getServerSession(authOptions)

  return (
    <AuthProvider>
      <AdminLayoutClient>{children}</AdminLayoutClient>
    </AuthProvider>
  )
}
