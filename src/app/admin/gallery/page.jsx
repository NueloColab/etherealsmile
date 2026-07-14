'use client'

import { useState, useEffect } from 'react'
import AdminNav from '../../../components/AdminNav'

export default function AdminGallery() {
  const [items, setItems] = useState([])
  const [url, setUrl] = useState('')
  const [caption, setCaption] = useState('')
  const [loading, setLoading] = useState(false)

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
    setLoading(true)
    await fetch('/api/gallery', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ url, caption, type: 'image', sortOrder: items.length }),
    })
    setUrl('')
    setCaption('')
    setLoading(false)
    fetchItems()
  }

  async function handleDelete(id) {
    if (!confirm('Delete this image?')) return
    await fetch(`/api/gallery/${id}`, { method: 'DELETE' })
    fetchItems()
  }

  return (
    <div style={{ padding: '2rem 1.5rem', maxWidth: '1200px', margin: '0 auto' }}>
      <AdminNav />

      <div style={{ marginBottom: '1.5rem' }}>
        <h1
          style={{
            fontFamily: "'Playfair Display', serif",
            fontSize: '1.4rem',
            color: '#e94480',
            letterSpacing: '0.08em',
            textTransform: 'uppercase',
          }}
        >
          Gallery
        </h1>
      </div>

      <div className="frame-card" style={{ maxWidth: '500px', marginBottom: '2rem' }}>
        <h3 style={{ fontFamily: "'Playfair Display', serif", fontSize: '1rem', color: '#e94480', marginBottom: '1.25rem' }}>
          Add Image
        </h3>
        <form onSubmit={handleAdd}>
          <div className="form-group">
            <label>Image URL</label>
            <input value={url} onChange={(e) => setUrl(e.target.value)} required placeholder="https://..." />
          </div>
          <div className="form-group">
            <label>Caption</label>
            <input value={caption} onChange={(e) => setCaption(e.target.value)} placeholder="Optional caption" />
          </div>
          <button type="submit" className="btn btn-primary" disabled={loading || !url}>
            {loading ? 'Adding...' : 'Add Image'}
          </button>
        </form>
      </div>

      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))',
          gap: '1rem',
        }}
      >
        {items.map((item) => (
          <div
            key={item.id}
            style={{
              borderRadius: '10px',
              overflow: 'hidden',
              border: '1px solid rgba(255,255,255,0.06)',
              background: 'rgba(0,0,0,0.5)',
              position: 'relative',
            }}
          >
            <img
              src={item.url}
              alt={item.caption || ''}
              style={{ width: '100%', height: '160px', objectFit: 'cover', display: 'block' }}
            />
            <div style={{ padding: '0.75rem' }}>
              <p style={{ fontSize: '0.75rem', color: 'rgba(255,255,255,0.6)', marginBottom: '0.5rem' }}>
                {item.caption || 'No caption'}
              </p>
              <button
                onClick={() => handleDelete(item.id)}
                style={{
                  background: 'none',
                  border: 'none',
                  color: '#e57373',
                  cursor: 'pointer',
                  fontSize: '0.75rem',
                }}
              >
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>

      {items.length === 0 && (
        <p style={{ textAlign: 'center', color: 'rgba(255,255,255,0.4)', marginTop: '2rem' }}>No gallery images yet.</p>
      )}
    </div>
  )
}
