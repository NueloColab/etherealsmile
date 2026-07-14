'use client'

import { useState } from 'react'
import { useCmsContent } from '../../../../lib/useCmsContent'
import CloudinaryUpload from '../../../../components/CloudinaryUpload'
import Link from 'next/link'

export default function HeroEditor() {
  const { content, loading, saving, saved, save } = useCmsContent('home')
  const [form, setForm] = useState(null)

  if (loading) return <p style={{ padding: '2rem', color: 'rgba(255,255,255,0.4)' }}>Loading...</p>
  if (!content) return <p style={{ padding: '2rem', color: 'rgba(255,255,255,0.4)' }}>No content found.</p>

  const data = form || content

  return (
    <div style={{ padding: '2.5rem 2rem', maxWidth: '800px' }}>
      <div style={{ marginBottom: '2rem' }}>
        <Link
          href="/admin/cms"
          style={{
            fontSize: '0.75rem',
            color: '#e94480',
            textDecoration: 'none',
            letterSpacing: '0.1em',
            textTransform: 'uppercase',
          }}
        >
          ← Back to CMS
        </Link>
      </div>

      <h1
        style={{
          fontFamily: "'Pirata One', 'Playfair Display', cursive",
          fontSize: '1.8rem',
          color: '#e94480',
          letterSpacing: '0.08em',
          textTransform: 'uppercase',
          marginBottom: '2rem',
        }}
      >
        Hero Editor
      </h1>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
        <div>
          <label
            style={{
              display: 'block',
              fontSize: '0.7rem',
              letterSpacing: '0.12em',
              textTransform: 'uppercase',
              color: 'rgba(255,255,255,0.5)',
              marginBottom: '0.5rem',
            }}
          >
            Hero Heading
          </label>
          <input
            type="text"
            value={data.heroHeading || ''}
            onChange={(e) => setForm({ ...data, heroHeading: e.target.value })}
            style={{
              width: '100%',
              padding: '0.85rem 1rem',
              background: 'rgba(255,255,255,0.04)',
              border: '1px solid rgba(255,255,255,0.1)',
              borderRadius: '8px',
              color: '#ffffff',
              fontSize: '0.85rem',
              outline: 'none',
            }}
          />
        </div>

        <div>
          <label
            style={{
              display: 'block',
              fontSize: '0.7rem',
              letterSpacing: '0.12em',
              textTransform: 'uppercase',
              color: 'rgba(255,255,255,0.5)',
              marginBottom: '0.5rem',
            }}
          >
            Hero Subtitle
          </label>
          <input
            type="text"
            value={data.heroSubtitle || ''}
            onChange={(e) => setForm({ ...data, heroSubtitle: e.target.value })}
            style={{
              width: '100%',
              padding: '0.85rem 1rem',
              background: 'rgba(255,255,255,0.04)',
              border: '1px solid rgba(255,255,255,0.1)',
              borderRadius: '8px',
              color: '#ffffff',
              fontSize: '0.85rem',
              outline: 'none',
            }}
          />
        </div>

        <div>
          <label
            style={{
              display: 'block',
              fontSize: '0.7rem',
              letterSpacing: '0.12em',
              textTransform: 'uppercase',
              color: 'rgba(255,255,255,0.5)',
              marginBottom: '0.5rem',
            }}
          >
            CTA Button Text
          </label>
          <input
            type="text"
            value={data.ctaText || ''}
            onChange={(e) => setForm({ ...data, ctaText: e.target.value })}
            style={{
              width: '100%',
              padding: '0.85rem 1rem',
              background: 'rgba(255,255,255,0.04)',
              border: '1px solid rgba(255,255,255,0.1)',
              borderRadius: '8px',
              color: '#ffffff',
              fontSize: '0.85rem',
              outline: 'none',
            }}
          />
        </div>

        <CloudinaryUpload
          label="Background Image"
          currentUrl={data.backgroundImage}
          onUpload={(url) => setForm({ ...data, backgroundImage: url })}
        />

        <div style={{ display: 'flex', gap: '1rem', marginTop: '1rem' }}>
          <button
            onClick={() => save(form || data)}
            disabled={saving}
            style={{
              padding: '0.85rem 2rem',
              background: '#e94480',
              color: '#ffffff',
              border: 'none',
              borderRadius: '50px',
              fontSize: '0.75rem',
              fontWeight: 500,
              letterSpacing: '0.18em',
              textTransform: 'uppercase',
              cursor: 'pointer',
              opacity: saving ? 0.7 : 1,
            }}
          >
            {saving ? 'Saving...' : saved ? 'Saved!' : 'Save Changes'}
          </button>

          {form && (
            <button
              onClick={() => setForm(null)}
              style={{
                padding: '0.85rem 2rem',
                background: 'transparent',
                color: 'rgba(255,255,255,0.6)',
                border: '1px solid rgba(255,255,255,0.2)',
                borderRadius: '50px',
                fontSize: '0.75rem',
                fontWeight: 500,
                letterSpacing: '0.18em',
                textTransform: 'uppercase',
                cursor: 'pointer',
              }}
            >
              Reset
            </button>
          )}
        </div>
      </div>
    </div>
  )
}
