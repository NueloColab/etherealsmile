'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import AdminNav from '../../../components/AdminNav'

export default function AdminServices() {
  const [items, setItems] = useState([])
  const [form, setForm] = useState({ name: '', description: '', price: '', duration: '', sortOrder: 0, active: true })
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
    setForm({ name: '', description: '', price: '', duration: '', sortOrder: 0, active: true })
    setEditing(null)
    setLoading(false)
    fetchItems()
  }

  async function handleDelete(id) {
    if (!confirm('Delete this service?')) return
    await fetch(`/api/services/${id}`, { method: 'DELETE' })
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
            color: '#c9a96e',
            letterSpacing: '0.08em',
            textTransform: 'uppercase',
          }}
        >
          Services
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
            {editing ? 'Edit Service' : 'Add Service'}
          </h3>
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label>Name</label>
              <input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required />
            </div>
            <div className="form-group">
              <label>Description</label>
              <textarea rows={2} value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} />
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
              <div className="form-group">
                <label>Price</label>
                <input value={form.price} onChange={(e) => setForm({ ...form, price: e.target.value })} placeholder="\u00a335" />
              </div>
              <div className="form-group">
                <label>Duration</label>
                <input value={form.duration} onChange={(e) => setForm({ ...form, duration: e.target.value })} placeholder="15 min" />
              </div>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
              <div className="form-group">
                <label>Sort Order</label>
                <input type="number" value={form.sortOrder} onChange={(e) => setForm({ ...form, sortOrder: Number(e.target.value) })} />
              </div>
              <div className="form-group" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginTop: '1.5rem' }}>
                <input
                  type="checkbox"
                  id="active"
                  checked={form.active}
                  onChange={(e) => setForm({ ...form, active: e.target.checked })}
                  style={{ width: 'auto' }}
                />
                <label htmlFor="active" style={{ marginBottom: 0 }}>Active</label>
              </div>
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
                    setForm({ name: '', description: '', price: '', duration: '', sortOrder: 0, active: true })
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
            Current Services
          </h3>
          {items.length > 0 ? (
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.8rem' }}>
              <thead>
                <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.1)' }}>
                  {['Name', 'Price', 'Active', 'Actions'].map((h) => (
                    <th
                      key={h}
                      style={{
                        textAlign: 'left',
                        padding: '0.6rem',
                        fontSize: '0.6rem',
                        letterSpacing: '0.1em',
                        textTransform: 'uppercase',
                        color: 'rgba(255,255,255,0.4)',
                        fontWeight: 400,
                      }}
                    >
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {items.map((item) => (
                  <tr key={item.id} style={{ borderBottom: '1px solid rgba(255,255,255,0.04)' }}>
                    <td style={{ padding: '0.6rem', color: 'rgba(255,255,255,0.8)' }}>{item.name}</td>
                    <td style={{ padding: '0.6rem', color: 'rgba(255,255,255,0.6)' }}>{item.price}</td>
                    <td style={{ padding: '0.6rem' }}>
                      <span
                        style={{
                          fontSize: '0.65rem',
                          padding: '0.2rem 0.5rem',
                          borderRadius: '4px',
                          background: item.active ? 'rgba(76,175,80,0.15)' : 'rgba(244,67,54,0.15)',
                          color: item.active ? '#81c784' : '#e57373',
                        }}
                      >
                        {item.active ? 'Yes' : 'No'}
                      </span>
                    </td>
                    <td style={{ padding: '0.6rem' }}>
                      <button
                        onClick={() => {
                          setEditing(item.id)
                          setForm({
                            name: item.name,
                            description: item.description || '',
                            price: item.price || '',
                            duration: item.duration || '',
                            sortOrder: item.sortOrder,
                            active: item.active,
                          })
                        }}
                        style={{
                          background: 'none',
                          border: 'none',
                          color: '#c9a96e',
                          cursor: 'pointer',
                          fontSize: '0.75rem',
                          marginRight: '0.75rem',
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
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <p style={{ color: 'rgba(255,255,255,0.4)' }}>No services yet.</p>
          )}
        </div>
      </div>
    </div>
  )
}
