'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import AdminNav from '../../../components/AdminNav'

export default function AdminBlog() {
  const [items, setItems] = useState([])
  const [form, setForm] = useState({ title: '', slug: '', content: '', excerpt: '', imageUrl: '', images: '', status: 'draft' })
  const [editing, setEditing] = useState(null)
  const [loading, setLoading] = useState(false)
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
    const res = await fetch('/api/blog-posts')
    const data = await res.json()
    setItems(data)
  }

  async function handleSubmit(e) {
    e.preventDefault()
    setLoading(true)
    const url = editing ? `/api/blog-posts/${editing}` : '/api/blog-posts'
    const method = editing ? 'PUT' : 'POST'
    const payload = editing
      ? { ...form, images: form.images ? form.images.split(',').map((s) => s.trim()).filter(Boolean) : [] }
      : { ...form, images: form.images ? form.images.split(',').map((s) => s.trim()).filter(Boolean) : [], publishedAt: form.status === 'published' ? new Date().toISOString() : null }
    await fetch(url, {
      method,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    })
    setForm({ title: '', slug: '', content: '', excerpt: '', imageUrl: '', images: '', status: 'draft' })
    setEditing(null)
    setLoading(false)
    fetchItems()
  }

  async function handleDelete(id) {
    if (!confirm('Delete this post?')) return
    await fetch(`/api/blog-posts/${id}`, { method: 'DELETE' })
    fetchItems()
  }

  function handleEdit(item) {
    setEditing(item.id)
    setForm({
      title: item.title,
      slug: item.slug,
      content: item.content,
      excerpt: item.excerpt || '',
      imageUrl: item.imageUrl || '',
      images: Array.isArray(item.images) ? item.images.join(', ') : (item.images || ''),
      status: item.status,
    })
  }

  return (
    <div style={{ padding: '2rem 1.5rem', maxWidth: '1200px', margin: '0 auto' }}>
      <AdminNav />

      <div style={{ marginBottom: '1.5rem' }}>
        <h1
          style={{
            fontFamily: "'Playfair Display', serif",
            fontSize: '1.4rem',
            color: '#c9a96e',
            letterSpacing: '0.08em',
            textTransform: 'uppercase',
          }}
        >
          Blog
        </h1>
      </div>

      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
          gap: '1.5rem',
          marginBottom: '2.5rem',
        }}
      >
        <div className="frame-card">
          <h3 style={{ fontFamily: "'Playfair Display', serif", fontSize: '1rem', color: '#c9a96e', marginBottom: '1.25rem' }}>
            {editing ? 'Edit Post' : 'Add Post'}
          </h3>
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label>Title</label>
              <input value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} required />
            </div>
            <div className="form-group">
              <label>Slug</label>
              <input value={form.slug} onChange={(e) => setForm({ ...form, slug: e.target.value })} placeholder="auto-generated if empty" />
            </div>
            <div className="form-group">
              <label>Image URL</label>
              <input value={form.imageUrl} onChange={(e) => setForm({ ...form, imageUrl: e.target.value })} placeholder="https://..." />
            </div>
            <div className="form-group">
              <label>Additional Images (comma-separated URLs)</label>
              <textarea
                rows={2}
                value={form.images}
                onChange={(e) => setForm({ ...form, images: e.target.value })}
                placeholder="https://example.com/img1.jpg, https://example.com/img2.jpg..."
              />
            </div>
            <div className="form-group">
              <label>Excerpt</label>
              <textarea rows={2} value={form.excerpt} onChange={(e) => setForm({ ...form, excerpt: e.target.value })} placeholder="Short summary..." />
            </div>
            <div className="form-group">
              <label>Content</label>
              <textarea rows={5} value={form.content} onChange={(e) => setForm({ ...form, content: e.target.value })} required placeholder="Full post content..." />
            </div>
            <div className="form-group">
              <label>Status</label>
              <select value={form.status} onChange={(e) => setForm({ ...form, status: e.target.value })} style={{ cursor: 'pointer' }}>
                <option value="draft">Draft</option>
                <option value="published">Published</option>
              </select>
            </div>
            <div style={{ display: 'flex', gap: '0.5rem' }}>
              <button type="submit" className="btn btn-primary" disabled={loading}>
                {loading ? 'Saving...' : editing ? 'Update' : 'Add'}
              </button>
              {editing && (
                <button
                  type="button"
                  className="btn btn-outline"
                  onClick={() => {
                    setEditing(null)
                    setForm({ title: '', slug: '', content: '', excerpt: '', imageUrl: '', images: '', status: 'draft' })
                  }}
                >
                  Cancel
                </button>
              )}
            </div>
          </form>
        </div>

        <div className="frame-card" style={{ overflowX: 'auto' }}>
          <h3 style={{ fontFamily: "'Playfair Display', serif", fontSize: '1rem', color: '#c9a96e', marginBottom: '1.25rem' }}>
            Posts
          </h3>
          {items.length > 0 ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              {items.map((item) => (
                <div
                  key={item.id}
                  style={{
                    padding: '1rem',
                    borderRadius: '8px',
                    border: '1px solid rgba(255,255,255,0.05)',
                    background: 'rgba(255,255,255,0.02)',
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                    <span style={{ fontWeight: 500, color: 'rgba(255,255,255,0.85)' }}>{item.title}</span>
                    <span
                      style={{
                        fontSize: '0.65rem',
                        padding: '0.2rem 0.5rem',
                        borderRadius: '4px',
                        background: item.status === 'published' ? 'rgba(76,175,80,0.15)' : 'rgba(255,255,255,0.08)',
                        color: item.status === 'published' ? '#81c784' : 'rgba(255,255,255,0.5)',
                      }}
                    >
                      {item.status}
                    </span>
                  </div>
                  <p style={{ fontSize: '0.75rem', color: 'rgba(255,255,255,0.4)', marginBottom: '0.75rem' }}>
                    /journal/{item.slug}
                  </p>
                  <div style={{ display: 'flex', gap: '0.75rem' }}>
                    <button
                      onClick={() => handleEdit(item)}
                      style={{
                        background: 'none',
                        border: 'none',
                        color: '#c9a96e',
                        cursor: 'pointer',
                        fontSize: '0.75rem',
                      }}
                    >
                      Edit
                    </button>
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
          ) : (
            <p style={{ color: 'rgba(255,255,255,0.4)' }}>No posts yet.</p>
          )}
        </div>
      </div>
    </div>
  )
}
