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

const emailStyles = `
  .email-wrapper { background: #000000; margin: 0; padding: 0; }
  .email-container { max-width: 600px; margin: 0 auto; background: #000000; border: 1px solid rgba(233, 68, 128, 0.25); border-radius: 16px; overflow: hidden; }
  .email-header { text-align: center; padding: 2.5rem 1.5rem 1.5rem; background: linear-gradient(180deg, rgba(233,68,128,0.08) 0%, transparent 100%); }
  .email-logo { width: 120px; height: auto; border-radius: 10px; display: block; margin: 0 auto 1rem; }
  .email-title { font-family: 'Pirata One', 'Playfair Display', Georgia, serif; font-size: 1.8rem; color: #e94480; letter-spacing: 0.1em; text-transform: uppercase; margin: 0; text-shadow: 0 0 20px rgba(233, 68, 128, 0.3); }
  .email-subtitle { font-family: 'Playfair Display', Georgia, serif; font-style: italic; font-size: 0.9rem; color: rgba(255,255,255,0.6); letter-spacing: 0.06em; margin: 0.5rem 0 0; }
  .email-body { padding: 1.5rem 2rem; }
  .email-text { font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif; font-size: 0.95rem; color: rgba(255,255,255,0.8); line-height: 1.7; margin: 0 0 1.5rem; }
  .email-box { background: rgba(233, 68, 128, 0.06); border: 1px solid rgba(233, 68, 128, 0.2); border-radius: 12px; padding: 1.25rem; margin-bottom: 1.5rem; }
  .email-box-label { font-family: 'Inter', sans-serif; font-size: 0.75rem; letter-spacing: 0.15em; text-transform: uppercase; color: rgba(255,255,255,0.4); margin: 0 0 0.5rem; }
  .email-box-value { font-family: 'Pirata One', 'Playfair Display', serif; font-size: 1.15rem; color: #e94480; margin: 0; letter-spacing: 0.05em; }
  .email-divider { height: 1px; background: linear-gradient(90deg, transparent, rgba(233,68,128,0.3), transparent); margin: 1.5rem 0; }
  .email-button { display: inline-block; padding: 0.875rem 2rem; border-radius: 50px; text-decoration: none; font-family: 'Inter', sans-serif; font-size: 0.8rem; font-weight: 500; letter-spacing: 0.15em; text-transform: uppercase; text-align: center; }
  .email-button-accept { background: rgba(76, 175, 80, 0.15); color: #81c784; border: 1px solid rgba(76, 175, 80, 0.4); }
  .email-button-reject { background: rgba(244, 67, 54, 0.08); color: #e57373; border: 1px solid rgba(244, 67, 54, 0.3); }
  .email-footer { text-align: center; padding: 1.5rem 2rem; border-top: 1px solid rgba(255,255,255,0.05); }
  .email-footer-text { font-family: 'Inter', sans-serif; font-size: 0.75rem; color: rgba(255,255,255,0.35); line-height: 1.6; margin: 0; }
  .sparkle { color: #e94480; font-size: 0.7rem; opacity: 0.6; }
  @media only screen and (max-width: 480px) {
    .email-body { padding: 1.5rem 1.25rem; }
    .email-title { font-size: 1.4rem; }
  }
`

function sparkles() {
  return `<span class="sparkle">&#10022;</span> <span class="sparkle">&#10022;</span> <span class="sparkle">&#10022;</span>`
}

