'use client'

import { useState, useEffect } from 'react'
import { useCmsContent } from '../../../../lib/useCmsContent'
import CloudinaryUpload from '../../../../components/CloudinaryUpload'
import Link from 'next/link'

export default function GalleryEditor() {
  const { content, loading, saving, save } = useCmsContent('gallery')
  const [form, setForm] = useState(null)
  const [galleryItems, setGalleryItems] = useState([])
  const [loadingItems, setLoadingItems] = useState(true)
  const [newItem, setNewItem] = useState({ imageUrl: '', caption: '', order: 0 })

  useEffect(() => {
    fetch('/api/gallery')
      .then(r => r.json())
      .then(data => { setGalleryItems(data); setLoadingItems(false) })
      .catch(() => setLoadingItems(false))
  }, [])

  async function deleteItem(id) {
    if (!confirm('Delete this gallery item?')) return
    await fetch(`/api/gallery/${id}`, { method: 'DELETE' })
    setGalleryItems(prev => prev.filter(i => i.id !== id))
  }

  async function addItem() {
    if (!newItem.imageUrl) return
    const res = await fetch('/api/gallery', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(newItem),
    })
    const created = await res.json()
    setGalleryItems(prev => [...prev, created])
    setNewItem({ imageUrl: '', caption: '', order: 0 })
  }

  async function updateItem(id, updates) {
    await fetch(`/api/gallery/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(updates),
    })
    setGalleryItems(prev => prev.map(i => i.id === id ? { ...i, ...updates } : i))
  }

  if (loading) return <p style={{ padding: '2rem', color: 'rgba(255,255,255,0.4)' }}>Loading...</p>
  if (!content) return <p style={{ padding: '2rem', color: 'rgba(255,255,255,0.4)' }}>No content found.</p>

  const data = form || content

  return (
    <div style={{ padding: '2.5rem 2rem', maxWidth: '900px' }}>
      <div style={{ marginBottom: '2rem' }}>
        <Link href="/admin/cms" style={{ fontSize: '0.75rem', color: '#e94480', textDecoration: 'none', letterSpacing: '0.1em', textTransform: 'uppercase' }}>
          &larr; Back to CMS
        </Link>
      </div>

      <h1 style={{ fontFamily: "'Pirata One', 'Playfair Display', cursive", fontSize: '1.8rem', color: '#e94480', letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: '2rem' }}>
        Gallery Editor
      </h1>

      {/* Section text fields */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', marginBottom: '3rem' }}>
        <Input label="Heading" value={data.heading || ''} onChange={(v) => setForm({ ...data, heading: v })} />
        <Input label="Subtitle" value={data.subtitle || ''} onChange={(v) => setForm({ ...data, subtitle: v })} />

        <div style={{ display: 'flex', gap: '1rem', marginTop: '0.5rem' }}>
          <button onClick={() => save(form || data)} disabled={saving} style={saveButtonStyle}>
            {saving ? 'Saving...' : 'Save Text'}
          </button>
          {form && <button onClick={() => setForm(null)} style={resetButtonStyle}>Reset</button>}
        </div>
      </div>

      {/* Gallery items */}
      <div style={{ borderTop: '1px solid rgba(255,255,255,0.06)', paddingTop: '2rem' }}>
        <h2 style={{ fontFamily: "'Pirata One', 'Playfair Display', cursive", fontSize: '1.3rem', color: '#e94480', letterSpacing: '0.05em', marginBottom: '1.5rem' }}>
          Gallery Images
        </h2>

        {/* Add new item */}
        <div style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '12px', padding: '1.5rem', marginBottom: '1.5rem' }}>
          <h3 style={{ fontSize: '0.75rem', letterSpacing: '0.12em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.5)', marginBottom: '1rem' }}>Add New Image</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <CloudinaryUpload
              label="Image"
              currentUrl={newItem.imageUrl}
              onUpload={(url) => setNewItem({ ...newItem, imageUrl: url })}
            />
            <Input label="Caption (optional)" value={newItem.caption} onChange={(v) => setNewItem({ ...newItem, caption: v })} />
            <Input label="Sort Order" value={String(newItem.order)} onChange={(v) => setNewItem({ ...newItem, order: parseInt(v) || 0 })} />
            <button
              onClick={addItem}
              disabled={!newItem.imageUrl}
              style={{
                ...saveButtonStyle,
                opacity: newItem.imageUrl ? 1 : 0.4,
                cursor: newItem.imageUrl ? 'pointer' : 'not-allowed',
              }}
            >
              Add to Gallery
            </button>
          </div>
        </div>

        {/* Existing items */}
        {loadingItems ? (
          <p style={{ color: 'rgba(255,255,255,0.4)' }}>Loading images...</p>
        ) : galleryItems.length === 0 ? (
          <p style={{ color: 'rgba(255,255,255,0.4)', textAlign: 'center', padding: '2rem' }}>No gallery images yet. Add your first image above.</p>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '1rem' }}>
            {galleryItems.sort((a, b) => (a.sortOrder || 0) - (b.sortOrder || 0)).map(item => (
              <div key={item.id} style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '12px', overflow: 'hidden' }}>
                <div style={{ aspectRatio: '1', background: 'rgba(255,255,255,0.03)' }}>
                  {item.url ? (
                    <img src={item.url} alt={item.caption || ''} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                  ) : (
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%', color: 'rgba(255,255,255,0.2)', fontSize: '0.8rem' }}>No image</div>
                  )}
                </div>
                <div style={{ padding: '0.75rem' }}>
                  {item.caption && <p style={{ fontSize: '0.75rem', color: 'rgba(255,255,255,0.7)', margin: '0 0 0.5rem' }}>{item.caption}</p>}
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span style={{ fontSize: '0.65rem', color: 'rgba(255,255,255,0.3)' }}>Order: {item.sortOrder || 0}</span>
                    <button
                      onClick={() => deleteItem(item.id)}
                      style={{ background: 'none', border: '1px solid rgba(239,68,68,0.3)', color: '#f87171', borderRadius: '4px', padding: '0.25rem 0.5rem', fontSize: '0.65rem', cursor: 'pointer' }}
                    >
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
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

const labelStyle = { display: 'block', fontSize: '0.7rem', letterSpacing: '0.12em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.5)', marginBottom: '0.5rem' }
const inputStyle = { width: '100%', padding: '0.85rem 1rem', background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px', color: '#ffffff', fontSize: '0.85rem', outline: 'none', fontFamily: "'Inter', sans-serif" }
const saveButtonStyle = { padding: '0.85rem 2rem', background: '#e94480', color: '#ffffff', border: 'none', borderRadius: '50px', fontSize: '0.75rem', fontWeight: 500, letterSpacing: '0.18em', textTransform: 'uppercase', cursor: 'pointer' }
const resetButtonStyle = { padding: '0.85rem 2rem', background: 'transparent', color: 'rgba(255,255,255,0.6)', border: '1px solid rgba(255,255,255,0.2)', borderRadius: '50px', fontSize: '0.75rem', fontWeight: 500, letterSpacing: '0.18em', textTransform: 'uppercase', cursor: 'pointer' }