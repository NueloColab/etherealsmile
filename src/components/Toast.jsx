'use client'

import { useState, useEffect, useCallback, createContext, useContext } from 'react'

const ToastContext = createContext(null)

export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([])

  const addToast = useCallback((message, type = 'success') => {
    const id = Date.now() + Math.random()
    setToasts((prev) => [...prev, { id, message, type }])
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id))
    }, 3000)
  }, [])

  return (
    <ToastContext.Provider value={{ addToast }}>
      {children}
      <div
        style={{
          position: 'fixed',
          top: '1rem',
          right: '1rem',
          zIndex: 9999,
          display: 'flex',
          flexDirection: 'column',
          gap: '0.5rem',
          pointerEvents: 'none',
        }}
      >
        {toasts.map((toast) => (
          <div
            key={toast.id}
            style={{
              padding: '0.75rem 1.25rem',
              borderRadius: '8px',
              fontSize: '0.85rem',
              fontWeight: 500,
              color: toast.type === 'success' ? '#4ade80' : toast.type === 'error' ? '#f87171' : '#e94480',
              background: toast.type === 'success' ? 'rgba(34,197,94,0.1)' : toast.type === 'error' ? 'rgba(239,68,68,0.1)' : 'rgba(233,68,128,0.1)',
              border: `1px solid ${toast.type === 'success' ? 'rgba(34,197,94,0.2)' : toast.type === 'error' ? 'rgba(239,68,68,0.2)' : 'rgba(233,68,128,0.2)'}`,
              backdropFilter: 'blur(8px)',
              animation: 'eth-toast-in 0.3s ease',
              pointerEvents: 'auto',
            }}
          >
            {toast.message}
          </div>
        ))}
      </div>
      <style jsx>{`
        @keyframes eth-toast-in {
          from { opacity: 0; transform: translateX(20px); }
          to { opacity: 1; transform: translateX(0); }
        }
      `}</style>
    </ToastContext.Provider>
  )
}

export function useToast() {
  const ctx = useContext(ToastContext)
  if (!ctx) throw new Error('useToast must be inside ToastProvider')
  return ctx
}
