import { Resend } from 'resend'

const resend = process.env.RESEND_API_KEY ? new Resend(process.env.RESEND_API_KEY) : null
const FROM = process.env.SMTP_FROM || 'noreply@etherealsmile.co.uk'
const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://etherealsmile.co.uk'

function getResend() {
  if (!resend) {
    console.warn('Resend not configured — skipping email send')
    return null
  }
  return resend
}

export async function sendConfirmationEmail({ to, name, date, time }) {
  const client = getResend()
  if (!client) return { success: false, skipped: true }

  const formattedDate = date
    ? new Date(date).toLocaleDateString('en-GB', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      })
    : 'TBC'

  try {
    await client.emails.send({
      from: FROM,
      to,
      subject: 'Your Ethereal Smile Booking is Confirmed',
      html: `
        <div style="font-family: 'Inter', sans-serif; max-width: 600px; margin: 0 auto; padding: 2rem; background: #000; color: #fff; border: 1px solid rgba(233,68,128,0.2); border-radius: 12px;">
          <h1 style="font-family: 'Pirata One', cursive; color: #e94480; font-size: 1.8rem; text-align: center; margin-bottom: 1.5rem;">Ethereal Smile</h1>
          
          <p style="color: rgba(255,255,255,0.8); font-size: 1rem; line-height: 1.6; margin-bottom: 1.5rem;">
            Hi ${name},<br/><br/>
            Your booking has been <strong style="color: #e94480;">confirmed</strong>. We look forward to seeing you.
          </p>
          
          <div style="background: rgba(233,68,128,0.08); border: 1px solid rgba(233,68,128,0.2); border-radius: 8px; padding: 1.25rem; margin-bottom: 1.5rem;">
            <p style="margin: 0; color: rgba(255,255,255,0.6); font-size: 0.85rem;"><strong style="color: #e94480;">Date:</strong> ${formattedDate}</p>
            <p style="margin: 0.5rem 0 0; color: rgba(255,255,255,0.6); font-size: 0.85rem;"><strong style="color: #e94480;">Time:</strong> ${time || 'TBC'}</p>
          </div>
          
          <p style="color: rgba(255,255,255,0.5); font-size: 0.8rem; text-align: center; margin-top: 2rem;">
            If you need to reschedule, please reply to this email or contact us at hattie@etherealsmile.co.uk
          </p>
        </div>
      `,
    })
    return { success: true }
  } catch (err) {
    console.error('Confirmation email failed:', err)
    return { success: false, error: err.message }
  }
}

export async function sendAlternativeProposalEmail({ to, name, originalDate, originalTime, proposedDate, proposedTime, token }) {
  const client = getResend()
  if (!client) return { success: false, skipped: true }

  const formattedOriginal = originalDate
    ? new Date(originalDate).toLocaleDateString('en-GB', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      })
    : 'TBC'

  const formattedProposed = proposedDate
    ? new Date(proposedDate).toLocaleDateString('en-GB', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      })
    : 'TBC'

  const acceptUrl = `${SITE_URL}/booking/confirm/${token}?action=accept`
  const rejectUrl = `${SITE_URL}/booking/confirm/${token}?action=reject`

  try {
    await client.emails.send({
      from: FROM,
      to,
      subject: 'Alternative Booking Proposal — Ethereal Smile',
      html: `
        <div style="font-family: 'Inter', sans-serif; max-width: 600px; margin: 0 auto; padding: 2rem; background: #000; color: #fff; border: 1px solid rgba(233,68,128,0.2); border-radius: 12px;">
          <h1 style="font-family: 'Pirata One', cursive; color: #e94480; font-size: 1.8rem; text-align: center; margin-bottom: 1.5rem;">Ethereal Smile</h1>
          
          <p style="color: rgba(255,255,255,0.8); font-size: 1rem; line-height: 1.6; margin-bottom: 1.5rem;">
            Hi ${name},<br/><br/>
            Unfortunately your preferred slot is not available. We'd like to propose an alternative:
          </p>
          
          <div style="background: rgba(255,255,255,0.03); border: 1px solid rgba(255,255,255,0.1); border-radius: 8px; padding: 1.25rem; margin-bottom: 1rem;">
            <p style="margin: 0; color: rgba(255,255,255,0.5); font-size: 0.85rem;">Your request: <strong>${formattedOriginal} at ${originalTime || 'TBC'}</strong></p>
          </div>
          
          <div style="background: rgba(233,68,128,0.08); border: 1px solid rgba(233,68,128,0.2); border-radius: 8px; padding: 1.25rem; margin-bottom: 1.5rem;">
            <p style="margin: 0; color: #e94480; font-size: 0.9rem; font-weight: 600;">Proposed alternative:</p>
            <p style="margin: 0.5rem 0 0; color: rgba(255,255,255,0.8); font-size: 1rem;"><strong>${formattedProposed} at ${proposedTime}</strong></p>
          </div>
          
          <div style="display: flex; gap: 1rem; margin-bottom: 1.5rem;">
            <a href="${acceptUrl}" style="flex: 1; display: block; text-align: center; padding: 0.875rem; background: rgba(76,175,80,0.2); color: #81c784; text-decoration: none; border-radius: 8px; border: 1px solid rgba(76,175,80,0.4); font-weight: 500;">Accept Proposal</a>
            <a href="${rejectUrl}" style="flex: 1; display: block; text-align: center; padding: 0.875rem; background: rgba(244,67,54,0.1); color: #e57373; text-decoration: none; border-radius: 8px; border: 1px solid rgba(244,67,54,0.3); font-weight: 500;">Decline</a>
          </div>
          
          <p style="color: rgba(255,255,255,0.4); font-size: 0.75rem; text-align: center;">
            This proposal expires in 48 hours. If you have questions, reply to this email.
          </p>
        </div>
      `,
    })
    return { success: true }
  } catch (err) {
    console.error('Proposal email failed:', err)
    return { success: false, error: err.message }
  }
}
