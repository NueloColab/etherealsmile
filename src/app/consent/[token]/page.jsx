'use client'

import { useState, useEffect } from 'react'
import { useParams } from 'next/navigation'

const DOCUMENT_TYPES = {
  consent: {
    title: 'Ethereal Smile Consent Form',
    requiresMedical: true,
    requiresSignature: true,
    defaultRelationship: 'self',
  },
  consultation: {
    title: 'Tooth Jewellery Consultation Form',
    requiresMedical: true,
    requiresSignature: true,
    defaultRelationship: 'self',
  },
  guardian_consent: {
    title: 'Guardian Consent Form',
    requiresMedical: false,
    requiresSignature: true,
    defaultRelationship: 'parent',
  },
  aftercare: {
    title: 'Tooth Jewellery Aftercare',
    requiresMedical: false,
    requiresSignature: false,
    defaultRelationship: 'self',
  },
}

// Light/clean theme colours
const PINK = '#e94480'
const PINK_LIGHT = 'rgba(233,68,128,0.06)'
const PINK_BORDER = 'rgba(233,68,128,0.2)'
const PINK_MID = 'rgba(233,68,128,0.12)'
const TEXT = '#1a1a1a'
const TEXT_SEC = 'rgba(0,0,0,0.55)'
const TEXT_TER = 'rgba(0,0,0,0.35)'
const DIVIDER = 'rgba(0,0,0,0.08)'

