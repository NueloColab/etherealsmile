import Hero from './sections/Hero'
import About from './sections/About'
import Hattie from './sections/Hattie'
import Book from './sections/Book'
import Services from './sections/Services'
import Gallery from './sections/Gallery'
import Journal from './sections/Journal'
import Contact from './sections/Contact'
import Review from './sections/Review'

export default function Home() {
  return (
    <main style={{ position: 'relative', zIndex: 1 }}>
      <Hero />
      <About />
      <Hattie />
      <Book />
      <Services />
      <Gallery />
      <Journal />
      <Contact />
      <Review />
    </main>
  )
}
