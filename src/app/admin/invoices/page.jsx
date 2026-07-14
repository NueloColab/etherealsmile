'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'

const STATUS_STYLES = {
  draft: { bg: 'rgba(255,255,255,0.05)', color: 'rgba(255,255,255,0.5)', border: 'rgba(255,255,255,0.1)' },
  sent: { bg: 'rgba(59,130,246,0.1)', color: '#60a5fa', border: 'rgba(59,130,246,0.2)' },
  paid: { bg: 'rgba(34,197,94,0.1)', color: '#4ade80', border: 'rgba(34,197,94,0.2)' },
  overdue: { bg: 'rgba(239,68,68,0.1)', color: '#f87171', border: 'rgba(239,68,68,0.2)' },
}

export default function InvoicesPage() {
  const [invoices, setInvoices] = useState([])
  const [loading, setLoading] = useState(true)
  const [showCreate, setShowCreate] = useState(false)
  const [form, setForm] = useState({ customerName: '', customerEmail: '', amount: '', dueDate: '', status: 'draft' })
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    fetch('/api/invoices')
      .then(r => r.json())
      .then(data => { setInvoices(data); setLoading(false) })
      .catch(() => setLoading(false))
  }, [])

  async function handleCreate(e) {
    e.preventDefault()
    setSaving(true)
    setError('')
    try {
      const res = await fetch('/api/invoices', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      })
      if (!res.ok) {
        const data = await res.json().catch(() => ({}))
        throw new Error(data.error || 'Failed to create invoice')
      }
      const newInvoice = await res.json()
      setInvoices(prev => [newInvoice, ...prev])
      setShowCreate(false)
      setForm({ customerName: '', customerEmail: '', amount: '', dueDate: '', status: 'draft' })
    } catch (err) {
      setError(err.message)
    } finally {
      setSaving(false)
    }
  }

  async function handleStatusChange(id, newStatus) {
    try {
      const res = await fetch(`/api/invoices/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus }),
      })
      if (!res.ok) throw new Error('Failed to update')
      const updated = await res.json()
      setInvoices(prev => prev.map(inv => inv.id === id ? updated : inv))
    } catch (err) {
      alert('Failed to update invoice status')
    }
  }

  async function handleSend(id, customerEmail, customerName) {
    try {
      const res = await fetch('/api/emails/invoice-send', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ invoiceId: id, customerEmail, customerName }),
      })
      if (!res.ok) throw new Error('Failed to send')
      handleStatusChange(id, 'sent')
      alert('Invoice sent!')
    } catch (err) {
      alert('Failed to send invoice email. Make sure the email service is configured.')
    }
  }

  const inputStyle = { width: '100%', padding: '0.85rem 1rem', background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px', color: '#ffffff', fontSize: '0.85rem', outline: 'none', fontFamily: "'Inter', sans-serif" }
  const labelStyle = { display: 'block', fontSize: '0.7rem', letterSpacing: '0.12em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.5)', marginBottom: '0.5rem' }

  if (loading) {
    return (
      <div style={{ padding: '2rem', color: 'rgba(255,255,255,0.4)' }}>Loading invoices...</div>
    )
  }

  return (
    <div style={{ padding: '2.5rem 2rem', maxWidth: '1100px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <div>
          <Link href="/admin" style={{ fontSize: '0.75rem', color: '#e94480', textDecoration: 'none', letterSpacing: '0.1em', textTransform: 'uppercase' }}>
            &larr; Dashboard
          </Link>
          <h1 style={{ fontFamily: "'Pirata One', 'Playfair Display', cursive", fontSize: '1.8rem', color: '#e94480', letterSpacing: '0.08em', textTransform: 'uppercase', marginTop: '0.5rem' }}>
            Invoices
          </h1>
        </div>
        <button
          onClick={() => setShowCreate(true)}
          style={{ padding: '0.85rem 2rem', background: '#e94480', color: '#ffffff', border: 'none', borderRadius: '50px', fontSize: '0.75rem', fontWeight: 500, letterSpacing: '0.18em', textTransform: 'uppercase', cursor: 'pointer' }}
        >
          + New Invoice
        </button>
      </div>

      {error && <div style={{ background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.2)', borderRadius: '8px', padding: '1rem', color: '#f87171', marginBottom: '1rem', fontSize: '0.85rem' }}>{error}</div>}

      {invoices.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '3rem', color: 'rgba(255,255,255,0.4)' }}>
          No invoices yet. Create your first invoice to get started.
        </div>
      ) : (
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', minWidth: '640px', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
                {['Invoice', 'Customer', 'Amount', 'Status', 'Due Date', 'Actions'].map(h => (
                  <th key={h} style={{ textAlign: 'left', padding: '0.75rem', fontSize: '0.7rem', letterSpacing: '0.12em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.4)', fontWeight: 500 }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {invoices.map(inv => {
                const status = inv.status || 'draft'
                const style = STATUS_STYLES[status] || STATUS_STYLES.draft
                return (
                  <tr key={inv.id} style={{ borderBottom: '1px solid rgba(255,255,255,0.04)' }}>
                    <td style={{ padding: '0.75rem', color: '#ffffff', fontWeight: 500, fontSize: '0.85rem' }}>#{inv.id}</td>
                    <td style={{ padding: '0.75rem', fontSize: '0.85rem' }}>
                      <div style={{ color: 'rgba(255,255,255,0.85)' }}>{inv.customerName}</div>
                      <div style={{ color: 'rgba(255,255,255,0.4)', fontSize: '0.75rem' }}>{inv.customerEmail}</div>
                    </td>
                    <td style={{ padding: '0.75rem', color: '#ffffff', fontWeight: 500, fontSize: '0.85rem' }}>&pound;{inv.amount}</td>
                    <td style={{ padding: '0.75rem' }}>
                      <span style={{ padding: '0.25rem 0.6rem', borderRadius: '4px', fontSize: '0.65rem', fontWeight: 600, letterSpacing: '0.08em', textTransform: 'uppercase', background: style.bg, color: style.color, border: `1px solid ${style.border}` }}>
                        {status}
                      </span>
                    </td>
                    <td style={{ padding: '0.75rem', color: 'rgba(255,255,255,0.5)', fontSize: '0.85rem' }}>
                      {inv.dueDate ? new Date(inv.dueDate).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }) : '-'}
                    </td>
                    <td style={{ padding: '0.75rem' }}>
                      <div style={{ display: 'flex', gap: '0.5rem' }}>
                        {status === 'draft' && (
                          <button onClick={() => handleSend(inv.id, inv.customerEmail, inv.customerName)} style={{ padding: '0.4rem 0.8rem', background: 'rgba(59,130,246,0.1)', color: '#60a5fa', border: '1px solid rgba(59,130,246,0.2)', borderRadius: '4px', fontSize: '0.7rem', cursor: 'pointer', fontWeight: 500 }}>
                            Send
                          </button>
                        )}
                        {status === 'sent' && (
                          <button onClick={() => handleStatusChange(inv.id, 'paid')} style={{ padding: '0.4rem 0.8rem', background: 'rgba(34,197,94,0.1)', color: '#4ade80', border: '1px solid rgba(34,197,94,0.2)', borderRadius: '4px', fontSize: '0.7rem', cursor: 'pointer', fontWeight: 500 }}>
                            Mark Paid
                          </button>
                        )}
                        {status === 'sent' && (
                          <button onClick={() => handleSend(inv.id, inv.customerEmail, inv.customerName)} style={{ padding: '0.4rem 0.8rem', background: 'rgba(255,255,255,0.04)', color: 'rgba(255,255,255,0.5)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '4px', fontSize: '0.7rem', cursor: 'pointer' }}>
                            Resend
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      )}

      {showCreate && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(4px)', zIndex: 50, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1rem' }} onClick={() => setShowCreate(false)}>
          <div style={{ background: '#0a0a0a', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '16px', padding: '2rem', width: '100%', maxWidth: '480px' }} onClick={e => e.stopPropagation()}>
            <h2 style={{ fontFamily: "'Pirata One', 'Playfair Display', cursive", fontSize: '1.4rem', color: '#e94480', letterSpacing: '0.05em', marginBottom: '1.5rem' }}>Create Invoice</h2>
            <form onSubmit={handleCreate} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
              <div>
                <label style={labelStyle}>Customer Name</label>
                <input type="text" required value={form.customerName} onChange={e => setForm({...form, customerName: e.target.value})} placeholder="Hattie Clifford" style={inputStyle} />
              </div>
              <div>
                <label style={labelStyle}>Customer Email</label>
                <input type="email" required value={form.customerEmail} onChange={e => setForm({...form, customerEmail: e.target.value})} placeholder="customer@email.com" style={inputStyle} />
              </div>
              <div>
                <label style={labelStyle}>Amount (&pound;)</label>
                <input type="text" required value={form.amount} onChange={e => setForm({...form, amount: e.target.value})} placeholder="50.00" style={inputStyle} />
              </div>
              <div>
                <label style={labelStyle}>Due Date</label>
                <input type="date" value={form.dueDate} onChange={e => setForm({...form, dueDate: e.target.value})} style={inputStyle} />
              </div>
              <div>
                <label style={labelStyle}>Status</label>
                <select value={form.status} onChange={e => setForm({...form, status: e.target.value})} style={inputStyle}>
                  <option value="draft">Draft</option>
                  <option value="sent">Sent</option>
                </select>
              </div>
              <button type="submit" disabled={saving} style={{ width: '100%', padding: '0.85rem', background: saving ? 'rgba(233,68,128,0.5)' : '#e94480', color: '#ffffff', border: 'none', borderRadius: '50px', fontSize: '0.75rem', fontWeight: 500, letterSpacing: '0.18em', textTransform: 'uppercase', cursor: saving ? 'not-allowed' : 'pointer' }}>
                {saving ? 'Creating...' : 'Create Invoice'}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}