export async function sendConfirmationEmail({ to, name, date, time, service, price }) {
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
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="utf-8" />
          <meta name="viewport" content="width=device-width, initial-scale=1" />
          <link href="https://fonts.googleapis.com/css2?family=Pirata+One&family=Playfair+Display:ital,wght@0,400;0,500;1,400&family=Inter:wght@300;400;500&display=swap" rel="stylesheet" />
          <style>${emailStyles}</style>
        </head>
        <body class="email-wrapper">
          <table width="100%" cellpadding="0" cellspacing="0" border="0">
            <tr><td align="center" style="padding: 2rem 1rem;">

              <div class="email-container">
                <div class="email-header">
                  <img src="${SITE_URL}/hero-logo-card.png" alt="Ethereal Smile" class="email-logo" />
                  <h1 class="email-title">Ethereal Smile</h1>
                  <p class="email-subtitle">${sparkles()} Your booking is confirmed ${sparkles()}</p>
                </div>

                <div class="email-body">
                  <p class="email-text">
                    Hi ${name},<br /><br />
                    Your appointment has been <strong style="color: #e94480;">confirmed</strong>. Hattie is looking forward to creating your sparkle.
                  </p>

                  <div class="email-box">
                    <p class="email-box-label">Date</p>
                    <p class="email-box-value">${formattedDate}</p>
                  </div>

                  <div class="email-box">
                    <p class="email-box-label">Time</p>
                    <p class="email-box-value">${time || 'TBC'}</p>
                  </div>

                  ${service ? `
                  <div class="email-box">
                    <p class="email-box-label">Service</p>
                    <p class="email-box-value">${service}${price ? ` <span style="font-size: 0.85rem; opacity: 0.7;">(${price})</span>` : ''}</p>
                  </div>
                  ` : ''}

                  <div class="email-divider"></div>

                  <p class="email-text" style="font-size: 0.85rem; color: rgba(255,255,255,0.5); text-align: center;">
                    If you need to reschedule, reply to this email or contact <a href="mailto:hattie@etherealsmile.co.uk" style="color: #e94480;">hattie@etherealsmile.co.uk</a>
                  </p>
                </div>

                <div class="email-footer">
                  <p class="email-footer-text">
                    Ethereal Smile by Hattie Clifford<br />
                    Genuine Swarovski &amp; Preciosa Crystal Tooth Gems<br />
                    <a href="${SITE_URL}" style="color: #e94480; text-decoration: none;">${SITE_URL.replace('https://', '')}</a>
                  </p>
                </div>
              </div>

            </td></tr>
          </table>
        </body>
        </html>
      `,
    })
    return { success: true, id: result?.data?.id || result?.id || null }
  } catch (err) {
    console.error('Confirmation email failed:', err)
    return { success: false, error: err.message }
  }
}

export async function sendAlternativeProposalEmail({ to, name, originalDate, originalTime, proposedDate, proposedTime, service, price, token }) {
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
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="utf-8" />
          <meta name="viewport" content="width=device-width, initial-scale=1" />
          <link href="https://fonts.googleapis.com/css2?family=Pirata+One&family=Playfair+Display:ital,wght@0,400;0,500;1,400&family=Inter:wght@300;400;500&display=swap" rel="stylesheet" />
          <style>${emailStyles}</style>
        </head>
        <body class="email-wrapper">
          <table width="100%" cellpadding="0" cellspacing="0" border="0">
            <tr><td align="center" style="padding: 2rem 1rem;">

              <div class="email-container">
                <div class="email-header">
                  <img src="${SITE_URL}/hero-logo-card.png" alt="Ethereal Smile" class="email-logo" />
                  <h1 class="email-title">Ethereal Smile</h1>
                  <p class="email-subtitle">${sparkles()} Alternative Proposal ${sparkles()}</p>
                </div>

                <div class="email-body">
                  <p class="email-text">
                    Hi ${name},<br /><br />
                    Unfortunately your preferred slot is no longer available. Hattie would love to see you and has proposed an alternative.
                  </p>

                  <div style="background: rgba(255,255,255,0.03); border: 1px solid rgba(255,255,255,0.08); border-radius: 12px; padding: 1.25rem; margin-bottom: 1.5rem;">
                    <p class="email-box-label">Your Original Request</p>
                    <p style="margin: 0.5rem 0 0; font-family: 'Inter', sans-serif; font-size: 0.9rem; color: rgba(255,255,255,0.6);">
                      <strong style="color: rgba(255,255,255,0.85);">${formattedOriginal}</strong> at ${originalTime || 'TBC'}
                    </p>
                  </div>

                  <div class="email-box" style="border-color: rgba(233, 68, 128, 0.35); background: rgba(233, 68, 128, 0.1);">
                    <p class="email-box-label" style="color: #e94480;">Proposed Alternative</p>
                    <p class="email-box-value">${formattedProposed}</p>
                    <p style="margin: 0.25rem 0 0; font-family: 'Inter', sans-serif; font-size: 1rem; color: #e94480;">at ${proposedTime}</p>
                  </div>

                  ${service ? `
                  <div class="email-box">
                    <p class="email-box-label">Service</p>
                    <p class="email-box-value">${service}${price ? ` <span style="font-size: 0.85rem; opacity: 0.7;">(${price})</span>` : ''}</p>
                  </div>
                  ` : ''}

                  <div class="email-divider"></div>

                  <table width="100%" cellpadding="0" cellspacing="0" border="0" style="margin-bottom: 1.5rem;">
                    <tr>
                      <td width="48%" valign="top">
                        <a href="${acceptUrl}" class="email-button email-button-accept" style="display: block; width: 100%; box-sizing: border-box;">Accept Proposal</a>
                      </td>
                      <td width="4%"></td>
                      <td width="48%" valign="top">
                        <a href="${rejectUrl}" class="email-button email-button-reject" style="display: block; width: 100%; box-sizing: border-box;">Decline</a>
                      </td>
                    </tr>
                  </table>

                  <p class="email-text" style="font-size: 0.8rem; color: rgba(255,255,255,0.4); text-align: center;">
                    This proposal expires in 48 hours. Questions? Reply to this email.
                  </p>
                </div>

                <div class="email-footer">
                  <p class="email-footer-text">
                    Ethereal Smile by Hattie Clifford<br />
                    Genuine Swarovski &amp; Preciosa Crystal Tooth Gems<br />
                    <a href="${SITE_URL}" style="color: #e94480; text-decoration: none;">${SITE_URL.replace('https://', '')}</a>
                  </p>
                </div>
              </div>

            </td></tr>
          </table>
        </body>
        </html>
      `,
    })
    return { success: true, id: result?.data?.id || result?.id || null }
  } catch (err) {
    console.error('Proposal email failed:', err)
    return { success: false, error: err.message }
  }
}

