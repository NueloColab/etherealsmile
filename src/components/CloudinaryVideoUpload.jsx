'use client'

import { useState, useRef } from 'react'
import { useToast } from './Toast'

async function uploadToCloudinary(file, folder, resourceType) {
  // 1. Get signed params from server
  const signRes = await fetch('/api/cloudinary/sign', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ folder, resourceType }),
  })
  if (!signRes.ok) throw new Error('Failed to get upload signature')
  const { signature, timestamp, apiKey, cloudName, folder: signedFolder } = await signRes.json()

  // 2. Upload directly to Cloudinary (bypasses Vercel body limit)
  const cloudinaryUrl = `https://api.cloudinary.com/v1_1/${cloudName}/${resourceType}/upload`
  const formData = new FormData()
  formData.append('file', file)
  formData.append('api_key', apiKey)
  formData.append('timestamp', timestamp)
  formData.append('signature', signature)
  formData.append('folder', signedFolder)

  const uploadRes = await fetch(cloudinaryUrl, { method: 'POST', body: formData })
  if (!uploadRes.ok) {
    const err = await uploadRes.json().catch(() => ({}))
    throw new Error(err.error?.message || 'Cloudinary upload failed')
  }
  const data = await uploadRes.json()
  return data.secure_url
}

export default function CloudinaryVideoUpload({ onUpload, label = 'Upload Video', currentUrl }) {
  const [uploading, setUploading] = useState(false)
  const [dragActive, setDragActive] = useState(false)
  const fileInputRef = useRef(null)
  const { addToast } = useToast()

  async function handleUpload(file) {
    if (!file) return
    setUploading(true)
    try {
      const url = await uploadToCloudinary(file, 'videos', 'video')
      onUpload(url)
      addToast('Video uploaded successfully', 'success')
    } catch (error) {
      console.error('Upload error:', error)
      addToast('Failed to upload video: ' + error.message, 'error')
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
    addToast('Video removed', 'success')
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
            controls
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
                MP4, MOV, WebM (max 100MB)
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
