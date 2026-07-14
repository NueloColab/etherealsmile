'use client'

import { useState } from 'react'
import { useCmsContent } from '../../../../lib/useCmsContent'
import CloudinaryUpload from '../../../../components/CloudinaryUpload'
import Link from 'next/link'

export default function AboutEditor() {
  const { content, loading, saving, save } = useCmsContent('about')
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
        About Editor
      </h1>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
        <Input
          label="Heading"
          value={data.heading || ''}
          onChange={(v) => setForm({ ...data, heading: v })}
        />

        <Textarea
          label="Body Text"
          value={data.bodyText || ''}
          onChange={(v) => setForm({ ...data, bodyText: v })}
        />

        <CloudinaryUpload
          label="Image"
          currentUrl={data.image}
          onUpload={(url) => setForm({ ...data, image: url })}
        />

        <SaveButtons saving={saving} form={form} data={data} onSave={save} onReset={() => setForm(null)} />
      </div>
    </div>
  )
}

function Input({ label, value, onChange, placeholder, type = 'text' }) {
  return (
    <div>
      <label style={labelStyle}>{label}</label>
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        style={inputStyle}
      />
    </div>
  )
}

function Textarea({ label, value, onChange }) {
  return (
    <div>
      <label style={labelStyle}>{label}</label>
      <textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        rows={6}
        style={{ ...inputStyle, resize: 'vertical' }}
      />
    </div>
  )
}

function SaveButtons({ saving, form, data, onSave, onReset }) {
  return (
    <div style={{ display: 'flex', gap: '1rem', marginTop: '1rem' }}>
      <button
        onClick={() => onSave(form || data)}
        disabled={saving}
        style={saveButtonStyle}
      >
        {saving ? 'Saving...' : 'Save Changes'}
      </button>

      {form && (
        <button onClick={onReset} style={resetButtonStyle}>
          Reset
        </button>
      )}
    </div>
  )
}

const labelStyle = {
  display: 'block',
  fontSize: '0.7rem',
  letterSpacing: '0.12em',
  textTransform: 'uppercase',
  color: 'rgba(255,255,255,0.5)',
  marginBottom: '0.5rem',
}

const inputStyle = {
  width: '100%',
  padding: '0.85rem 1rem',
  background: 'rgba(255,255,255,0.04)',
  border: '1px solid rgba(255,255,255,0.1)',
  borderRadius: '8px',
  color: '#ffffff',
  fontSize: '0.85rem',
  outline: 'none',
  fontFamily: "'Inter', sans-serif",
}

const saveButtonStyle = {
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
}

const resetButtonStyle = {
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
}