export async function sendNewBookingNotification({ name, email, phone, preferredDate, preferredTime, service, price, message }) {
  const client = getResend()
  if (!client) return { success: false, skipped: true }

  try {
    const result = await client.emails.send({
      from: FROM,
      to: 'hattie@etherealsmile.co.uk',
      subject: `New Enquiry from ${name}`,
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="utf-8" />
          <meta name="viewport" content="width=device-width, initial-scale=1" />
          <link href="https://fonts.googleapis.com/css2?family=Pirata+One&family=Playfair+Display:ital,wght@0,400;0,500;1,400&family=Inter:wght@300;400;500&display=swap" rel="stylesheet" />
          <style>${emailStyles}</style>
        </head>
        <body class="email-wrapper">
          <table width="100%" cellpadding="0" cellspacing="0" border="0">
            <tr><td align="center" style="padding: 2rem 1rem;">

              <div class="email-container">
                <div class="email-header">
                  <img src="${SITE_URL}/hero-logo-card.png" alt="Ethereal Smile" class="email-logo" />
                  <h1 class="email-title">New Enquiry</h1>
                  <p class="email-subtitle">${sparkles()} Someone wants to book ${sparkles()}</p>
                </div>

                <div class="email-body">
                  <div class="email-box">
                    <p class="email-box-label">Name</p>
                    <p class="email-box-value">${name}</p>
                  </div>

                  <div class="email-box">
                    <p class="email-box-label">Email</p>
                    <p class="email-box-value">${email}</p>
                  </div>

                  <div class="email-box">
                    <p class="email-box-label">Phone</p>
                    <p class="email-box-value">${phone}</p>
                  </div>

                  <div class="email-box">
                    <p class="email-box-label">Preferred Date</p>
                    <p class="email-box-value">${preferredDate}</p>
                  </div>

                  <div class="email-box">
                    <p class="email-box-label">Preferred Time</p>
                    <p class="email-box-value">${preferredTime}</p>
                  </div>

                  ${service !== 'Not specified' ? `
                  <div class="email-box">
                    <p class="email-box-label">Service</p>
                    <p class="email-box-value">${service}${price !== 'Not specified' ? ` <span style="font-size: 0.85rem; opacity: 0.7;">(${price})</span>` : ''}</p>
                  </div>
                  ` : ''}

                  ${message !== 'None' ? `
                  <div class="email-box">
                    <p class="email-box-label">Message</p>
                    <p style="margin: 0; font-family: 'Inter', sans-serif; font-size: 0.9rem; color: rgba(255,255,255,0.8); line-height: 1.6;">${message.replace(/\n/g, '<br/>')}</p>
                  </div>
                  ` : ''}

                  <div class="email-divider"></div>

                  <div style="text-align: center;">
                    <a href="${SITE_URL}/admin/bookings" class="email-button email-button-accept" style="display: inline-block; padding: 0.875rem 2rem; border-radius: 50px; text-decoration: none; font-family: 'Inter', sans-serif; font-size: 0.8rem; font-weight: 500; letter-spacing: 0.15em; text-transform: uppercase; background: rgba(233, 68, 128, 0.15); color: #e94480; border: 1px solid rgba(233, 68, 128, 0.4);">
                      View in Admin
                    </a>
                  </div>
                </div>

                <div class="email-footer">
                  <p class="email-footer-text">
                    Ethereal Smile by Hattie Clifford<br />
                    <a href="${SITE_URL}" style="color: #e94480; text-decoration: none;">${SITE_URL.replace('https://', '')}</a>
                  </p>
                </div>
              </div>

            </td></tr>
          </table>
        </body>
        </html>
      `,
    })
    return { success: true, id: result?.data?.id || result?.id || null }
  } catch (err) {
    console.error('New enquiry notification failed:', err)
    return { success: false, error: err.message }
  }
}

export async function sendConsentRequestEmail({ to, name, documentType, documentTitle, pdfUrl, token }) {
  const client = getResend()
  if (!client) return { success: false, skipped: true }

  const consentUrl = `${SITE_URL}/consent/${token}`
  const docTypeLabel = {
    consent: 'Consent Form',
    consultation: 'Consultation Form',
    guardian_consent: 'Guardian Consent Form',
    aftercare: 'Aftercare Information',
  }[documentType] || documentTitle

  try {
    const result = await client.emails.send({
      from: FROM,
      to,
      subject: `Action Required: Please sign your ${docTypeLabel} — Ethereal Smile`,
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="utf-8" />
          <meta name="viewport" content="width=device-width, initial-scale=1" />
          <link href="https://fonts.googleapis.com/css2?family=Pirata+One&family=Playfair+Display:ital,wght@0,400;0,500;1,400&family=Inter:wght@300;400;500&display=swap" rel="stylesheet" />
          <style>${emailStyles}</style>
        </head>
        <body class="email-wrapper">
          <table width="100%" cellpadding="0" cellspacing="0" border="0">
            <tr><td align="center" style="padding: 2rem 1rem;">

              <div class="email-container">
                <div class="email-header">
                  <img src="${SITE_URL}/hero-logo-card.png" alt="Ethereal Smile" class="email-logo" />
                  <h1 class="email-title">Ethereal Smile</h1>
                  <p class="email-subtitle">${sparkles()} ${docTypeLabel} ${sparkles()}</p>
                </div>

                <div class="email-body">
                  <p class="email-text">
                    Hi ${name},<br /><br />
                    Before your appointment, we need you to review and sign your <strong style="color: #e94480;">${docTypeLabel}</strong>. This is a legal requirement for your safety and ensures we have all the information we need to provide you with the best care.
                  </p>

                  <div class="email-box" style="border-color: rgba(233, 68, 128, 0.35); background: rgba(233, 68, 128, 0.1);">
                    <p class="email-box-label" style="color: #e94480;">What you need to do</p>
                    <p style="margin: 0.5rem 0 0; font-family: 'Inter', sans-serif; font-size: 0.95rem; color: rgba(255,255,255,0.8); line-height: 1.7;">
                      1. Click the button below to open your form<br />
                      2. Read the document carefully<br />
                      3. Fill in the required information<br />
                      4. Sign and submit
                    </p>
                  </div>

                  ${documentType === 'guardian_consent' ? `
                  <div class="email-box">
                    <p class="email-box-label">Important</p>
                    <p style="margin: 0.5rem 0 0; font-family: 'Inter', sans-serif; font-size: 0.9rem; color: rgba(255,255,255,0.7); line-height: 1.6;">
                      As a parent or guardian, you will also need to complete a medical consultation form on behalf of the young person. Both forms will be presented together.
                    </p>
                  </div>
                  ` : ''}

                  <div style="text-align: center; margin: 2rem 0;">
                    <a href="${consentUrl}" class="email-button" style="display: inline-block; background: rgba(233, 68, 128, 0.15); color: #e94480; border: 1px solid rgba(233, 68, 128, 0.4); padding: 0.875rem 2.5rem; border-radius: 50px; text-decoration: none; font-family: 'Inter', sans-serif; font-size: 0.8rem; font-weight: 500; letter-spacing: 0.15em; text-transform: uppercase;">
                      Review &amp; Sign Your Form
                    </a>
                  </div>

                  <div style="text-align: center; margin: 1rem 0;">
                    <a href="${pdfUrl}" style="font-family: 'Inter', sans-serif; font-size: 0.8rem; color: rgba(255,255,255,0.4); text-decoration: underline;">Download PDF copy</a>
                  </div>

                  <div class="email-divider"></div>

                  <p class="email-text" style="font-size: 0.8rem; color: rgba(255,255,255,0.4); text-align: center;">
                    This link expires in 7 days. If you have any questions, contact <a href="mailto:hattie@etherealsmile.co.uk" style="color: #e94480;">hattie@etherealsmile.co.uk</a>
                  </p>
                </div>

                <div class="email-footer">
                  <p class="email-footer-text">
                    Ethereal Smile by Hattie Clifford<br />
                    Genuine Swarovski &amp; Preciosa Crystal Tooth Gems<br />
                    <a href="${SITE_URL}" style="color: #e94480; text-decoration: none;">${SITE_URL.replace('https://', '')}</a>
                  </p>
                </div>
              </div>

            </td></tr>
          </table>
        </body>
        </html>
      `,
    })
    return { success: true, id: result?.data?.id || result?.id || null }
  } catch (err) {
    console.error('Consent request email failed:', err)
    return { success: false, error: err.message }
  }
}

