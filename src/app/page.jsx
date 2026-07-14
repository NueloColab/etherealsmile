import Hero from './sections/Hero'
import About from './sections/About'
import Showreel from './sections/Showreel'
import Hattie from './sections/Hattie'
import Book from './sections/Book'
import Services from './sections/Services'
import Gallery from './sections/Gallery'
import Journal from './sections/Journal'
import Contact from './sections/Contact'

export const dynamic = 'force-dynamic'

export default function Home() {
  return (
    <main style={{ position: 'relative', zIndex: 1 }}>
      <Hero />
      <About />
      <Showreel />
      <Hattie />
      <Services />
      <Book />
      <Gallery />
      <Journal />
      <Contact />
    </main>
  )
}
