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

function EyeIcon({ visible }) {
  if (visible) {
    return (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ color: '#e94480' }}>
        <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
        <circle cx="12" cy="12" r="3"/>
      </svg>
    )
  }
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ color: 'rgba(255,255,255,0.3)' }}>
      <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"/>
      <line x1="1" y1="1" x2="23" y2="23"/>
    </svg>
  )
}

function SectionCard({ section }) {
  const { content, save } = useCmsContent(section.key)
  const isVisible = content?.isVisible !== false

  const toggleVisibility = async () => {
    const newContent = { ...(content || {}), isVisible: !isVisible }
    await save(newContent)
  }

  return (
    <div
      style={{
        background: isVisible ? 'rgba(255,255,255,0.03)' : 'rgba(255,255,255,0.01)',
        border: isVisible ? '1px solid rgba(255,255,255,0.06)' : '1px solid rgba(255,255,255,0.03)',
        borderRadius: '14px',
        padding: '1.75rem 1.5rem',
        transition: 'all 0.3s ease',
        position: 'relative',
        opacity: isVisible ? 1 : 0.6,
      }}
    >
      {/* Visibility toggle */}
      <button
        onClick={toggleVisibility}
        style={{
          position: 'absolute',
          top: '1rem',
          right: '1rem',
          background: 'transparent',
          border: 'none',
          cursor: 'pointer',
          padding: '0.25rem',
          transition: 'transform 0.2s',
        }}
        onMouseEnter={(e) => (e.currentTarget.style.transform = 'scale(1.15)')}
        onMouseLeave={(e) => (e.currentTarget.style.transform = 'scale(1)')}
        title={isVisible ? 'Hide section' : 'Show section'}
      >
        <EyeIcon visible={isVisible} />
      </button>

      <Link href={section.path} style={{ textDecoration: 'none', display: 'block' }}>
        <p
          style={{
            fontFamily: "'Pirata One', 'Playfair Display', cursive",
            fontSize: '1.1rem',
            color: isVisible ? '#e94480' : 'rgba(255,255,255,0.3)',
            marginBottom: '0.5rem',
            letterSpacing: '0.05em',
            paddingRight: '2rem',
          }}
        >
          {section.label}
        </p>
        <p style={{ fontSize: '0.75rem', color: 'rgba(255,255,255,0.4)', textTransform: 'uppercase', letterSpacing: '0.1em' }}>
          Edit Content
        </p>
        <p
          style={{
            fontSize: '0.65rem',
            color: isVisible ? 'rgba(233,68,128,0.5)' : 'rgba(255,255,255,0.2)',
            marginTop: '0.5rem',
            textTransform: 'uppercase',
            letterSpacing: '0.1em',
          }}
        >
          {isVisible ? 'Visible on site' : 'Hidden'}
        </p>
      </Link>
    </div>
  )
}

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
          Manage all website content and visibility from one place
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
          <SectionCard key={section.key} section={section} />
        ))}
      </div>
    </div>
  )
}
