import './globals.css'
import Header from '../components/Header'
import Footer from '../components/Footer'
import Starfield from '../components/Starfield'

export const metadata = {
  title: 'Ethereal Smile | Swarovski \u0026 Preciosa Crystal Tooth Gems',
  description: 'Ethereal Smile by Hattie Clifford - Genuine Swarovski \u0026 Preciosa crystal tooth gems. Book your appointment today.',
  keywords: ['tooth gems', 'swarovski', 'preciosa', 'crystal tooth gems', 'tooth jewellery', 'ethereal smile', 'hattie clifford', 'tooth gems uk'],
  openGraph: {
    title: 'Ethereal Smile | Crystal Tooth Gems',
    description: 'Genuine Swarovski \u0026 Preciosa crystal tooth gems by Hattie Clifford.',
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
    description: 'Genuine Swarovski \u0026 Preciosa crystal tooth gems by Hattie Clifford.',
    images: ['https://etherealsmile.co.uk/logo.jpg'],
  },
  icons: {
    icon: '/favicon.svg',
  },
  robots: {
    index: true,
    follow: true,
  },
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <Starfield />
        <Header />
        {children}
        <Footer />
      </body>
    </html>
  )
}
