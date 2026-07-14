'use client'

import Link from 'next/link'
import { useCmsContent } from '../../../lib/useCmsContent'

const sections = [
  { key: 'home', label: 'Hero', path: '/admin/cms/home' },
  { key: 'about', label: 'About', path: '/admin/cms/home-about' },
  { key: 'showreel', label: 'Showreel', path: '/admin/cms/home-showreel' },
  { key: 'hattie', label: "Who's Hattie", path: '/admin/cms/home-hattie' },
  { key: 'services', label: 'Services', path: '/admin/cms/home-services' },
  { key: 'book', label: 'Book', path: '/admin/cms/home-book' },
  { key: 'gallery', label: 'Gallery', path: '/admin/cms/home-gallery' },
  { key: 'journal', label: 'Journal', path: '/admin/cms/home-journal' },
  { key: 'contact', label: 'Contact', path: '/admin/cms/home-contact' },
  { key: 'review', label: 'Review', path: '/admin/cms/home-review' },
]

export default function CmsOverview() {
  return (
    <div style={{ padding: '2.5rem 2rem', maxWidth: '1100px' }}>
      <div style={{ marginBottom: '2.5rem' }}>
        <h1
          style={{
            fontFamily: "'Pirata One', 'Playfair Display', cursive",
            fontSize: 'clamp(1.5rem, 3vw, 2.2rem)',
            color: '#e94480',
            letterSpacing: '0.08em',
            textTransform: 'uppercase',
            marginBottom: '0.25rem',
          }}
        >
          CMS Editor
        </h1>
        <p style={{ fontSize: '0.85rem', color: 'rgba(255,255,255,0.4)' }}>
          Manage all website content from one place
        </p>
      </div>

      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))',
          gap: '1.25rem',
        }}
      >
        {sections.map((section) => (
          <Link
            key={section.key}
            href={section.path}
            style={{ textDecoration: 'none' }}
          >
            <div
              style={{
                background: 'rgba(255,255,255,0.03)',
                border: '1px solid rgba(255,255,255,0.06)',
                borderRadius: '14px',
                padding: '1.75rem 1.5rem',
                transition: 'all 0.3s ease',
                cursor: 'pointer',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.borderColor = 'rgba(233, 68, 128, 0.25)'
                e.currentTarget.style.transform = 'translateY(-3px)'
                e.currentTarget.style.boxShadow = '0 8px 24px rgba(233, 68, 128, 0.08)'
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.borderColor = 'rgba(255,255,255,0.06)'
                e.currentTarget.style.transform = 'translateY(0)'
                e.currentTarget.style.boxShadow = 'none'
              }}
            >
              <p
                style={{
                  fontFamily: "'Pirata One', 'Playfair Display', cursive",
                  fontSize: '1.1rem',
                  color: '#e94480',
                  marginBottom: '0.5rem',
                  letterSpacing: '0.05em',
                }}
              >
                {section.label}
              </p>
              <p style={{ fontSize: '0.75rem', color: 'rgba(255,255,255,0.4)', textTransform: 'uppercase', letterSpacing: '0.1em' }}>
                Edit Content
              </p>
            </div>
          </Link>
        ))}
      </div>
    </div>
  )
}
