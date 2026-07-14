import { NextResponse } from 'next/server'
import { generateConsentPdf } from '../../../../lib/generateConsentPdf'
import { uploadConsentPdf } from '../../../../lib/uploadConsentPdf'

export async function GET() {
  const errors = []
  let pdfBuffer = null
  let uploadResult = null
  
  // Step 1: Generate PDF
  try {
    pdfBuffer = await generateConsentPdf({
      documentType: 'consultation',
      documentTitle: 'Test Consultation Form',
      documentVersion: '1.0',
      pdfUrl: 'https://example.com/test.pdf',
      responses: { fullName: 'Test', dateOfBirth: '1990-01-01', age: '36', phone: '+44 7700 900001', email: 'test@test.com', address: 'Test', allergies: 'None', medicalConditions: {}, illnessInLast48h: false, consentAgreed: true },
      signatoryName: 'Test Signer',
      signatoryRelationship: 'self',
      signedAt: new Date().toISOString(),
      signedIp: '1.2.3.4',
      clientName: 'Test',
      clientEmail: 'test@test.com',
    })
    errors.push({ step: 'generate', success: true, size: pdfBuffer.length })
  } catch (err) {
    errors.push({ step: 'generate', success: false, error: err.message, stack: err.stack?.split('\n').slice(0, 3) })
  }
  
  // Step 2: Upload to Cloudinary
  if (pdfBuffer) {
    try {
      uploadResult = await uploadConsentPdf(pdfBuffer, 'test-debug')
      errors.push({ step: 'upload', success: true, url: uploadResult.url })
    } catch (err) {
      errors.push({ step: 'upload', success: false, error: err.message, stack: err.stack?.split('\n').slice(0, 3) })
    }
  }
  
  return NextResponse.json({ errors, pdfGenerated: !!pdfBuffer, uploadResult })
}
