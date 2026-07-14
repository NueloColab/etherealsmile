'use client'

import { useEffect } from 'react'

export default function ScrollReveal({ children }) {
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-visible')
          }
        })
      },
      { threshold: 0.15, rootMargin: '0px 0px -50px 0px' }
    )

    const selectors = ['.reveal', '.reveal-left', '.reveal-right', '.reveal-scale']
    selectors.forEach((selector) => {
      document.querySelectorAll(selector).forEach((el) => observer.observe(el))
    })

    return () => observer.disconnect()
  }, [])

  return <>{children}</>
}
