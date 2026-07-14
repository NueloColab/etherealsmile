'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import CloudinaryUpload from '../../../components/CloudinaryUpload'

export default function AdminServices() {
  const [items, setItems] = useState([])
  const [form, setForm] = useState({ name: '', description: '', price: '', duration: '', image: '', sortOrder: 0, active: true })
  const [editing, setEditing] = useState(null)
  const [loading, setLoading] = useState(false)

  useEffect(() => { fetchItems() }, [])

  async function fetchItems() {
    const res = await fetch('/api/services')
    const data = await res.json()
    setItems(data)
  }

  async function handleSubmit(e) {
    e.preventDefault()
    setLoading(true)
    const url = editing ? `/api/services/${editing}` : '/api/services'
    const method = editing ? 'PUT' : 'POST'
    await fetch(url, {
      method,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(form),
    })
    setForm({ name: '', description: '', price: '', duration: '', image: '', sortOrder: 0, active: true })
    setEditing(null)
    setLoading(false)
    fetchItems()
  }

  async function handleDelete(id) {
    if (!confirm('Delete this service?')) return
    await fetch(`/api/services/${id}`, { method: 'DELETE' })
    fetchItems()
  }

  const inputStyle = { width: '100%', padding: '0.85rem 1rem', background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px', color: '#ffffff', fontSize: '0.85rem', outline: 'none', fontFamily: "'Inter', sans-serif" }
  const labelStyle = { display: 'block', fontSize: '0.7rem', letterSpacing: '0.12em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.5)', marginBottom: '0.5rem' }

  return (
    <div style={{ padding: '2.5rem 2rem', maxWidth: '1100px' }}>
      <div style={{ marginBottom: '2rem' }}>
        <Link href="/admin" style={{ fontSize: '0.75rem', color: '#e94480', textDecoration: 'none', letterSpacing: '0.1em', textTransform: 'uppercase' }}>
          &larr; Dashboard
        </Link>
        <h1 style={{ fontFamily: "'Pirata One', 'Playfair Display', cursive", fontSize: '1.8rem', color: '#e94480', letterSpacing: '0.08em', textTransform: 'uppercase', marginTop: '0.5rem' }}>
          Services
        </h1>
      </div>

      <div className="admin-two-col" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem' }}>
        {/* Add/Edit form */}
        <div style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '12px', padding: '1.5rem' }}>
          <h3 style={{ fontFamily: "'Pirata One', 'Playfair Display', cursive", fontSize: '1.1rem', color: '#e94480', marginBottom: '1.25rem' }}>
            {editing ? 'Edit Service' : 'Add Service'}
          </h3>
          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
            <div>
              <label style={labelStyle}>Name</label>
              <input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required style={inputStyle} placeholder="Swarovski Single Gem" />
            </div>
            <div>
              <label style={labelStyle}>Description</label>
              <textarea rows={2} value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} style={{ ...inputStyle, resize: 'vertical' }} placeholder="Brief description of the service" />
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
              <div>
                <label style={labelStyle}>Price</label>
                <input value={form.price} onChange={(e) => setForm({ ...form, price: e.target.value })} style={inputStyle} placeholder="£35" />
              </div>
              <div>
                <label style={labelStyle}>Duration</label>
                <input value={form.duration} onChange={(e) => setForm({ ...form, duration: e.target.value })} style={inputStyle} placeholder="15 min" />
              </div>
            </div>
            <CloudinaryUpload
              label="Service Image"
              currentUrl={form.image}
              onUpload={(url) => setForm({ ...form, image: url })}
            />
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
              <div>
                <label style={labelStyle}>Sort Order</label>
                <input type="number" value={form.sortOrder} onChange={(e) => setForm({ ...form, sortOrder: Number(e.target.value) })} style={inputStyle} />
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginTop: '1.5rem' }}>
                <input type="checkbox" id="active" checked={form.active} onChange={(e) => setForm({ ...form, active: e.target.checked })} style={{ width: 'auto' }} />
                <label htmlFor="active" style={{ fontSize: '0.85rem', color: 'rgba(255,255,255,0.7)' }}>Active</label>
              </div>
            </div>
            <div style={{ display: 'flex', gap: '0.75rem', marginTop: '0.5rem' }}>
              <button type="submit" disabled={loading} style={{ padding: '0.85rem 2rem', background: loading ? 'rgba(233,68,128,0.5)' : '#e94480', color: '#ffffff', border: 'none', borderRadius: '50px', fontSize: '0.75rem', fontWeight: 500, letterSpacing: '0.18em', textTransform: 'uppercase', cursor: loading ? 'not-allowed' : 'pointer' }}>
                {loading ? 'Saving...' : editing ? 'Update' : 'Add Service'}
              </button>
              {editing && (
                <button type="button" onClick={() => { setEditing(null); setForm({ name: '', description: '', price: '', duration: '', image: '', sortOrder: 0, active: true }) }} style={{ padding: '0.85rem 2rem', background: 'transparent', color: 'rgba(255,255,255,0.6)', border: '1px solid rgba(255,255,255,0.2)', borderRadius: '50px', fontSize: '0.75rem', fontWeight: 500, letterSpacing: '0.18em', textTransform: 'uppercase', cursor: 'pointer' }}>
                  Cancel
                </button>
              )}
            </div>
          </form>
        </div>

        {/* Services list */}
        <div style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '12px', padding: '1.5rem' }}>
          <h3 style={{ fontFamily: "'Pirata One', 'Playfair Display', cursive", fontSize: '1.1rem', color: '#e94480', marginBottom: '1.25rem' }}>
            Current Services
          </h3>
          {items.length === 0 ? (
            <p style={{ color: 'rgba(255,255,255,0.4)', textAlign: 'center', padding: '2rem' }}>No services yet. Add your first service.</p>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              {items.sort((a, b) => (a.sortOrder || 0) - (b.sortOrder || 0)).map(item => (
                <div key={item.id} style={{ display: 'flex', gap: '1rem', alignItems: 'center', padding: '0.75rem', background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.06)', borderRadius: '8px' }}>
                  {item.image ? (
                    <div style={{ width: '48px', height: '48px', borderRadius: '6px', overflow: 'hidden', flexShrink: 0 }}>
                      <img src={item.image} alt={item.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                    </div>
                  ) : (
                    <div style={{ width: '48px', height: '48px', borderRadius: '6px', background: 'rgba(233,68,128,0.08)', border: '1px solid rgba(233,68,128,0.15)', flexShrink: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.7rem', color: '#e94480' }}>
                      {item.name?.charAt(0) || '?'}
                    </div>
                  )}
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ color: '#ffffff', fontSize: '0.85rem', fontWeight: 500 }}>{item.name}</div>
                    <div style={{ color: 'rgba(255,255,255,0.4)', fontSize: '0.75rem' }}>{item.price || 'No price'} {item.duration ? `- ${item.duration}` : ''}</div>
                  </div>
                  <span style={{ padding: '0.2rem 0.5rem', borderRadius: '4px', fontSize: '0.6rem', fontWeight: 600, letterSpacing: '0.05em', textTransform: 'uppercase', background: item.active ? 'rgba(76,175,80,0.1)' : 'rgba(255,255,255,0.05)', color: item.active ? '#4ade80' : 'rgba(255,255,255,0.4)', border: `1px solid ${item.active ? 'rgba(76,175,80,0.2)' : 'rgba(255,255,255,0.1)'}` }}>
                    {item.active ? 'Active' : 'Inactive'}
                  </span>
                  <button onClick={() => { setEditing(item.id); setForm({ name: item.name, description: item.description || '', price: item.price || '', duration: item.duration || '', image: item.image || '', sortOrder: item.sortOrder, active: item.active }) }} style={{ background: 'none', border: 'none', color: '#e94480', cursor: 'pointer', fontSize: '0.75rem', padding: '0.25rem 0.5rem' }}>
                    Edit
                  </button>
                  <button onClick={() => handleDelete(item.id)} style={{ background: 'none', border: 'none', color: '#f87171', cursor: 'pointer', fontSize: '0.75rem', padding: '0.25rem 0.5rem' }}>
                    Delete
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
      <style jsx>{`
        @media (max-width: 768px) {
          .admin-two-col {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>
    </div>
  )
}