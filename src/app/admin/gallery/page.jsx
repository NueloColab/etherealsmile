'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import CloudinaryUpload from '../../../components/CloudinaryUpload'

export default function AdminGallery() {
  const [items, setItems] = useState([])
  const [newUrl, setNewUrl] = useState('')
  const [newCaption, setNewCaption] = useState('')
  const [loading, setLoading] = useState(false)
  const [saved, setSaved] = useState(false)
  const router = useRouter()

  useEffect(() => {
    fetch('/api/auth/session')
      .then((r) => r.json())
      .then((session) => {
        if (!session?.user) {
          router.push('/admin/login')
        }
      })
  }, [router])

  useEffect(() => {
    fetchItems()
  }, [])

  async function fetchItems() {
    const res = await fetch('/api/gallery')
    const data = await res.json()
    setItems(data)
  }

  async function handleAdd(e) {
    e.preventDefault()
    if (!newUrl) return
    setLoading(true)
    await fetch('/api/gallery', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ url: newUrl, caption: newCaption, type: 'image', sortOrder: items.length }),
    })
    setNewUrl('')
    setNewCaption('')
    setSaved(true)
    setTimeout(() => setSaved(false), 3000)
    setLoading(false)
    fetchItems()
  }

  async function handleDelete(id) {
    if (!confirm('Delete this image?')) return
    await fetch(`/api/gallery/${id}`, { method: 'DELETE' })
    fetchItems()
  }

  return (
    <div style={{ padding: '2.5rem 2rem', maxWidth: '1200px' }}>
      <div style={{ marginBottom: '2rem' }}>
        <h1 style={{ fontFamily: "'Pirata One', 'Playfair Display', cursive", fontSize: '1.8rem', color: '#e94480', letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: '0.25rem' }}>
          Gallery
        </h1>
        <p style={{ fontSize: '0.85rem', color: 'rgba(255,255,255,0.4)' }}>
          Manage gallery images
        </p>
      </div>

      {/* Add new image */}
      <div style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)', borderRadius: '14px', padding: '1.75rem', marginBottom: '2rem', maxWidth: '600px' }}>
        <h3 style={{ fontSize: '0.85rem', color: '#e94480', letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: '1.5rem', fontWeight: 600 }}>
          Add Image
        </h3>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          <CloudinaryUpload
            label="Image"
            currentUrl={newUrl}
            onUpload={(url) => setNewUrl(url)}
          />
          <div>
            <label style={{ display: 'block', fontSize: '0.7rem', letterSpacing: '0.12em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.5)', marginBottom: '0.5rem' }}>Caption (optional)</label>
            <input value={newCaption} onChange={(e) => setNewCaption(e.target.value)} placeholder="Describe this image" style={inputStyle} />
          </div>
          <button
            onClick={handleAdd}
            disabled={loading || !newUrl}
            style={{
              ...saveButtonStyle,
              background: loading ? 'rgba(233,68,128,0.5)' : saved ? '#10b981' : '#e94480',
              opacity: !newUrl ? 0.4 : 1,
              cursor: !newUrl ? 'not-allowed' : 'pointer',
            }}
          >
            {loading ? 'Adding...' : saved ? 'Added!' : 'Add Image'}
          </button>
        </div>
      </div>

      {/* Existing images */}
      <h3 style={{ fontSize: '0.85rem', color: 'rgba(255,255,255,0.5)', letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: '1rem' }}>
        Gallery Images ({items.length})
      </h3>
      {items.length > 0 ? (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: '1rem' }}>
          {items.sort((a, b) => (a.sortOrder || 0) - (b.sortOrder || 0)).map((item) => (
            <div key={item.id} style={{ borderRadius: '12px', overflow: 'hidden', border: '1px solid rgba(255,255,255,0.06)', background: 'rgba(255,255,255,0.02)' }}>
              <div style={{ aspectRatio: '1', overflow: 'hidden' }}>
                <img src={item.url} alt={item.caption || ''} style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} />
              </div>
              <div style={{ padding: '0.75rem' }}>
                <p style={{ fontSize: '0.75rem', color: 'rgba(255,255,255,0.6)', marginBottom: '0.5rem' }}>{item.caption || 'No caption'}</p>
                <button onClick={() => handleDelete(item.id)} style={{ background: 'none', border: '1px solid rgba(239,68,68,0.3)', color: '#f87171', borderRadius: '4px', padding: '0.25rem 0.5rem', fontSize: '0.65rem', cursor: 'pointer' }}>
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <p style={{ textAlign: 'center', color: 'rgba(255,255,255,0.4)', padding: '2rem' }}>No gallery images yet.</p>
      )}
    </div>
  )
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
  color: '#ffffff',
  border: 'none',
  borderRadius: '50px',
  fontSize: '0.75rem',
  fontWeight: 500,
  letterSpacing: '0.18em',
  textTransform: 'uppercase',
}