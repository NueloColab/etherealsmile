'use client'

import { useState, useEffect, useCallback } from 'react'

export function useCmsContent(key) {
  const [content, setContent] = useState(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)
  const [error, setError] = useState(null)

  useEffect(() => {
    if (!key) return
    setLoading(true)
    fetch(`/api/cms?key=${key}`)
      .then((r) => {
        if (!r.ok) throw new Error(`CMS fetch failed: ${r.status}`)
        return r.json()
      })
      .then((data) => {
        setContent(data)
        setLoading(false)
      })
      .catch((err) => {
        console.error(`useCmsContent(${key}) error:`, err)
        setError(err.message)
        setLoading(false)
      })
  }, [key])

  const save = useCallback(
    async (newContent) => {
      setSaving(true)
      setError(null)
      setSaved(false)
      try {
        const res = await fetch('/api/cms', {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ key, content: newContent }),
        })
        if (!res.ok) throw new Error('Save failed')
        setContent(newContent)
        setSaved(true)
        setSaving(false)
        setTimeout(() => setSaved(false), 3000)
        return true
      } catch (err) {
        console.error(`useCmsContent(${key}) save error:`, err)
        setError(err.message)
        setSaving(false)
        return false
      }
    },
    [key]
  )

  return { content, setContent, loading, saving, saved, error, save }
}

export function useAllCmsContent() {
  const [content, setContent] = useState({})
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    setLoading(true)
    fetch('/api/cms')
      .then((r) => {
        if (!r.ok) throw new Error(`CMS fetch failed: ${r.status}`)
        return r.json()
      })
      .then((data) => {
        setContent(data)
        setLoading(false)
      })
      .catch((err) => {
        console.error('useAllCmsContent error:', err)
        setError(err.message)
        setLoading(false)
      })
  }, [])

  return { content, loading, error }
}
