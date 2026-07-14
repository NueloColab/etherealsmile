'use client'

import { useState, useEffect } from 'react'
import { useParams } from 'next/navigation'

const DOCUMENT_TYPES = {
  consent: {
    title: 'Ethereal Smile Consent Form',
    requiresMedical: true,
    requiresSignature: true,
    relationshipOptions: ['self'],
    defaultRelationship: 'self',
  },
  consultation: {
    title: 'Tooth Jewellery Consultation Form',
    requiresMedical: true,
    requiresSignature: true,
    relationshipOptions: ['self', 'parent', 'guardian'],
    defaultRelationship: 'self',
  },
  guardian_consent: {
    title: 'Guardian Consent Form',
    requiresMedical: false,
    requiresSignature: true,
    relationshipOptions: ['parent', 'guardian'],
    defaultRelationship: 'parent',
  },
  aftercare: {
    title: 'Tooth Jewellery Aftercare',
    requiresMedical: false,
    requiresSignature: false,
    relationshipOptions: [],
    defaultRelationship: 'self',
  },
}

export default function ConsentPage() {
  const params = useParams()
  const [record, setRecord] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [signed, setSigned] = useState(false)

  // Medical form fields
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

  // Guardian form fields
  const [youngPersonName, setYoungPersonName] = useState('')
  const [youngPersonDOB, setYoungPersonDOB] = useState('')
  const [guardianName, setGuardianName] = useState('')
  const [guardianRelationship, setGuardianRelationship] = useState('parent')
  const [guardianAddress, setGuardianAddress] = useState('')
  const [guardianPostcode, setGuardianPostcode] = useState('')
  const [guardianPhone, setGuardianPhone] = useState('')
  const [consentStatementAgreed, setConsentStatementAgreed] = useState(false)

  // Aftercare
  const [readAcknowledged, setReadAcknowledged] = useState(false)

  // Signature
  const [signatoryName, setSignatoryName] = useState('')

  useEffect(() => {
    fetch(`/api/consent/${params.token}`)
      .then(r => {
        if (!r.ok) return r.json().then(err => { throw new Error(err.error || 'Failed to load') })
        return r.json()
      })
      .then(data => {
        setRecord(data)
        setLoading(false)
      })
      .catch(err => {
        setError(err.message)
        setLoading(false)
      })
  }, [params.token])

  if (loading) {
    return <div style={{ padding: '2rem', color: 'rgba(255,255,255,0.4)' }}>Loading consent form...</div>
  }

  if (error) {
    return (
      <div style={{ padding: '2rem', maxWidth: '600px', margin: '0 auto', textAlign: 'center' }}>
        <h2 style={{ fontFamily: "'Playfair Display', serif", color: '#e94480', fontSize: '1.5rem' }}>Consent Form Not Found</h2>
        <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: '0.9rem' }}>{error}</p>
        <p style={{ color: 'rgba(255,255,255,0.3)', fontSize: '0.8rem', marginTop: '1rem' }}>Please contact <a href="mailto:hattie@etherealsmile.co.uk" style={{ color: '#e94480' }}>hattie@etherealsmile.co.uk</a> if you believe this is an error.</p>
      </div>
    )
  }

  if (signed) {
    return (
      <div style={{ padding: '2rem', maxWidth: '600px', margin: '0 auto', textAlign: 'center' }}>
        <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>&#10003;</div>
        <h2 style={{ fontFamily: "'Playfair Display', serif", color: '#4ade80', fontSize: '1.5rem' }}>Thank You</h2>
        <p style={{ color: 'rgba(255,255,255,0.7)', fontSize: '0.95rem', lineHeight: 1.6 }}>
          Your {DOCUMENT_TYPES[record.documentType]?.title || 'consent form'} has been signed and submitted successfully.
        </p>
        <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: '0.85rem', marginTop: '1.5rem' }}>
          We look forward to seeing you at your appointment.
        </p>
      </div>
    )
  }

  if (record.status === 'signed') {
    return (
      <div style={{ padding: '2rem', maxWidth: '600px', margin: '0 auto', textAlign: 'center' }}>
        <h2 style={{ fontFamily: "'Playfair Display', serif", color: '#4ade80', fontSize: '1.5rem' }}>Already Signed</h2>
        <p style={{ color: 'rgba(255,255,255,0.7)', fontSize: '0.95rem' }}>
          This consent form has already been signed. No further action is needed.
        </p>
      </div>
    )
  }

  if (record.status === 'declined') {
    return (
      <div style={{ padding: '2rem', maxWidth: '600px', margin: '0 auto', textAlign: 'center' }}>
        <h2 style={{ fontFamily: "'Playfair Display', serif", color: 'rgba(255,255,255,0.5)', fontSize: '1.5rem' }}>Consent Declined</h2>
        <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: '0.95rem' }}>
          This consent form was previously declined.
        </p>
      </div>
    )
  }

  const docConfig = DOCUMENT_TYPES[record.documentType] || DOCUMENT_TYPES.consent

  const inputStyle = { width: '100%', padding: '0.75rem 1rem', background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.12)', borderRadius: '8px', color: '#ffffff', fontSize: '0.9rem', outline: 'none', fontFamily: "'Inter', sans-serif", boxSizing: 'border-box' }
  const labelStyle = { display: 'block', fontSize: '0.7rem', letterSpacing: '0.1em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.5)', marginBottom: '0.3rem', marginTop: '1rem' }
  const checkboxStyle = { accentColor: '#e94480', width: '18px', height: '18px', marginRight: '0.5rem', cursor: 'pointer' }

  async function handleSubmit(e) {
    e.preventDefault()
    setSubmitting(true)
    setError('')

    const responses = {}

    if (docConfig.requiresMedical) {
      responses.fullName = fullName
      responses.dateOfBirth = dateOfBirth
      responses.age = age
      responses.phone = phone
      responses.email = email
      responses.address = address
      responses.allergies = allergies
      responses.medicalConditions = { ...medicalConditions }
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

    try {
      const res = await fetch(`/api/consent/${params.token}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          signatoryName,
          signatoryRelationship: docConfig.defaultRelationship,
          responses,
          action: record.documentType === 'aftercare' ? undefined : 'sign',
        }),
      })

      const data = await res.json()

      if (!res.ok) {
        if (res.status === 403) {
          setError('This consent form has already been signed and cannot be modified.')
        } else if (res.status === 410) {
          setError('This consent form has expired. Please contact us for a new one.')
        } else {
          setError(data.error || 'Failed to submit')
        }
        setSubmitting(false)
        return
      }

      setSigned(true)
    } catch (err) {
      setError('Failed to submit. Please try again.')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div style={{ padding: '1.5rem', maxWidth: '600px', margin: '0 auto', fontFamily: "'Inter', sans-serif", color: 'rgba(255,255,255,0.85)' }}>
      {/* Header */}
      <div style={{ textAlign: 'center', marginBottom: '2rem', padding: '1.5rem', background: 'rgba(233,68,128,0.08)', border: '1px solid rgba(233,68,128,0.2)', borderRadius: '12px' }}>
        <h1 style={{ fontFamily: "'Playfair Display', serif", fontSize: '1.5rem', color: '#e94480', letterSpacing: '0.05em', margin: 0 }}>{docConfig.title}</h1>
        <p style={{ fontSize: '0.8rem', color: 'rgba(255,255,255,0.5)', marginTop: '0.5rem' }}>Ethereal Smile by Hattie Clifford</p>
      </div>

      {/* PDF Download */}
      {record.pdfUrl && (
        <div style={{ textAlign: 'center', marginBottom: '1.5rem' }}>
          <a href={record.pdfUrl} target="_blank" rel="noopener noreferrer" style={{ display: 'inline-block', padding: '0.75rem 1.5rem', borderRadius: '8px', background: 'rgba(233,68,128,0.15)', color: '#e94480', border: '1px solid rgba(233,68,128,0.4)', fontSize: '0.85rem', fontWeight: 500, letterSpacing: '0.08em', textDecoration: 'none', textTransform: 'uppercase' }}>
            Download PDF &darr;
          </a>
          <p style={{ fontSize: '0.75rem', color: 'rgba(255,255,255,0.35)', marginTop: '0.5rem' }}>Opens in a new tab. Please read before signing below.</p>
        </div>
      )}

      <form onSubmit={handleSubmit}>
        {/* CONSENT & CONSULTATION: Medical questionnaire */}
        {docConfig.requiresMedical && (
          <>
            <div style={{ borderTop: '1px solid rgba(255,255,255,0.08)', paddingTop: '1.5rem', marginBottom: '1rem' }}>
              <h3 style={{ fontFamily: "'Playfair Display', serif", fontSize: '1.1rem', color: 'rgba(255,255,255,0.9)', margin: 0 }}>Personal Details</h3>
            </div>

            <label style={labelStyle}>Full Name *</label>
            <input type="text" value={fullName} onChange={e => setFullName(e.target.value)} required style={inputStyle} placeholder="Your full name" />

            <label style={labelStyle}>Date of Birth</label>
            <input type="date" value={dateOfBirth} onChange={e => setDateOfBirth(e.target.value)} style={inputStyle} />

            <label style={labelStyle}>Age</label>
            <input type="text" value={age} onChange={e => setAge(e.target.value)} style={inputStyle} placeholder="Your age" />

            <label style={labelStyle}>Phone</label>
            <input type="tel" value={phone} onChange={e => setPhone(e.target.value)} style={inputStyle} placeholder="+44 ..." />

            <label style={labelStyle}>Email</label>
            <input type="email" value={email} onChange={e => setEmail(e.target.value)} style={inputStyle} placeholder="your@email.com" />

            <label style={labelStyle}>Address</label>
            <textarea value={address} onChange={e => setAddress(e.target.value)} rows={2} style={{ ...inputStyle, resize: 'vertical' }} placeholder="Your home address" />

            <div style={{ borderTop: '1px solid rgba(255,255,255,0.08)', paddingTop: '1.5rem', marginTop: '1rem', marginBottom: '1rem' }}>
              <h3 style={{ fontFamily: "'Playfair Display', serif", fontSize: '1.1rem', color: 'rgba(255,255,255,0.9)', margin: 0 }}>Medical History</h3>
              <p style={{ fontSize: '0.75rem', color: 'rgba(255,255,255,0.4)', marginTop: '0.25rem' }}>Please tick any conditions that apply</p>
            </div>

            <label style={labelStyle}>Allergies</label>
            <input type="text" value={allergies} onChange={e => setAllergies(e.target.value)} style={inputStyle} placeholder="None, or list allergies" />

            {Object.entries(medicalConditions).map(([key, label]) => (
              <label key={key} style={{ display: 'flex', alignItems: 'center', padding: '0.6rem 0', borderBottom: '1px solid rgba(255,255,255,0.04)', cursor: 'pointer' }}>
                <input type="checkbox" checked={medicalConditions[key]} onChange={e => setMedicalConditions(prev => ({ ...prev, [key]: e.target.checked }))} style={checkboxStyle} />
                <span style={{ fontSize: '0.9rem', color: 'rgba(255,255,255,0.8)' }}>{label.replace(/([A-Z])/g, ' $1').trim()}</span>
              </label>
            ))}

            <label style={{ display: 'flex', alignItems: 'center', padding: '0.6rem 0', cursor: 'pointer' }}>
              <input type="checkbox" checked={illnessInLast48h} onChange={e => setIllnessInLast48h(e.target.checked)} style={checkboxStyle} />
              <span style={{ fontSize: '0.9rem', color: 'rgba(255,255,255,0.8)' }}>Have you had vomiting, diarrhoea, or any infection in the last 48 hours?</span>
            </label>
          </>
        )}

        {/* GUARDIAN CONSENT: Guardian info */}
        {record.documentType === 'guardian_consent' && (
          <>
            <div style={{ borderTop: '1px solid rgba(255,255,255,0.08)', paddingTop: '1.5rem', marginBottom: '1rem' }}>
              <h3 style={{ fontFamily: "'Playfair Display', serif", fontSize: '1.1rem', color: 'rgba(255,255,255,0.9)', margin: 0 }}>Young Person&apos;s Details</h3>
            </div>

            <label style={labelStyle}>Young Person&apos;s Full Name *</label>
            <input type="text" value={youngPersonName} onChange={e => setYoungPersonName(e.target.value)} required style={inputStyle} placeholder="Child or young person's full name" />

            <label style={labelStyle}>Young Person&apos;s Date of Birth *</label>
            <input type="date" value={youngPersonDOB} onChange={e => setYoungPersonDOB(e.target.value)} required style={inputStyle} />

            <div style={{ borderTop: '1px solid rgba(255,255,255,0.08)', paddingTop: '1.5rem', marginTop: '1rem', marginBottom: '1rem' }}>
              <h3 style={{ fontFamily: "'Playfair Display', serif", fontSize: '1.1rem', color: 'rgba(255,255,255,0.9)', margin: 0 }}>Guardian&apos;s Details</h3>
            </div>

            <label style={labelStyle}>Guardian&apos;s Full Name *</label>
            <input type="text" value={guardianName} onChange={e => setGuardianName(e.target.value)} required style={inputStyle} placeholder="Your full name" />

            <label style={labelStyle}>Relationship to Young Person *</label>
            <select value={guardianRelationship} onChange={e => setGuardianRelationship(e.target.value)} required style={{ ...inputStyle, appearance: 'auto' }}>
              <option value="parent">Parent</option>
              <option value="guardian">Legal Guardian</option>
            </select>

            <label style={labelStyle}>Address *</label>
            <textarea value={guardianAddress} onChange={e => setGuardianAddress(e.target.value)} required rows={2} style={{ ...inputStyle, resize: 'vertical' }} placeholder="Your home address" />

            <label style={labelStyle}>Postcode *</label>
            <input type="text" value={guardianPostcode} onChange={e => setGuardianPostcode(e.target.value)} required style={inputStyle} placeholder="SW1A 1AA" />

            <label style={labelStyle}>Contact Number *</label>
            <input type="tel" value={guardianPhone} onChange={e => setGuardianPhone(e.target.value)} required style={inputStyle} placeholder="+44 ..." />
          </>
        )}

        {/* AFTERCARE: Read-only acknowledgment */}
        {record.documentType === 'aftercare' && (
          <div style={{ borderTop: '1px solid rgba(255,255,255,0.08)', paddingTop: '1.5rem' }}>
            <p style={{ fontSize: '0.9rem', color: 'rgba(255,255,255,0.7)', lineHeight: 1.6, marginBottom: '1.5rem' }}>
              Please download and read the aftercare information using the link above. Once you have read and understood the information, check the box below to confirm.
            </p>

            <label style={{ display: 'flex', alignItems: 'flex-start', gap: '0.75rem', cursor: 'pointer', padding: '1rem', background: 'rgba(233,68,128,0.05)', borderRadius: '8px', border: '1px solid rgba(233,68,128,0.15)' }}>
              <input type="checkbox" checked={readAcknowledged} onChange={e => setReadAcknowledged(e.target.checked)} style={{ ...checkboxStyle, marginTop: '2px' }} />
              <span style={{ fontSize: '0.9rem', color: 'rgba(255,255,255,0.8)', lineHeight: 1.5 }}>
                I have read and understood the aftercare information, and I will follow the instructions provided.
              </span>
            </label>
          </div>
        )}

        {/* SIGNATURE: All forms except aftercare */}
        {docConfig.requiresSignature && (
          <div style={{ borderTop: '1px solid rgba(255,255,255,0.08)', paddingTop: '1.5rem', marginTop: '1.5rem' }}>
            <h3 style={{ fontFamily: "'Playfair Display', serif", fontSize: '1.1rem', color: 'rgba(255,255,255,0.9)', margin: '0 0 1rem' }}>Declaration &amp; Signature</h3>

            <label style={{ display: 'flex', alignItems: 'flex-start', gap: '0.75rem', cursor: 'pointer', padding: '1rem', background: 'rgba(233,68,128,0.05)', borderRadius: '8px', border: '1px solid rgba(233,68,128,0.15)', marginBottom: '1.5rem' }}>
              <input type="checkbox" checked={consentAgreed} onChange={e => setConsentAgreed(e.target.checked)} style={{ ...checkboxStyle, marginTop: '2px' }} required />
              <span style={{ fontSize: '0.9rem', color: 'rgba(255,255,255,0.8)', lineHeight: 1.5 }}>
                I confirm that the information I have provided is accurate and complete. I consent to the tooth jewellery procedure being carried out and agree to follow all aftercare instructions.
              </span>
            </label>

            <label style={labelStyle}>Full Name (signature) *</label>
            <input type="text" value={signatoryName} onChange={e => setSignatoryName(e.target.value)} required style={inputStyle} placeholder="Type your full name as your signature" />

            <p style={{ fontSize: '0.7rem', color: 'rgba(255,255,255,0.3)', marginTop: '0.5rem' }}>
              By typing your name above, you are signing this consent form electronically. This has the same legal effect as a handwritten signature.
            </p>
          </div>
        )}

        {/* Submit button */}
        <button
          type="submit"
          disabled={submitting || (!docConfig.requiresSignature && !readAcknowledged) || (docConfig.requiresSignature && !consentAgreed) || (docConfig.requiresSignature && !signatoryName.trim())}
          style={{ width: '100%', padding: '1rem', borderRadius: '50px', border: '1px solid rgba(233,68,128,0.4)', background: submitting ? 'rgba(233,68,128,0.1)' : 'rgba(233,68,128,0.15)', color: '#e94480', fontSize: '0.85rem', fontWeight: 600, letterSpacing: '0.12em', textTransform: 'uppercase', cursor: (submitting || !consentAgreed || !signatoryName.trim()) ? 'not-allowed' : 'pointer', fontFamily: "'Inter', sans-serif", marginTop: '1.5rem' }}
        >
          {submitting ? 'Submitting...' : record.documentType === 'aftercare' ? 'I Confirm' : 'Sign & Submit'}
        </button>

        {error && (
          <div style={{ marginTop: '1rem', padding: '0.75rem 1rem', background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.3)', borderRadius: '6px', color: '#f87171', fontSize: '0.85rem' }}>
            {error}
          </div>
        )}
      </form>

      <p style={{ fontSize: '0.7rem', color: 'rgba(255,255,255,0.25)', textAlign: 'center', marginTop: '2rem' }}>
        This consent form is processed by Ethereal Smile. Your data is handled in accordance with UK GDPR.
      </p>
    </div>
  )
}