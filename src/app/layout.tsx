import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'Ethereal Smile | Swarovski & Preciosa Crystal Tooth Gems',
  description: 'Coming soon - Follow us for upcoming events and bookings. Genuine Swarovski & Preciosa crystal tooth gems by Hattie Clifford.',
  openGraph: {
    title: 'Ethereal Smile | Crystal Tooth Gems',
    description: 'Coming soon - Genuine Swarovski & Preciosa crystal tooth gems',
    images: ['/logo.jpg'],
  },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}
