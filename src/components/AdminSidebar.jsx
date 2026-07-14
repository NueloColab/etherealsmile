'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'

const menuItems = [
  { label: 'Dashboard', href: '/admin' },
  { label: 'Enquiries', href: '/admin/enquiries' },
  { label: 'Bookings', href: '/admin/bookings' },
  { label: 'CMS Editor', href: '/admin/cms' },
  { label: 'Services', href: '/admin/services' },
  { label: 'Journal', href: '/admin/blog' },
  { label: 'Gallery', href: '/admin/gallery' },
  { label: 'Invoices', href: '/admin/invoices' },
]

export default function AdminSidebar() {
  const pathname = usePathname()

  return (
    <aside className="fixed left-0 top-0 h-screen w-[260px] bg-[#0a0a0a] border-r border-pink-500/15 z-50 flex flex-col">
      {/* Logo */}
      <div className="px-6 pt-8 pb-6">
        <Link href="/admin">
          <img
            src="/ethereal-logo.jpg"
            alt="Ethereal Smile"
            className="h-24 w-auto rounded-lg"
          />
        </Link>
        <p className="text-[0.65rem] text-white/30 tracking-[0.15em] uppercase mt-2">
          Admin Portal
        </p>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-3">
        {menuItems.map((item) => {
          const isActive = pathname === item.href || pathname?.startsWith(item.href + '/')
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`
                flex items-center gap-3 px-4 py-3 rounded-lg text-[0.8rem] font-medium tracking-wide
                transition-all duration-200 mb-1
                ${isActive
                  ? 'text-pink-500 bg-pink-500/10 border border-pink-500/20'
                  : 'text-white/60 hover:text-white/85 hover:bg-white/[0.04] border border-transparent'
                }
              `}
            >
              {item.label}
            </Link>
          )
        })}
      </nav>

      {/* Bottom */}
      <div className="p-6 border-t border-white/5">
        <Link
          href="/"
          className="flex items-center gap-2 text-[0.75rem] text-white/40 hover:text-pink-500 transition-colors"
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"
            strokeLinecap="round" strokeLinejoin="round"
          >
            <path d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
          </svg>
          Back to Site
        </Link>
      </div>
    </aside>
  )
}
