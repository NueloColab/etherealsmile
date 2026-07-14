'use client'

import { useState } from 'react'
import { useCmsContent } from '../../../../lib/useCmsContent'
import Link from 'next/link'

export default function ServicesEditor() {
  const { content, loading, saving, save } = useCmsContent('services')
  const [form, setForm] = useState(null)

  if (loading) return <p style={{ padding: '2rem', color: 'rgba(255,255,255,0.4)' }}>Loading...</p>
  if (!content) return <p style={{ padding: '2rem', color: 'rgba(255,255,255,0.4)' }}>No content found.</p>

  const data = form || content
  const services = data.services || []

  function updateService(index, field, value) {
    const updated = [...services]
    updated[index] = { ...updated[index], [field]: value }
    setForm({ ...data, services: updated })
  }

  function addService() {
    setForm({
      ...data,
      services: [...services, { name: '', description: '', price: '', duration: '', active: true, sortOrder: services.length + 1 }],
    })
  }

  function removeService(index) {
    const updated = services.filter((_, i) => i !== index)
    setForm({ ...data, services: updated })
  }

  return (
    <div style={{ padding: '2.5rem 2rem', maxWidth: '900px' }}>
      <div style={{ marginBottom: '2rem' }}>
        <Link href="/admin/cms" style={{ fontSize: '0.75rem', color: '#e94480', textDecoration: 'none', letterSpacing: '0.1em', textTransform: 'uppercase' }}>← Back to CMS</Link>
      </div>

      <h1 style={{ fontFamily: "'Pirata One', 'Playfair Display', cursive", fontSize: '1.8rem', color: '#e94480', letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: '2rem' }}>Services Editor</h1>

      <Input label="Section Heading" value={data.heading || ''} onChange={(v) => setForm({ ...data, heading: v })} />

      <div style={{ marginTop: '2rem' }}>
        <h3 style={{ fontFamily: "'Pirata One', 'Playfair Display', cursive", fontSize: '1.1rem', color: '#e94480', marginBottom: '1rem' }}>Services List</h3>

        {services.map((service, i) => (
          <div
            key={i}
            style={{
              background: 'rgba(255,255,255,0.02)',
              border: '1px solid rgba(255,255,255,0.06)',
              borderRadius: '12px',
              padding: '1.5rem',
              marginBottom: '1rem',
            }}
          >
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
              <Input label="Name" value={service.name || ''} onChange={(v) => updateService(i, 'name', v)} />
              <Input label="Price" value={service.price || ''} onChange={(v) => updateService(i, 'price', v)} />
            </div>
            <div style={{ marginTop: '1rem' }}>
              <Input label="Duration" value={service.duration || ''} onChange={(v) => updateService(i, 'duration', v)} />
            </div>
            <div style={{ marginTop: '1rem' }}>
              <label style={labelStyle}>Description</label>
              <textarea
                value={service.description || ''}
                onChange={(e) => updateService(i, 'description', e.target.value)}
                rows={2}
                style={{ ...inputStyle, resize: 'vertical' }}
              />
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginTop: '1rem' }}>
              <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'rgba(255,255,255,0.6)', fontSize: '0.85rem', cursor: 'pointer' }}>
                <input
                  type="checkbox"
                  checked={service.active}
                  onChange={(e) => updateService(i, 'active', e.target.checked)}
                />
                Active
              </label>
              <button
                onClick={() => removeService(i)}
                style={{
                  marginLeft: 'auto',
                  padding: '0.5rem 1rem',
                  background: 'rgba(244,67,54,0.15)',
                  color: '#e57373',
                  border: '1px solid rgba(244,67,54,0.3)',
                  borderRadius: '6px',
                  fontSize: '0.75rem',
                  cursor: 'pointer',
                }}
              >
                Remove
              </button>
            </div>
          </div>
        ))}

        <button
          onClick={addService}
          style={{
            width: '100%',
            padding: '1rem',
            background: 'rgba(233,68,128,0.1)',
            color: '#e94480',
            border: '1px dashed rgba(233,68,128,0.3)',
            borderRadius: '12px',
            fontSize: '0.85rem',
            cursor: 'pointer',
            marginTop: '1rem',
          }}
        >
          + Add Service
        </button>
      </div>

      <SaveButtons saving={saving} form={form} data={data} onSave={save} onReset={() => setForm(null)} />
    </div>
  )
}

function Input({ label, value, onChange }) {
  return (
    <div>
      <label style={labelStyle}>{label}</label>
      <input type="text" value={value} onChange={(e) => onChange(e.target.value)} style={inputStyle} />
    </div>
  )
}

function SaveButtons({ saving, form, data, onSave, onReset }) {
  return (
    <div style={{ display: 'flex', gap: '1rem', marginTop: '2rem' }}>
      <button onClick={() => onSave(form || data)} disabled={saving} style={saveButtonStyle}>{saving ? 'Saving...' : 'Save Changes'}</button>
      {form && <button onClick={onReset} style={resetButtonStyle}>Reset</button>}
    </div>
  )
}

const labelStyle = { display: 'block', fontSize: '0.7rem', letterSpacing: '0.12em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.5)', marginBottom: '0.5rem' }
const inputStyle = { width: '100%', padding: '0.85rem 1rem', background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px', color: '#ffffff', fontSize: '0.85rem', outline: 'none', fontFamily: "'Inter', sans-serif" }
const saveButtonStyle = { padding: '0.85rem 2rem', background: '#e94480', color: '#ffffff', border: 'none', borderRadius: '50px', fontSize: '0.75rem', fontWeight: 500, letterSpacing: '0.18em', textTransform: 'uppercase', cursor: 'pointer' }
const resetButtonStyle = { padding: '0.85rem 2rem', background: 'transparent', color: 'rgba(255,255,255,0.6)', border: '1px solid rgba(255,255,255,0.2)', borderRadius: '50px', fontSize: '0.75rem', fontWeight: 500, letterSpacing: '0.18em', textTransform: 'uppercase', cursor: 'pointer' }