export async function sendConsentSignedNotification({ clientName, clientEmail, documentType, signatoryName, signatoryRelationship }) {
  const client = getResend()
  if (!client) return { success: false, skipped: true }

  const docTypeLabel = {
    consent: 'Consent Form',
    consultation: 'Consultation Form',
    guardian_consent: 'Guardian Consent Form',
    aftercare: 'Aftercare Form',
  }[documentType] || documentType

  try {
    const result = await client.emails.send({
      from: FROM,
      to: 'hattie@etherealsmile.co.uk',
      subject: `Consent Signed: ${docTypeLabel} by ${signatoryName}`,
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="utf-8" />
          <meta name="viewport" content="width=device-width, initial-scale=1" />
          <style>${emailStyles}</style>
        </head>
        <body class="email-wrapper">
          <table width="100%" cellpadding="0" cellspacing="0" border="0">
            <tr><td align="center" style="padding: 2rem 1rem;">

              <div class="email-container">
                <div class="email-header">
                  <img src="${SITE_URL}/hero-logo-card.png" alt="Ethereal Smile" class="email-logo" />
                  <h1 class="email-title">Consent Signed</h1>
                </div>

                <div class="email-body">
                  <p class="email-text">
                    <strong style="color: #4ade80;">${signatoryName}</strong> has signed the <strong style="color: #e94480;">${docTypeLabel}</strong> for <strong>${clientName}</strong>.
                  </p>

                  <div class="email-box">
                    <p class="email-box-label">Signed By</p>
                    <p class="email-box-value">${signatoryName} <span style="font-size: 0.75rem; opacity: 0.6;">(${signatoryRelationship})</span></p>
                  </div>

                  <div class="email-box">
                    <p class="email-box-label">Client</p>
                    <p class="email-box-value">${clientName} <span style="font-size: 0.75rem; opacity: 0.6;">&lt;${clientEmail}&gt;</span></p>
                  </div>

                  <div class="email-divider"></div>

                  <div style="text-align: center;">
                    <a href="${SITE_URL}/admin/clients" class="email-button email-button-accept" style="display: inline-block; padding: 0.875rem 2rem; border-radius: 50px; text-decoration: none; font-family: 'Inter', sans-serif; font-size: 0.8rem; font-weight: 500; letter-spacing: 0.15em; text-transform: uppercase;">
                      View in Admin
                    </a>
                  </div>
                </div>

                <div class="email-footer">
                  <p class="email-footer-text">
                    Ethereal Smile by Hattie Clifford<br />
                    <a href="${SITE_URL}" style="color: #e94480; text-decoration: none;">${SITE_URL.replace('https://', '')}</a>
                  </p>
                </div>
              </div>

            </td></tr>
          </table>
        </body>
        </html>
      `,
    })
    return { success: true, id: result?.data?.id || result?.id || null }
  } catch (err) {
    console.error('Consent signed notification failed:', err)
    return { success: false, error: err.message }
  }
}

export async function sendConsentConfirmationEmail({ to, name, documentType, documentTitle, pdfUrl }) {
  const client = getResend()
  if (!client) return { success: false, skipped: true }

  const docTypeLabel = {
    consent: 'Consent Form',
    consultation: 'Consultation Form',
    guardian_consent: 'Guardian Consent Form',
    aftercare: 'Aftercare Information',
  }[documentType] || documentTitle

  try {
    const result = await client.emails.send({
      from: FROM,
      to,
      subject: `Your ${docTypeLabel} has been signed - Ethereal Smile`,
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="utf-8" />
          <meta name="viewport" content="width=device-width, initial-scale=1" />
          <style>${emailStyles}</style>
        </head>
        <body class="email-wrapper">
          <table width="100%" cellpadding="0" cellspacing="0" border="0">
            <tr><td align="center" style="padding: 2rem 1rem;">

              <div class="email-container">
                <div class="email-header">
                  <img src="${SITE_URL}/hero-logo-card.png" alt="Ethereal Smile" class="email-logo" />
                  <h1 class="email-title">Ethereal Smile</h1>
                  <p class="email-subtitle">${sparkles()} Form Signed ${sparkles()}</p>
                </div>

                <div class="email-body">
                  <p class="email-text">
                    Hi ${name},<br /><br />
                    Your <strong style="color: #e94480;">${docTypeLabel}</strong> has been signed and submitted successfully. A copy of the signed document is attached for your records.
                  </p>

                  <div style="text-align: center; margin: 1.5rem 0;">
                    <a href="${pdfUrl}" style="display: inline-block; padding: 0.8rem 1.5rem; border-radius: 50px; background: rgba(233, 68, 128, 0.15); color: #e94480; border: 1px solid rgba(233, 68, 128, 0.4); text-decoration: none; font-family: 'Inter', sans-serif; font-size: 0.8rem; font-weight: 500; letter-spacing: 0.1em; text-transform: uppercase;">
                      Download Your Copy
                    </a>
                  </div>

                  <div class="email-divider"></div>

                  <p class="email-text" style="font-size: 0.8rem; color: rgba(255,255,255,0.5); text-align: center;">
                    This is an automated confirmation. If you did not sign this form, please contact us immediately at <a href="mailto:hattie@etherealsmile.co.uk" style="color: #e94480;">hattie@etherealsmile.co.uk</a>
                  </p>
                </div>

                <div class="email-footer">
                  <p class="email-footer-text">
                    Ethereal Smile by Hattie Clifford<br />
                    <a href="${SITE_URL}" style="color: #e94480; text-decoration: none;">${SITE_URL.replace('https://', '')}</a>
                  </p>
                </div>
              </div>

            </td></tr>
          </table>
        </body>
        </html>
      `,
    })
    return { success: true, id: result?.data?.id || result?.id || null }
  } catch (err) {
    console.error('Consent confirmation email failed:', err)
    return { success: false, error: err.message }
  }
}
