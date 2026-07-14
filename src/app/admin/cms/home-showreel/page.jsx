'use client'

import { useState } from 'react'
import { useCmsContent } from '../../../../lib/useCmsContent'
import Link from 'next/link'
import CloudinaryUpload from '../../../../components/CloudinaryUpload'

export default function ShowreelCmsPage() {
  const { content, loading, saving, save, error } = useCmsContent('showreel')
  const [form, setForm] = useState(null)

  if (loading) {
    return (
      <div style={{ padding: '2.5rem 2rem', color: 'rgba(255,255,255,0.5)', textAlign: 'center' }}>
        Loading...
      </div>
    )
  }

  const current = form ?? content ?? {
    heading: 'The Art of the Sparkle',
    type: 'video',
    videoUrl: '/showreel.mp4',
    posterImage: '/hattie-working.jpg',
    fallbackImage: '/hattie-working.jpg',
    overlayText: 'The Art of the Sparkle',
  }

  const update = (field, value) => {
    setForm({ ...current, [field]: value })
  }

  const handleSave = async () => {
    await save(current)
    setForm(null)
  }

  const hasChanges = JSON.stringify(form) !== JSON.stringify(content)

  return (
    <div style={{ padding: '2.5rem 2rem', maxWidth: '800px' }}>
      <div style={{ marginBottom: '2rem' }}>
        <Link
          href="/admin/cms"
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '0.4rem',
            fontSize: '0.75rem',
            color: 'rgba(255,255,255,0.4)',
            textDecoration: 'none',
            marginBottom: '1rem',
            transition: 'color 0.3s',
          }}
          onMouseEnter={(e) => (e.target.style.color = '#e94480')}
          onMouseLeave={(e) => (e.target.style.color = 'rgba(255,255,255,0.4)')}
        >
          ← Back to CMS
        </Link>
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
          Showreel
        </h1>
        <p style={{ fontSize: '0.85rem', color: 'rgba(255,255,255,0.4)' }}>
          Choose video or image for the showreel section
        </p>
      </div>

      {error && (
        <div
          style={{
            background: 'rgba(200,50,50,0.1)',
            border: '1px solid rgba(200,50,50,0.3)',
            color: '#c94444',
            padding: '0.75rem 1rem',
            borderRadius: '8px',
            marginBottom: '1.5rem',
            fontSize: '0.85rem',
          }}
        >
          {error}
        </div>
      )}

      <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
        {/* Type toggle */}
        <div>
          <label
            style={{
              display: 'block',
              fontSize: '0.65rem',
              letterSpacing: '0.15em',
              textTransform: 'uppercase',
              color: 'rgba(255,255,255,0.5)',
              marginBottom: '0.5rem',
            }}
          >
            Section Type
          </label>
          <div style={{ display: 'flex', gap: '0.75rem' }}>
            {['video', 'image'].map((t) => (
              <button
                key={t}
                onClick={() => update('type', t)}
                style={{
                  padding: '0.6rem 1.5rem',
                  borderRadius: '8px',
                  border: current.type === t ? '1.5px solid #e94480' : '1.5px solid rgba(255,255,255,0.15)',
                  background: current.type === t ? 'rgba(233,68,128,0.1)' : 'transparent',
                  color: current.type === t ? '#e94480' : 'rgba(255,255,255,0.5)',
                  fontFamily: "'Inter', sans-serif",
                  fontSize: '0.8rem',
                  fontWeight: 600,
                  letterSpacing: '0.1em',
                  textTransform: 'uppercase',
                  cursor: 'pointer',
                  transition: 'all 0.3s',
                }}
              >
                {t}
              </button>
            ))}
          </div>
        </div>

        {/* Overlay text */}
        <div>
          <label
            style={{
              display: 'block',
              fontSize: '0.65rem',
              letterSpacing: '0.15em',
              textTransform: 'uppercase',
              color: 'rgba(255,255,255,0.5)',
              marginBottom: '0.5rem',
            }}
          >
            Overlay Text
          </label>
          <input
            type="text"
            value={current.overlayText || ''}
            onChange={(e) => update('overlayText', e.target.value)}
            style={{
              width: '100%',
              padding: '0.75rem 1rem',
              background: 'rgba(255,255,255,0.03)',
              border: '1px solid rgba(255,255,255,0.1)',
              borderRadius: '8px',
              color: '#fff',
              fontFamily: "'Inter', sans-serif",
              fontSize: '0.85rem',
              outline: 'none',
              transition: 'border-color 0.3s',
            }}
            onFocus={(e) => (e.target.style.borderColor = 'rgba(233,68,128,0.5)')}
            onBlur={(e) => (e.target.style.borderColor = 'rgba(255,255,255,0.1)')}
          />
        </div>

        {/* Video mode */}
        {current.type === 'video' && (
          <>
            <div>
              <label
                style={{
                  display: 'block',
                  fontSize: '0.65rem',
                  letterSpacing: '0.15em',
                  textTransform: 'uppercase',
                  color: 'rgba(255,255,255,0.5)',
                  marginBottom: '0.5rem',
                }}
              >
                Video URL
              </label>
              <input
                type="text"
                value={current.videoUrl || ''}
                onChange={(e) => update('videoUrl', e.target.value)}
                placeholder="/showreel.mp4 or https://..."
                style={{
                  width: '100%',
                  padding: '0.75rem 1rem',
                  background: 'rgba(255,255,255,0.03)',
                  border: '1px solid rgba(255,255,255,0.1)',
                  borderRadius: '8px',
                  color: '#fff',
                  fontFamily: "'Inter', sans-serif",
                  fontSize: '0.85rem',
                  outline: 'none',
                  transition: 'border-color 0.3s',
                }}
                onFocus={(e) => (e.target.style.borderColor = 'rgba(233,68,128,0.5)')}
                onBlur={(e) => (e.target.style.borderColor = 'rgba(255,255,255,0.1)')}
              />
              <p style={{ fontSize: '0.7rem', color: 'rgba(255,255,255,0.3)', marginTop: '0.4rem' }}>
                Enter a local path like /showreel.mp4 or a full URL
              </p>
            </div>

            <CloudinaryUpload
              label="Poster Image"
              currentUrl={current.posterImage || ''}
              onUpload={(url) => update('posterImage', url)}
            />
          </>
        )}

        {/* Image mode */}
        {current.type === 'image' && (
          <CloudinaryUpload
            label="Image"
            currentUrl={current.fallbackImage || ''}
            onUpload={(url) => update('fallbackImage', url)}
          />
        )}

        {/* Preview */}
        <div
          style={{
            borderRadius: '12px',
            overflow: 'hidden',
            border: '1px solid rgba(255,255,255,0.06)',
            marginTop: '1rem',
          }}
        >
          <div
            style={{
              padding: '0.75rem 1rem',
              background: 'rgba(255,255,255,0.02)',
              borderBottom: '1px solid rgba(255,255,255,0.06)',
              fontSize: '0.7rem',
              color: 'rgba(255,255,255,0.4)',
              letterSpacing: '0.1em',
              textTransform: 'uppercase',
            }}
          >
            Preview
          </div>
          <div style={{ position: 'relative', height: '200px', background: '#0a0a0a' }}>
            {current.type === 'video' && current.videoUrl ? (
              <video
                src={current.videoUrl}
                poster={current.posterImage || ''}
                muted
                loop
                playsInline
                preload="metadata"
                style={{
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  width: '100%',
                  height: '100%',
                  objectFit: 'cover',
                }}
              />
            ) : current.type === 'image' && current.fallbackImage ? (
              <img
                src={current.fallbackImage}
                alt="Showreel"
                style={{
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  width: '100%',
                  height: '100%',
                  objectFit: 'cover',
                }}
              />
            ) : (
              <div
                style={{
                  position: 'absolute',
                  inset: 0,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: 'rgba(255,255,255,0.3)',
                  fontSize: '0.85rem',
                }}
              >
                No media selected
              </div>
            )}
            <div
              style={{
                position: 'absolute',
                inset: 0,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                background: 'linear-gradient(to bottom, rgba(0,0,0,0.1), rgba(0,0,0,0.25))',
              }}
            >
              <p
                style={{
                  fontFamily: "'Pirata One', 'Playfair Display', cursive",
                  fontSize: '1.2rem',
                  color: '#e94480',
                  letterSpacing: '0.15em',
                  textTransform: 'uppercase',
                  textShadow: '0 0 30px rgba(233,68,128,0.4)',
                }}
              >
                {current.overlayText || 'The Art of the Sparkle'}
              </p>
            </div>
          </div>
        </div>

        {/* Save button */}
        <div style={{ display: 'flex', gap: '1rem', marginTop: '1rem' }}>
          <button
            onClick={handleSave}
            disabled={saving || !hasChanges}
            style={{
              padding: '0.75rem 2rem',
              borderRadius: '8px',
              border: '1.5px solid #e94480',
              background: 'rgba(233,68,128,0.15)',
              color: '#e94480',
              fontFamily: "'Inter', sans-serif",
              fontSize: '0.75rem',
              fontWeight: 600,
              letterSpacing: '0.15em',
              textTransform: 'uppercase',
              cursor: saving || !hasChanges ? 'not-allowed' : 'pointer',
              opacity: saving || !hasChanges ? 0.5 : 1,
              transition: 'all 0.3s',
            }}
          >
            {saving ? 'Saving...' : 'Save Changes'}
          </button>

          {form && (
            <button
              onClick={() => setForm(null)}
              style={{
                padding: '0.75rem 2rem',
                borderRadius: '8px',
                border: '1.5px solid rgba(255,255,255,0.15)',
                background: 'transparent',
                color: 'rgba(255,255,255,0.5)',
                fontFamily: "'Inter', sans-serif",
                fontSize: '0.75rem',
                fontWeight: 600,
                letterSpacing: '0.15em',
                textTransform: 'uppercase',
                cursor: 'pointer',
                transition: 'all 0.3s',
              }}
            >
              Cancel
            </button>
          )}
        </div>
      </div>
    </div>
  )
}
