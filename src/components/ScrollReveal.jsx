'use client'

import { useEffect } from 'react'

export default function ScrollReveal({ children }) {
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-visible')
            // Once visible, no need to keep observing
            observer.unobserve(entry.target)
          }
        })
      },
      { threshold: 0.15, rootMargin: '0px 0px -50px 0px' }
    )

    const selectors = ['.reveal', '.reveal-left', '.reveal-right', '.reveal-scale']

    // Observe all existing elements
    function observeAll() {
      selectors.forEach((selector) => {
        document.querySelectorAll(selector).forEach((el) => {
          if (!el.classList.contains('is-visible')) {
            observer.observe(el)
          }
        })
      })
    }

    // Initial observation
    observeAll()

    // Re-observe when DOM changes (for dynamically loaded content)
    const mutationObserver = new MutationObserver(() => {
      observeAll()
    })

    mutationObserver.observe(document.body, {
      childList: true,
      subtree: true,
    })

    return () => {
      observer.disconnect()
      mutationObserver.disconnect()
    }
  }, [])

  return <>{children}</>
}