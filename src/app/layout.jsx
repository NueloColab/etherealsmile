import './globals.css'

export const metadata = {
  title: 'Ethereal Smile | Swarovski & Preciosa Crystal Tooth Gems',
  description: 'Ethereal Smile by Hattie Clifford - Genuine Swarovski & Preciosa crystal tooth gems. Professional tooth gem application coming soon. Follow us for events and bookings.',
  keywords: ['tooth gems', 'swarovski', 'preciosa', 'crystal tooth gems', 'tooth jewellery', 'ethereal smile', 'hattie clifford', 'tooth gems uk'],
  openGraph: {
    title: 'Ethereal Smile | Crystal Tooth Gems',
    description: 'Genuine Swarovski & Preciosa crystal tooth gems by Hattie Clifford. Coming soon.',
    url: 'https://etherealsmile.co.uk',
    siteName: 'Ethereal Smile',
    images: [
      {
        url: 'https://etherealsmile.co.uk/logo.jpg',
        width: 1200,
        height: 630,
        alt: 'Ethereal Smile - Crystal Tooth Gems',
      },
    ],
    locale: 'en_GB',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Ethereal Smile | Crystal Tooth Gems',
    description: 'Genuine Swarovski & Preciosa crystal tooth gems by Hattie Clifford. Coming soon.',
    images: ['https://etherealsmile.co.uk/logo.jpg'],
  },
  icons: {
    icon: '/favicon.ico',
  },
  robots: {
    index: true,
    follow: true,
  },
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}
