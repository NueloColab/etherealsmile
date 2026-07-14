import NextAuth from 'next-auth'
import CredentialsProvider from 'next-auth/providers/credentials'
import { db } from '../../../../lib/db'
import { adminUsers } from '../../../../lib/schema'
import { eq } from 'drizzle-orm'
import bcrypt from 'bcryptjs'

export const authOptions = {
  providers: [
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) return null

        const rows = await db.select().from(adminUsers).where(eq(adminUsers.email, credentials.email))
        const user = rows[0]

        if (!user) return null

        const isValid = await bcrypt.compare(credentials.password, user.passwordHash)
        if (!isValid) return null

        return {
          id: String(user.id),
          email: user.email,
          name: user.name,
          role: user.role,
        }
      },
    }),
  ],
  session: {
    strategy: 'jwt',
    maxAge: 24 * 60 * 60,
  },
  pages: {
    signIn: '/admin/login',
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.role = user.role
      }
      return token
    },
    async session({ session, token }) {
      if (token && session.user) {
        session.user.role = token.role
      }
      return session
    },
  },
  secret: process.env.NEXTAUTH_SECRET || 'etherealsmile-secret-key-2026',
}

const handler = NextAuth(authOptions)

export { handler as GET, handler as POST }
