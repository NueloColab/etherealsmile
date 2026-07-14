'use client'

import { usePathname } from 'next/navigation'
import Header from './Header'
import Footer from './Footer'
import Starfield from './Starfield'
import ScrollReveal from './ScrollReveal'

export default function LayoutWrapper({ children }) {
  const pathname = usePathname()
  const isAdmin = pathname?.startsWith('/admin')
  const isConsent = pathname?.startsWith('/consent')

  if (isAdmin || isConsent) {
    return <>{children}</>
  }

  return (
    <>
      <Starfield />
      <Header />
      <ScrollReveal>{children}</ScrollReveal>
      <Footer />
    </>
  )
}
