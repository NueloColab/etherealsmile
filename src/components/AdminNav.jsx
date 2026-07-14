'use client'

import Link from 'next/link'
import { signOut } from 'next-auth/react'
import { usePathname } from 'next/navigation'

const links = [
  { href: '/admin', label: 'Dashboard' },
  { href: '/admin/enquiries', label: 'Enquiries' },
  { href: '/admin/services', label: 'Services' },
  { href: '/admin/blog', label: 'Blog' },
  { href: '/admin/gallery', label: 'Gallery' },
]

export default function AdminNav() {
  const pathname = usePathname()

  return (
    <nav
      style={{
        display: 'flex',
        gap: '0.5rem',
        flexWrap: 'wrap',
        alignItems: 'center',
        marginBottom: '2rem',
        paddingBottom: '1rem',
        borderBottom: '1px solid rgba(255,255,255,0.06)',
      }}
    >
      {links.map((link) => {
        const isActive = pathname === link.href
        return (
          <Link
            key={link.href}
            href={link.href}
            style={{
              padding: '0.5rem 0.9rem',
              borderRadius: '6px',
              fontSize: '0.7rem',
              letterSpacing: '0.1em',
              textTransform: 'uppercase',
              textDecoration: 'none',
              color: isActive ? '#000' : 'rgba(255,255,255,0.6)',
              background: isActive ? '#e94480' : 'transparent',
              transition: 'all 0.2s ease',
            }}
          >
            {link.label}
          </Link>
        )
      })}
      <button
        onClick={() => signOut({ callbackUrl: '/admin/login' })}
        style={{
          marginLeft: 'auto',
          padding: '0.5rem 0.9rem',
          borderRadius: '6px',
          fontSize: '0.7rem',
          letterSpacing: '0.1em',
          textTransform: 'uppercase',
          background: 'transparent',
          color: 'rgba(255,255,255,0.4)',
          border: '1px solid rgba(255,255,255,0.1)',
          cursor: 'pointer',
          transition: 'all 0.2s ease',
        }}
        onMouseEnter={(e) => (e.target.style.color = '#e57373')}
        onMouseLeave={(e) => (e.target.style.color = 'rgba(255,255,255,0.4)')}
      >
        Sign Out
      </button>
    </nav>
  )
}
