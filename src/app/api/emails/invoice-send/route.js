import { db } from '../../../../lib/db'
import { invoices } from '../../../../lib/schema'
import { eq } from 'drizzle-orm'
import { NextResponse } from 'next/server'

export async function POST(request) {
  try {
    const { invoiceId, customerEmail, customerName } = await request.json()

    if (!invoiceId || !customerEmail) {
      return NextResponse.json({ error: 'Invoice ID and customer email are required' }, { status: 400 })
    }

    // Fetch invoice details
    const rows = await db.select().from(invoices).where(eq(invoices.id, parseInt(invoiceId)))
    const invoice = rows[0]

    if (!invoice) {
      return NextResponse.json({ error: 'Invoice not found' }, { status: 404 })
    }

    // Send email via Resend
    const RESEND_API_KEY = process.env.RESEND_API_KEY
    const SMTP_FROM = process.env.SMTP_FROM || 'Ethereal Smile <events@nuelo.co>'

    if (!RESEND_API_KEY) {
      return NextResponse.json({ error: 'Email service not configured' }, { status: 500 })
    }

    const emailResponse = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${RESEND_API_KEY}` },
      body: JSON.stringify({
        from: SMTP_FROM,
        to: [customerEmail],
        subject: `Invoice #${invoice.id} from Ethereal Smile`,
        html: `
          <div style="max-width: 600px; margin: 0 auto; font-family: 'Inter', Arial, sans-serif; background: #000; color: #fff;">
            <div style="padding: 2rem; border-bottom: 1px solid rgba(233,68,128,0.2);">
              <h1 style="font-family: 'Playfair Display', serif; color: #e94480; font-size: 1.5rem; margin: 0;">Ethereal Smile</h1>
              <p style="color: rgba(255,255,255,0.5); font-size: 0.75rem; letter-spacing: 0.1em; text-transform: uppercase; margin: 0.5rem 0 0;">Invoice #${invoice.id}</p>
            </div>
            <div style="padding: 2rem;">
              <p style="color: rgba(255,255,255,0.8); font-size: 0.95rem;">Dear ${customerName},</p>
              <p style="color: rgba(255,255,255,0.8); font-size: 0.95rem;">Please find your invoice details below:</p>
              <div style="background: rgba(255,255,255,0.04); border: 1px solid rgba(255,255,255,0.1); border-radius: 8px; padding: 1.5rem; margin: 1.5rem 0;">
                <div style="display: flex; justify-content: space-between; margin-bottom: 1rem;">
                  <span style="color: rgba(255,255,255,0.5); font-size: 0.8rem;">Amount Due</span>
                  <span style="color: #e94480; font-size: 1.2rem; font-weight: 600;">&pound;${invoice.amount}</span>
                </div>
                ${invoice.dueDate ? `<div style="display: flex; justify-content: space-between; margin-bottom: 1rem;">
                  <span style="color: rgba(255,255,255,0.5); font-size: 0.8rem;">Due Date</span>
                  <span style="color: rgba(255,255,255,0.8); font-size: 0.9rem;">${new Date(invoice.dueDate).toLocaleDateString('en-GB', { day: '2-digit', month: 'long', year: 'numeric' })}</span>
                </div>` : ''}
                <div style="display: flex; justify-content: space-between;">
                  <span style="color: rgba(255,255,255,0.5); font-size: 0.8rem;">Status</span>
                  <span style="color: #4ade80; font-size: 0.9rem; text-transform: capitalize;">${invoice.status}</span>
                </div>
              </div>
              <p style="color: rgba(255,255,255,0.5); font-size: 0.85rem; margin-top: 2rem;">If you have any questions about this invoice, please reply to this email or contact us at etherealsmilex@gmail.com.</p>
              <p style="color: rgba(255,255,255,0.3); font-size: 0.8rem; margin-top: 2rem;">Ethereal Smile - Genuine Swarovski & Preciosa Crystal Tooth Gems</p>
            </div>
          </div>
        `,
      }),
    })

    if (!emailResponse.ok) {
      const errData = await emailResponse.json().catch(() => ({}))
      console.error('Resend error:', errData)
      return NextResponse.json({ error: 'Failed to send email' }, { status: 500 })
    }

    return NextResponse.json({ success: true })
  } catch (err) {
    console.error('Invoice email error:', err)
    return NextResponse.json({ error: 'Failed to send invoice email' }, { status: 500 })
  }
}