'use client'

import { Component } from 'react'

export default class AdminErrorBoundary extends Component {
  constructor(props) {
    super(props)
    this.state = { hasError: false, error: null }
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error }
  }

  componentDidCatch(error, errorInfo) {
    console.error('Admin error:', error, errorInfo)
  }

  render() {
    if (this.state.hasError) {
      return (
        <div style={{ padding: '2rem', maxWidth: '600px', margin: '2rem auto' }}>
          <h2 style={{ fontFamily: "'Pirata One', cursive", fontSize: '1.5rem', color: '#e94480', marginBottom: '1rem' }}>
            Something went wrong
          </h2>
          <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: '0.85rem', marginBottom: '1rem' }}>
            This section encountered an error. Try refreshing the page.
          </p>
          <details style={{ marginBottom: '1rem' }}>
            <summary style={{ color: 'rgba(255,255,255,0.4)', fontSize: '0.75rem', cursor: 'pointer' }}>Error details</summary>
            <pre style={{ color: '#e94480', fontSize: '0.75rem', overflow: 'auto', padding: '1rem', background: 'rgba(255,255,255,0.03)', borderRadius: '8px', marginTop: '0.5rem' }}>
              {this.state.error?.message || 'Unknown error'}
            </pre>
          </details>
          <button
            onClick={() => this.setState({ hasError: false, error: null })}
            style={{ padding: '0.7rem 1.5rem', background: '#e94480', color: '#fff', border: 'none', borderRadius: '50px', fontSize: '0.75rem', letterSpacing: '0.15em', textTransform: 'uppercase', cursor: 'pointer' }}
          >
            Try Again
          </button>
          <button
            onClick={() => window.location.href = '/admin/cms'}
            style={{ padding: '0.7rem 1.5rem', background: 'transparent', color: 'rgba(255,255,255,0.6)', border: '1px solid rgba(255,255,255,0.2)', borderRadius: '50px', fontSize: '0.75rem', letterSpacing: '0.15em', textTransform: 'uppercase', cursor: 'pointer', marginLeft: '0.5rem' }}
          >
            Back to CMS
          </button>
        </div>
      )
    }
    return this.props.children
  }
}