export default function ConsentPage() {
  const params = useParams()
  const [record, setRecord] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [signed, setSigned] = useState(false)
  const [signedPdfUrl, setSignedPdfUrl] = useState(null)

  const [fullName, setFullName] = useState('')
  const [dateOfBirth, setDateOfBirth] = useState('')
  const [age, setAge] = useState('')
  const [phone, setPhone] = useState('')
  const [email, setEmail] = useState('')
  const [address, setAddress] = useState('')
  const [allergies, setAllergies] = useState('')
  const [medicalConditions, setMedicalConditions] = useState({
    abscessOrUlcer: false,
    ongoingDentalProblems: false,
    falseToothOrVeneers: false,
    pregnantOrBreastfeeding: false,
    invisalignOrRetainer: false,
    halitosis: false,
    oralHerpes: false,
    recentDentalSurgery: false,
    sensitiveTeeth: false,
  })
  const [illnessInLast48h, setIllnessInLast48h] = useState(false)
  const [consentAgreed, setConsentAgreed] = useState(false)

  const [youngPersonName, setYoungPersonName] = useState('')
  const [youngPersonDOB, setYoungPersonDOB] = useState('')
  const [guardianName, setGuardianName] = useState('')
  const [guardianRelationship, setGuardianRelationship] = useState('parent')
  const [guardianAddress, setGuardianAddress] = useState('')
  const [guardianPostcode, setGuardianPostcode] = useState('')
  const [guardianPhone, setGuardianPhone] = useState('')
  const [consentStatementAgreed, setConsentStatementAgreed] = useState(false)

  const [readAcknowledged, setReadAcknowledged] = useState(false)
  const [signatoryName, setSignatoryName] = useState('')

  useEffect(function() {
    fetch('/api/consent/' + params.token)
      .then(function(r) {
        if (!r.ok) return r.json().then(function(err) { throw new Error(err.error || 'Failed to load') })
        return r.json()
      })
      .then(function(data) {
        setRecord(data)
        setLoading(false)
      })
      .catch(function(err) {
        setError(err.message)
        setLoading(false)
      })
  }, [params.token])

  if (loading) {
    return (
      <div style={{ padding: '3rem 1.5rem', textAlign: 'center' }}>
        <div style={{ display: 'inline-block', width: '24px', height: '24px', border: '2px solid ' + PINK, borderTopColor: 'transparent', borderRadius: '50%', animation: 'eth-spin 0.8s linear infinite' }} />
        <style>{'@keyframes eth-spin { to { transform: rotate(360deg) } }'}</style>
        <p style={{ marginTop: '1rem', color: TEXT_SEC, fontSize: '0.9rem' }}>Loading your form...</p>
      </div>
    )
  }

  if (error) {
    return (
      <div style={{ padding: '3rem 1.5rem', maxWidth: '500px', margin: '0 auto', textAlign: 'center' }}>
        <div style={{ fontSize: '2.5rem', marginBottom: '1rem' }}>&#9888;</div>
        <h2 style={{ fontFamily: "'Playfair Display', serif", color: PINK, fontSize: '1.4rem', margin: '0 0 0.75rem' }}>Form Not Found</h2>
        <p style={{ color: TEXT_SEC, fontSize: '0.9rem', lineHeight: 1.6 }}>{error}</p>
        <p style={{ color: TEXT_TER, fontSize: '0.8rem', marginTop: '1rem' }}>Contact <a href="mailto:hattie@etherealsmile.co.uk" style={{ color: PINK }}>hattie@etherealsmile.co.uk</a> if you believe this is an error.</p>
      </div>
    )
  }

  if (signed) {
    var docTitle = (DOCUMENT_TYPES[record.documentType] || {}).title || 'consent form'
    return (
      <div style={{ padding: '3rem 1.5rem', maxWidth: '500px', margin: '0 auto', textAlign: 'center' }}>
        <div style={{ width: '64px', height: '64px', borderRadius: '50%', background: 'rgba(34,197,94,0.1)', border: '2px solid rgba(34,197,94,0.3)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1.5rem' }}>
          <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#22c55e" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>
        </div>
        <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: '1.6rem', color: TEXT, margin: '0 0 0.75rem' }}>Thank You</h2>
        <p style={{ color: TEXT_SEC, fontSize: '0.95rem', lineHeight: 1.6, margin: '0 0 1.5rem' }}>
          Your <strong style={{ color: PINK }}>{docTitle}</strong> has been signed and submitted.
        </p>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', alignItems: 'center' }}>
          {signedPdfUrl && (
            <a href={signedPdfUrl} target="_blank" rel="noopener noreferrer" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', padding: '0.7rem 1.5rem', borderRadius: '8px', background: PINK, color: '#fff', border: 'none', fontSize: '0.85rem', fontWeight: 600, letterSpacing: '0.08em', textDecoration: 'none', textTransform: 'uppercase' }}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path><polyline points="7 10 12 15 17 10"></polyline><line x1="12" y1="15" x2="12" y2="3"></line></svg>
              Download Signed PDF
            </a>
          )}
          {record.pdfUrl && (
            <a href={record.pdfUrl} target="_blank" rel="noopener noreferrer" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', padding: '0.6rem 1.25rem', borderRadius: '8px', background: PINK_MID, color: PINK, border: '1px solid ' + PINK_BORDER, fontSize: '0.8rem', fontWeight: 500, letterSpacing: '0.06em', textDecoration: 'none', textTransform: 'uppercase' }}>
              View Original Document
            </a>
          )}
        </div>
        <p style={{ color: TEXT_TER, fontSize: '0.8rem', marginTop: '1.5rem', lineHeight: 1.5 }}>
          A confirmation with your signed PDF has been sent to your email.
        </p>
      </div>
    )
  }

  if (record.status === 'signed') {
    return (
      <div style={{ padding: '3rem 1.5rem', maxWidth: '500px', margin: '0 auto', textAlign: 'center' }}>
        <div style={{ width: '64px', height: '64px', borderRadius: '50%', background: 'rgba(34,197,94,0.1)', border: '2px solid rgba(34,197,94,0.3)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1.5rem' }}>
          <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#22c55e" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>
        </div>
        <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: '1.5rem', color: TEXT, margin: '0 0 0.75rem' }}>Already Signed</h2>
        <p style={{ color: TEXT_SEC, fontSize: '0.9rem', lineHeight: 1.6 }}>This form has already been signed. No further action is needed.</p>
      </div>
    )
  }

  if (record.status === 'declined') {
    return (
      <div style={{ padding: '3rem 1.5rem', maxWidth: '500px', margin: '0 auto', textAlign: 'center' }}>
        <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: '1.5rem', color: TEXT, margin: '0 0 0.75rem' }}>Consent Declined</h2>
        <p style={{ color: TEXT_SEC, fontSize: '0.9rem' }}>This form was previously declined.</p>
      </div>
    )
  }

  var docConfig = DOCUMENT_TYPES[record.documentType] || DOCUMENT_TYPES.consent

  var inputStyle = { width: '100%', padding: '0.75rem 0.875rem', background: '#fff', border: '1px solid #e0e0e0', borderRadius: '8px', color: TEXT, fontSize: '0.9rem', outline: 'none', fontFamily: "'Inter', sans-serif", boxSizing: 'border-box', transition: 'border-color 0.2s ease' }
  var labelStyle = { display: 'block', fontSize: '0.7rem', letterSpacing: '0.1em', textTransform: 'uppercase', color: TEXT_SEC, marginBottom: '0.25rem', marginTop: '1rem', fontWeight: 500 }
  var checkboxStyle = { accentColor: PINK, width: '18px', height: '18px', marginRight: '0.5rem', cursor: 'pointer' }

  function handleSubmit(e) {
    e.preventDefault()
    setSubmitting(true)
    setError('')

    var responses = {}

    if (docConfig.requiresMedical) {
      responses.fullName = fullName
      responses.dateOfBirth = dateOfBirth
      responses.age = age
      responses.phone = phone
      responses.email = email
      responses.address = address
      responses.allergies = allergies
      responses.medicalConditions = Object.assign({}, medicalConditions)
      responses.illnessInLast48h = illnessInLast48h
      responses.consentAgreed = consentAgreed
    }

    if (record.documentType === 'guardian_consent') {
      responses.youngPersonName = youngPersonName
      responses.youngPersonDOB = youngPersonDOB
      responses.guardianName = guardianName
      responses.guardianRelationship = guardianRelationship
      responses.guardianAddress = guardianAddress
      responses.guardianPostcode = guardianPostcode
      responses.guardianPhone = guardianPhone
      responses.consentStatementAgreed = consentStatementAgreed
    }

    if (record.documentType === 'aftercare') {
      responses.readAcknowledged = readAcknowledged
    }

    fetch('/api/consent/' + params.token, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        signatoryName: signatoryName,
        signatoryRelationship: docConfig.defaultRelationship,
        responses: responses,
        action: record.documentType === 'aftercare' ? undefined : 'sign',
      }),
    })
    .then(function(r) { return r.json().then(function(data) { return { ok: r.ok, status: r.status, data: data } }) })
    .then(function(result) {
      if (!result.ok) {
        if (result.status === 403) {
          setError('This form has already been signed and cannot be modified.')
        } else if (result.status === 410) {
          setError('This form has expired. Please contact us for a new one.')
        } else {
          setError(result.data.error || 'Failed to submit')
        }
        setSubmitting(false)
        return
      }
      setSigned(true)
      setSignedPdfUrl(result.data.signedPdfUrl || null)
      setSubmitting(false)
    })
    .catch(function() {
      setError('Failed to submit. Please try again.')
      setSubmitting(false)
    })
  }

  var medicalLabels = {
    abscessOrUlcer: 'Abscess or ulcer',
    ongoingDentalProblems: 'Ongoing dental problems',
    falseToothOrVeneers: 'False tooth or veneers',
    pregnantOrBreastfeeding: 'Pregnant or breastfeeding',
    invisalignOrRetainer: 'Invisalign or retainer',
    halitosis: 'Halitosis (bad breath)',
    oralHerpes: 'Oral herpes / cold sores',
    recentDentalSurgery: 'Recent dental surgery',
    sensitiveTeeth: 'Sensitive teeth',
  }

  return (
    <div style={{ padding: '1.5rem', maxWidth: '560px', margin: '0 auto', fontFamily: "'Inter', sans-serif", color: TEXT }}>
      {/* Logo / Brand header */}
      <div style={{ textAlign: 'center', marginBottom: '2rem', padding: '1.5rem', background: PINK_LIGHT, borderRadius: '12px', border: '1px solid ' + PINK_BORDER }}>
        <h1 style={{ fontFamily: "'Playfair Display', serif", fontSize: '1.4rem', color: PINK, letterSpacing: '0.05em', margin: 0 }}>{docConfig.title}</h1>
        <p style={{ fontSize: '0.8rem', color: TEXT_SEC, marginTop: '0.4rem' }}>Ethereal Smile by Hattie Clifford</p>
      </div>

      {record.pdfUrl && (
        <div style={{ textAlign: 'center', marginBottom: '1.5rem' }}>
          <a href={record.pdfUrl} target="_blank" rel="noopener noreferrer" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', padding: '0.6rem 1.25rem', borderRadius: '8px', background: PINK_MID, color: PINK, border: '1px solid ' + PINK_BORDER, fontSize: '0.8rem', fontWeight: 500, letterSpacing: '0.06em', textDecoration: 'none', textTransform: 'uppercase' }}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path><polyline points="7 10 12 15 17 10"></polyline><line x1="12" y1="15" x2="12" y2="3"></line></svg>
            Download PDF
          </a>
          <p style={{ fontSize: '0.75rem', color: TEXT_TER, marginTop: '0.4rem' }}>Opens in a new tab. Please read before signing.</p>
        </div>
      )}

      <form onSubmit={handleSubmit}>
        {docConfig.requiresMedical && (
          <div>
            <div style={{ borderTop: '1px solid ' + DIVIDER, paddingTop: '1.25rem', marginBottom: '0.75rem' }}>
              <h3 style={{ fontFamily: "'Playfair Display', serif", fontSize: '1.05rem', color: TEXT, margin: 0 }}>Personal Details</h3>
            </div>

            <label style={labelStyle}>Full Name *</label>
            <input type="text" value={fullName} onChange={function(e) { setFullName(e.target.value) }} required style={inputStyle} placeholder="Your full name" />

            <label style={labelStyle}>Date of Birth</label>
            <input type="date" value={dateOfBirth} onChange={function(e) { setDateOfBirth(e.target.value) }} style={inputStyle} />

            <label style={labelStyle}>Age</label>
            <input type="text" value={age} onChange={function(e) { setAge(e.target.value) }} style={inputStyle} placeholder="Your age" />

            <label style={labelStyle}>Phone</label>
            <input type="tel" value={phone} onChange={function(e) { setPhone(e.target.value) }} style={inputStyle} placeholder="+44 ..." />

            <label style={labelStyle}>Email</label>
            <input type="email" value={email} onChange={function(e) { setEmail(e.target.value) }} style={inputStyle} placeholder="your@email.com" />

            <label style={labelStyle}>Address</label>
            <textarea value={address} onChange={function(e) { setAddress(e.target.value) }} rows={2} style={Object.assign({}, inputStyle, { resize: 'vertical' })} placeholder="Your home address" />

            <div style={{ borderTop: '1px solid ' + DIVIDER, paddingTop: '1.25rem', marginTop: '1rem', marginBottom: '0.75rem' }}>
              <h3 style={{ fontFamily: "'Playfair Display', serif", fontSize: '1.05rem', color: TEXT, margin: 0 }}>Medical History</h3>
              <p style={{ fontSize: '0.75rem', color: TEXT_TER, marginTop: '0.2rem' }}>Please tick any conditions that apply</p>
            </div>

            <label style={labelStyle}>Allergies</label>
            <input type="text" value={allergies} onChange={function(e) { setAllergies(e.target.value) }} style={inputStyle} placeholder="None, or list allergies" />

            {Object.keys(medicalConditions).map(function(key) {
              return (
                <label key={key} style={{ display: 'flex', alignItems: 'center', padding: '0.5rem 0', borderBottom: '1px solid #f0f0f0', cursor: 'pointer' }}>
                  <input type="checkbox" checked={medicalConditions[key]} onChange={function(e) { setMedicalConditions(function(prev) { var next = Object.assign({}, prev); next[key] = e.target.checked; return next }) }} style={checkboxStyle} />
                  <span style={{ fontSize: '0.9rem', color: TEXT }}>{medicalLabels[key] || key}</span>
                </label>
              )
            })}

            <label style={{ display: 'flex', alignItems: 'center', padding: '0.5rem 0', cursor: 'pointer' }}>
              <input type="checkbox" checked={illnessInLast48h} onChange={function(e) { setIllnessInLast48h(e.target.checked) }} style={checkboxStyle} />
              <span style={{ fontSize: '0.9rem', color: TEXT }}>Have you had vomiting, diarrhoea, or any infection in the last 48 hours?</span>
            </label>
          </div>
        )}

        {record.documentType === 'guardian_consent' && (
          <div>
            <div style={{ borderTop: '1px solid ' + DIVIDER, paddingTop: '1.25rem', marginBottom: '0.75rem' }}>
              <h3 style={{ fontFamily: "'Playfair Display', serif", fontSize: '1.05rem', color: TEXT, margin: 0 }}>Young Person's Details</h3>
            </div>

            <label style={labelStyle}>Young Person's Full Name *</label>
            <input type="text" value={youngPersonName} onChange={function(e) { setYoungPersonName(e.target.value) }} required style={inputStyle} placeholder="Child or young person's full name" />

            <label style={labelStyle}>Young Person's Date of Birth *</label>
            <input type="date" value={youngPersonDOB} onChange={function(e) { setYoungPersonDOB(e.target.value) }} required style={inputStyle} />

            <div style={{ borderTop: '1px solid ' + DIVIDER, paddingTop: '1.25rem', marginTop: '1rem', marginBottom: '0.75rem' }}>
              <h3 style={{ fontFamily: "'Playfair Display', serif", fontSize: '1.05rem', color: TEXT, margin: 0 }}>Guardian's Details</h3>
            </div>

            <label style={labelStyle}>Guardian's Full Name *</label>
            <input type="text" value={guardianName} onChange={function(e) { setGuardianName(e.target.value) }} required style={inputStyle} placeholder="Your full name" />

            <label style={labelStyle}>Relationship to Young Person *</label>
            <select value={guardianRelationship} onChange={function(e) { setGuardianRelationship(e.target.value) }} required style={Object.assign({}, inputStyle, { appearance: 'auto' })}>
              <option value="parent">Parent</option>
              <option value="guardian">Legal Guardian</option>
            </select>

            <label style={labelStyle}>Address *</label>
            <textarea value={guardianAddress} onChange={function(e) { setGuardianAddress(e.target.value) }} required rows={2} style={Object.assign({}, inputStyle, { resize: 'vertical' })} placeholder="Your home address" />

            <label style={labelStyle}>Postcode *</label>
            <input type="text" value={guardianPostcode} onChange={function(e) { setGuardianPostcode(e.target.value) }} required style={inputStyle} placeholder="SW1A 1AA" />

            <label style={labelStyle}>Contact Number *</label>
            <input type="tel" value={guardianPhone} onChange={function(e) { setGuardianPhone(e.target.value) }} required style={inputStyle} placeholder="+44 ..." />
          </div>
        )}

        {record.documentType === 'aftercare' && (
          <div style={{ borderTop: '1px solid ' + DIVIDER, paddingTop: '1.25rem' }}>
            <p style={{ fontSize: '0.9rem', color: TEXT_SEC, lineHeight: 1.6, marginBottom: '1.5rem' }}>
              Please download and read the aftercare information using the link above. Once you have read and understood it, check the box below to confirm.
            </p>
            <label style={{ display: 'flex', alignItems: 'flex-start', gap: '0.75rem', cursor: 'pointer', padding: '1rem', background: PINK_LIGHT, borderRadius: '8px', border: '1px solid ' + PINK_BORDER }}>
              <input type="checkbox" checked={readAcknowledged} onChange={function(e) { setReadAcknowledged(e.target.checked) }} style={Object.assign({}, checkboxStyle, { marginTop: '2px' })} />
              <span style={{ fontSize: '0.9rem', color: TEXT, lineHeight: 1.5 }}>
                I have read and understood the aftercare information, and I will follow the instructions provided.
              </span>
            </label>
          </div>
        )}

        {docConfig.requiresSignature && (
          <div style={{ borderTop: '1px solid ' + DIVIDER, paddingTop: '1.25rem', marginTop: '1.5rem' }}>
            <h3 style={{ fontFamily: "'Playfair Display', serif", fontSize: '1.05rem', color: TEXT, margin: '0 0 1rem' }}>Declaration and Signature</h3>

            <label style={{ display: 'flex', alignItems: 'flex-start', gap: '0.75rem', cursor: 'pointer', padding: '1rem', background: PINK_LIGHT, borderRadius: '8px', border: '1px solid ' + PINK_BORDER, marginBottom: '1.25rem' }}>
              <input type="checkbox" checked={consentAgreed} onChange={function(e) { setConsentAgreed(e.target.checked) }} style={Object.assign({}, checkboxStyle, { marginTop: '2px' })} required />
              <span style={{ fontSize: '0.9rem', color: TEXT, lineHeight: 1.5 }}>
                I confirm that the information I have provided is accurate and complete. I consent to the tooth jewellery procedure being carried out and agree to follow all aftercare instructions.
              </span>
            </label>

            <label style={labelStyle}>Full Name (signature) *</label>
            <input type="text" value={signatoryName} onChange={function(e) { setSignatoryName(e.target.value) }} required style={inputStyle} placeholder="Type your full name as your signature" />

            <p style={{ fontSize: '0.7rem', color: TEXT_TER, marginTop: '0.4rem', lineHeight: 1.5 }}>
              By typing your name above, you are signing this form electronically. This has the same legal effect as a handwritten signature.
            </p>
          </div>
        )}

        <button
          type="submit"
          disabled={submitting || (docConfig.requiresSignature && (!consentAgreed || !signatoryName.trim())) || (!docConfig.requiresSignature && !readAcknowledged)}
          style={{ width: '100%', padding: '0.9rem', borderRadius: '50px', border: 'none', background: submitting ? '#f0f0f0' : PINK, color: submitting ? TEXT_TER : '#fff', fontSize: '0.85rem', fontWeight: 600, letterSpacing: '0.1em', textTransform: 'uppercase', cursor: submitting ? 'not-allowed' : 'pointer', fontFamily: "'Inter', sans-serif", marginTop: '1.75rem', transition: 'background 0.2s ease' }}
        >
          {submitting ? 'Submitting...' : record.documentType === 'aftercare' ? 'I Confirm' : 'Sign and Submit'}
        </button>

        {error && (
          <div style={{ marginTop: '1rem', padding: '0.75rem 1rem', background: 'rgba(239,68,68,0.06)', border: '1px solid rgba(239,68,68,0.2)', borderRadius: '8px', color: '#dc2626', fontSize: '0.85rem' }}>
            {error}
          </div>
        )}
      </form>

      <p style={{ fontSize: '0.7rem', color: TEXT_TER, textAlign: 'center', marginTop: '2rem', lineHeight: 1.5 }}>
        This form is processed by Ethereal Smile. Your data is handled in accordance with UK GDPR.
      </p>
    </div>
  )
}