'use client'

import { useState, useRef } from 'react'

export default function CloudinaryVideoUpload({ onUpload, label = 'Upload Video', currentUrl }) {
  const [uploading, setUploading] = useState(false)
  const [dragActive, setDragActive] = useState(false)
  const fileInputRef = useRef(null)

  async function handleUpload(file) {
    if (!file) return
    setUploading(true)
    try {
      const formData = new FormData()
      formData.append('file', file)
      formData.append('folder', 'videos')

      const res = await fetch('/api/cloudinary/upload', {
        method: 'POST',
        body: formData,
      })

      if (!res.ok) throw new Error('Upload failed')

      const data = await res.json()
      onUpload(data.url)
    } catch (error) {
      console.error('Upload error:', error)
      alert('Failed to upload video. Please try again.')
    } finally {
      setUploading(false)
    }
  }

  function handleDrag(e) {
    e.preventDefault()
    e.stopPropagation()
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true)
    } else if (e.type === 'dragleave') {
      setDragActive(false)
    }
  }

  function handleDrop(e) {
    e.preventDefault()
    e.stopPropagation()
    setDragActive(false)
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleUpload(e.dataTransfer.files[0])
    }
  }

  function handleRemove() {
    onUpload('')
  }

  return (
    <div>
      {label && (
        <label style={{ display: 'block', fontSize: '0.7rem', letterSpacing: '0.12em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.5)', marginBottom: '0.5rem' }}>
          {label}
        </label>
      )}

      {currentUrl ? (
        <div style={{ position: 'relative', border: '1px solid rgba(233,68,128,0.15)', borderRadius: '10px', overflow: 'hidden', background: 'rgba(255,255,255,0.02)' }}>
          <video
            src={currentUrl}
            muted
            loop
            playsInline
            preload="metadata"
            style={{ width: '100%', maxHeight: '250px', objectFit: 'cover', display: 'block' }}
          />
          <button
            type="button"
            onClick={handleRemove}
            style={{
              position: 'absolute', top: '0.5rem', right: '0.5rem',
              background: 'rgba(239,68,68,0.9)', color: '#fff', border: 'none',
              borderRadius: '4px', padding: '0.3rem 0.5rem', fontSize: '0.7rem',
              cursor: 'pointer', fontWeight: 500,
            }}
          >
            Remove
          </button>
          <div style={{ padding: '0.75rem', display: 'flex', gap: '0.5rem' }}>
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              style={{
                padding: '0.5rem 1rem',
                background: 'rgba(233,68,128,0.1)',
                color: '#e94480',
                border: '1px solid rgba(233,68,128,0.3)',
                borderRadius: '6px',
                fontSize: '0.7rem',
                fontWeight: 500,
                cursor: 'pointer',
                letterSpacing: '0.05em',
              }}
            >
              Replace Video
            </button>
            <p style={{ fontSize: '0.65rem', color: 'rgba(255,255,255,0.3)', margin: 'auto 0', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', maxWidth: '200px' }}>
              {currentUrl}
            </p>
          </div>
        </div>
      ) : (
        <div
          onClick={() => fileInputRef.current?.click()}
          onDragEnter={handleDrag}
          onDragLeave={handleDrag}
          onDragOver={handleDrag}
          onDrop={handleDrop}
          style={{
            border: dragActive ? '2px solid #e94480' : '2px dashed rgba(255,255,255,0.15)',
            borderRadius: '10px',
            padding: '2rem',
            textAlign: 'center',
            cursor: 'pointer',
            background: dragActive ? 'rgba(233,68,128,0.05)' : 'rgba(255,255,255,0.02)',
            transition: 'all 0.2s ease',
          }}
        >
          {uploading ? (
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.75rem' }}>
              <div style={{ width: '24px', height: '24px', border: '2px solid rgba(233,68,128,0.3)', borderTopColor: '#e94480', borderRadius: '50%', animation: 'eth-spin 0.8s linear infinite' }}>
                <style>{`@keyframes eth-spin { to { transform: rotate(360deg) } }`}</style>
              </div>
              <p style={{ fontSize: '0.8rem', color: 'rgba(255,255,255,0.5)' }}>Uploading video...</p>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.5rem' }}>
              <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="rgba(233,68,128,0.5)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                <polygon points="23 7 16 12 23 17 23 7"/>
                <rect x="1" y="5" width="15" height="14" rx="2" ry="2"/>
              </svg>
              <p style={{ fontSize: '0.8rem', color: 'rgba(255,255,255,0.5)' }}>
                Click to upload or drag and drop
              </p>
              <p style={{ fontSize: '0.65rem', color: 'rgba(255,255,255,0.3)' }}>
                MP4, MOV, WebM (max 50MB)
              </p>
            </div>
          )}
        </div>
      )}

      <input
        ref={fileInputRef}
        type="file"
        accept="video/mp4,video/quicktime,video/webm"
        style={{ display: 'none' }}
        onChange={(e) => {
          if (e.target.files[0]) handleUpload(e.target.files[0])
          e.target.value = ''
        }}
      />
    </div>
  )
}
