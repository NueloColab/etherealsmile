import { getServerSession } from 'next-auth/next'
import { authOptions } from '../api/auth/[...nextauth]/route'
import AuthProvider from './AuthProvider'

export default async function AdminLayout({ children }) {
  const session = await getServerSession(authOptions)

  return (
    <AuthProvider>
      <div
        style={{
          minHeight: '100vh',
          position: 'relative',
          zIndex: 1,
          paddingTop: '56px',
        }}
      >
        {children}
      </div>
    </AuthProvider>
  )
}
