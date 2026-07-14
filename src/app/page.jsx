import Hero from './sections/Hero'
import About from './sections/About'
import Showreel from './sections/Showreel'
import Hattie from './sections/Hattie'
import Book from './sections/Book'
import Services from './sections/Services'
import Gallery from './sections/Gallery'
import Journal from './sections/Journal'
import Contact from './sections/Contact'
import SectionDivider from '../components/SectionDivider'

export const dynamic = 'force-dynamic'

export default function Home() {
  return (
    <main style={{ position: 'relative', zIndex: 1 }}>
      <Hero />
      <SectionDivider />
      <About />
      <SectionDivider />
      <Showreel />
      <SectionDivider />
      <Hattie />
      <SectionDivider />
      <Services />
      <SectionDivider />
      <Book />
      <SectionDivider />
      <Gallery />
      <SectionDivider />
      <Journal />
      <SectionDivider />
      <Contact />
    </main>
  )
}
