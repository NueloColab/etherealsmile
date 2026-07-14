import { getServerSession } from 'next-auth/next'
import { redirect } from 'next/navigation'
import { authOptions } from '../api/auth/[...nextauth]/route'

export default async function AdminLayout({ children }) {
  const session = await getServerSession(authOptions)

  if (!session) {
    redirect('/admin/login')
  }

  return (
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
  )
}
