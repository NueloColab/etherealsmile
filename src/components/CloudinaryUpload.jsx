'use client'

import { useState, useRef } from 'react'

const CLOUD_NAME = 'dfllse3az'
const UPLOAD_PRESET = 'ethereal-smile'

export default function CloudinaryUpload({ onUpload, label = 'Upload Image', currentUrl }) {
  const [uploading, setUploading] = useState(false)
  const widgetRef = useRef(null)

  function openWidget() {
    if (typeof window === 'undefined' || !window.cloudinary) {
      // Fallback: open Cloudinary upload page directly
      window.open(`https://console.cloudinary.com/console/media-library?cloud_name=${CLOUD_NAME}`, '_blank')
      return
    }

    widgetRef.current = window.cloudinary.createUploadWidget(
      {
        cloudName: CLOUD_NAME,
        uploadPreset: UPLOAD_PRESET,
        folder: 'nuelo/etherealsmile',
        sources: ['local', 'url', 'camera'],
        multiple: false,
        maxFileSize: 10000000, // 10MB
        styles: {
          palette: {
            window: '#000000',
            windowBorder: '#e94480',
            tabIcon: '#e94480',
            menuIcons: '#e94480',
            text: '#ffffff',
          },
        },
      },
      (error, result) => {
        if (!error && result && result.event === 'success') {
          const url = result.info.secure_url
          onUpload(url)
        }
        setUploading(false)
      }
    )
    widgetRef.current.open()
    setUploading(true)
  }

  return (
    <div>
      {label && (
        <label style={{ display: 'block', fontSize: '0.7rem', letterSpacing: '0.12em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.5)', marginBottom: '0.5rem' }}>
          {label}
        </label>
      )}
      <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center' }}>
        <button
          type="button"
          onClick={openWidget}
          disabled={uploading}
          style={{
            padding: '0.6rem 1.2rem',
            background: uploading ? 'rgba(233,68,128,0.3)' : 'rgba(233,68,128,0.1)',
            color: uploading ? 'rgba(255,255,255,0.4)' : '#e94480',
            border: uploading ? '1px solid rgba(233,68,128,0.2)' : '1px solid rgba(233,68,128,0.3)',
            borderRadius: '8px',
            fontSize: '0.75rem',
            fontWeight: 500,
            cursor: uploading ? 'not-allowed' : 'pointer',
            fontFamily: "'Inter', sans-serif",
            transition: 'all 0.2s ease',
          }}
        >
          {uploading ? 'Uploading...' : 'Choose Image'}
        </button>
        {currentUrl && (
          <div style={{ width: '40px', height: '40px', borderRadius: '6px', overflow: 'hidden', border: '1px solid rgba(255,255,255,0.1)' }}>
            <img src={currentUrl} alt="Preview" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
          </div>
        )}
      </div>
    </div>
  )
}