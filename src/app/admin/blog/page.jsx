'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import CloudinaryUpload from '../../../components/CloudinaryUpload'

export default function AdminBlog() {
  const [items, setItems] = useState([])
  const [form, setForm] = useState({ title: '', slug: '', content: '', excerpt: '', imageUrl: '', images: [], videoUrl: '', videoPoster: '', readTime: 5, status: 'draft' })
  const [editing, setEditing] = useState(null)
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
      ? { ...form, images: form.images || [] }
      : { ...form, images: form.images || [], publishedAt: form.status === 'published' ? new Date().toISOString() : null }
    const res = await fetch(url, {
      method,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    })
    if (res.ok) {
      setForm({ title: '', slug: '', content: '', excerpt: '', imageUrl: '', images: [], status: 'draft' })
      setEditing(null)
      setSaved(true)
      setTimeout(() => setSaved(false), 3000)
      fetchItems()
    }
    setLoading(false)
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
      images: Array.isArray(item.images) ? item.images : [],
      videoUrl: item.videoUrl || '',
      videoPoster: item.videoPoster || '',
      readTime: item.readTime || 5,
      status: item.status,
    })
  }

  async function handleAddImage(url) {
    setForm({ ...form, images: [...(form.images || []), url] })
  }

  function handleRemoveImage(index) {
    const newImages = [...(form.images || [])]
    newImages.splice(index, 1)
    setForm({ ...form, images: newImages })
  }

  return (
    <div style={{ padding: '2.5rem 2rem', maxWidth: '1200px' }}>
      <div style={{ marginBottom: '2rem' }}>
        <h1 style={{ fontFamily: "'Pirata One', 'Playfair Display', cursive", fontSize: '1.8rem', color: '#e94480', letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: '0.25rem' }}>
          Journal
        </h1>
        <p style={{ fontSize: '0.85rem', color: 'rgba(255,255,255,0.4)' }}>
          Manage blog posts and articles
        </p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))', gap: '2rem' }}>
        {/* Edit/Add form */}
        <div style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)', borderRadius: '14px', padding: '1.75rem' }}>
          <h3 style={{ fontSize: '0.85rem', color: '#e94480', letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: '1.5rem', fontWeight: 600 }}>
            {editing ? 'Edit Post' : 'Add Post'}
          </h3>
          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
            <div>
              <label style={{ display: 'block', fontSize: '0.7rem', letterSpacing: '0.12em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.5)', marginBottom: '0.5rem' }}>Title</label>
              <input value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} required style={inputStyle} placeholder="Post title" />
            </div>
            <div>
              <label style={{ display: 'block', fontSize: '0.7rem', letterSpacing: '0.12em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.5)', marginBottom: '0.5rem' }}>Slug</label>
              <input value={form.slug} onChange={(e) => setForm({ ...form, slug: e.target.value })} style={inputStyle} placeholder="Auto-generated if empty" />
            </div>
            <CloudinaryUpload
              label="Featured Image"
              currentUrl={form.imageUrl}
              onUpload={(url) => setForm({ ...form, imageUrl: url })}
            />
            {/* Additional images / video */}
            <div>
              <label style={{ display: 'block', fontSize: '0.7rem', letterSpacing: '0.12em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.5)', marginBottom: '0.5rem' }}>
                Additional Images / Video
              </label>
              {(form.images || []).length > 0 && (
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(120px, 1fr))', gap: '0.75rem', marginBottom: '0.75rem' }}>
                  {(form.images || []).map((img, i) => (
                    <div key={i} style={{ position: 'relative', borderRadius: '8px', overflow: 'hidden', border: '1px solid rgba(255,255,255,0.08)', aspectRatio: '1' }}>
                      {img.includes('/video/') || img.endsWith('.mp4') ? (
                        <div style={{ width: '100%', height: '100%', background: 'rgba(255,255,255,0.05)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#e94480" strokeWidth="2"><polygon points="5 3 19 12 5 21 5 3" /></svg>
                        </div>
                      ) : (
                        <img src={img} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                      )}
                      <button type="button" onClick={() => handleRemoveImage(i)} style={{ position: 'absolute', top: '4px', right: '4px', background: 'rgba(239,68,68,0.9)', color: '#fff', border: 'none', borderRadius: '4px', padding: '2px 6px', fontSize: '0.65rem', cursor: 'pointer' }}>X</button>
                    </div>
                  ))}
                </div>
              )}
              <CloudinaryUpload
                label=""
                currentUrl=""
                onUpload={handleAddImage}
              />
            </div>
            <div>
              <label style={{ display: 'block', fontSize: '0.7rem', letterSpacing: '0.12em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.5)', marginBottom: '0.5rem' }}>Excerpt</label>
              <textarea rows={2} value={form.excerpt} onChange={(e) => setForm({ ...form, excerpt: e.target.value })} style={{ ...inputStyle, resize: 'vertical' }} placeholder="Short summary..." />
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.7rem', letterSpacing: '0.12em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.5)', marginBottom: '0.5rem' }}>Video URL</label>
                <input value={form.videoUrl} onChange={(e) => setForm({ ...form, videoUrl: e.target.value })} style={inputStyle} placeholder="/videos/article.mp4" />
              </div>
              <div>
                <label style={{ display: 'block', fontSize: '0.7rem', letterSpacing: '0.12em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.5)', marginBottom: '0.5rem' }}>Read Time (min)</label>
                <input type="number" min={1} max={60} value={form.readTime} onChange={(e) => setForm({ ...form, readTime: parseInt(e.target.value) || 5 })} style={inputStyle} />
              </div>
            </div>
            <div>
              <label style={{ display: 'block', fontSize: '0.7rem', letterSpacing: '0.12em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.5)', marginBottom: '0.5rem' }}>Content</label>
              <textarea rows={8} value={form.content} onChange={(e) => setForm({ ...form, content: e.target.value })} required style={{ ...inputStyle, resize: 'vertical' }} placeholder="Full post content..." />
            </div>
            <div>
              <label style={{ display: 'block', fontSize: '0.7rem', letterSpacing: '0.12em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.5)', marginBottom: '0.5rem' }}>Status</label>
              <select value={form.status} onChange={(e) => setForm({ ...form, status: e.target.value })} style={{ ...inputStyle, cursor: 'pointer' }}>
                <option value="draft">Draft</option>
                <option value="published">Published</option>
              </select>
            </div>
            <div style={{ display: 'flex', gap: '0.75rem' }}>
              <button type="submit" disabled={loading} style={{
                ...saveButtonStyle,
                background: loading ? 'rgba(233,68,128,0.5)' : saved ? '#10b981' : '#e94480',
                opacity: loading ? 0.7 : 1,
              }}>
                {loading ? 'Saving...' : saved ? 'Saved!' : editing ? 'Update' : 'Add Post'}
              </button>
              {editing && (
                <button type="button" onClick={() => { setEditing(null); setForm({ title: '', slug: '', content: '', excerpt: '', imageUrl: '', images: [], videoUrl: '', videoPoster: '', readTime: 5, status: 'draft' }) }} style={resetButtonStyle}>
                  Cancel
                </button>
              )}
            </div>
          </form>
        </div>

        {/* Posts list */}
        <div style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)', borderRadius: '14px', padding: '1.75rem' }}>
          <h3 style={{ fontSize: '0.85rem', color: '#e94480', letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: '1.5rem', fontWeight: 600 }}>
            Posts ({items.length})
          </h3>
          {items.length > 0 ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              {items.map((item) => (
                <div key={item.id} style={{ padding: '1rem', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.05)', background: 'rgba(255,255,255,0.02)' }}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                    <span style={{ fontWeight: 500, color: 'rgba(255,255,255,0.85)', fontSize: '0.85rem' }}>{item.title}</span>
                    <span style={{ fontSize: '0.65rem', padding: '0.2rem 0.5rem', borderRadius: '4px', background: item.status === 'published' ? 'rgba(76,175,80,0.15)' : 'rgba(255,255,255,0.08)', color: item.status === 'published' ? '#81c784' : 'rgba(255,255,255,0.5)' }}>
                      {item.status}
                    </span>
                  </div>
                  {item.imageUrl && (
                    <div style={{ width: '100%', maxHeight: '80px', overflow: 'hidden', borderRadius: '6px', marginBottom: '0.5rem' }}>
                      <img src={item.imageUrl} alt="" style={{ width: '100%', height: '80px', objectFit: 'cover' }} />
                    </div>
                  )}
                  <p style={{ fontSize: '0.7rem', color: 'rgba(255,255,255,0.3)', marginBottom: '0.75rem' }}>/journal/{item.slug}</p>
                  <div style={{ display: 'flex', gap: '0.75rem' }}>
                    <button onClick={() => handleEdit(item)} style={{ background: 'none', border: 'none', color: '#e94480', cursor: 'pointer', fontSize: '0.75rem' }}>Edit</button>
                    <button onClick={() => handleDelete(item.id)} style={{ background: 'none', border: 'none', color: '#e57373', cursor: 'pointer', fontSize: '0.75rem' }}>Delete</button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p style={{ color: 'rgba(255,255,255,0.4)', textAlign: 'center', padding: '2rem' }}>No posts yet.</p>
          )}
        </div>
      </div>
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