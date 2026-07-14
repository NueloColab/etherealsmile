import { NextResponse } from 'next/server'

export async function GET() {
  try {
    const PDFDocument = (await import('pdfkit')).default
    const doc = new PDFDocument()
    doc.fontSize(12).text('Test')
    doc.end()
    
    const chunks = []
    for await (const chunk of doc) {
      chunks.push(chunk)
    }
    const buffer = Buffer.concat(chunks)
    
    return NextResponse.json({ 
      success: true, 
      pdfSize: buffer.length,
      pdfkitType: typeof PDFDocument
    })
  } catch (err) {
    return NextResponse.json({ 
      error: err.message,
      stack: err.stack?.split('\n').slice(0, 5)
    }, { status: 500 })
  }
}
