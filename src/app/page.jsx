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
import { db } from '../lib/db'
import { siteContent } from '../lib/schema'

export const dynamic = 'force-dynamic'

export default async function Home() {
  // Fetch all CMS content for visibility control
  const allContent = await db.select().from(siteContent)
  const cms = {}
  allContent.forEach((row) => {
    cms[row.sectionKey] = row.content
  })

  const sectionVisible = (key) => {
    const content = cms[key]
    if (!content) return true // Default visible if no CMS entry
    return content.isVisible !== false
  }

  const sections = [
    { key: 'home', Component: Hero },
    { key: 'about', Component: About },
    { key: 'showreel', Component: Showreel },
    { key: 'hattie', Component: Hattie },
    { key: 'services', Component: Services },
    { key: 'book', Component: Book },
    { key: 'gallery', Component: Gallery },
    { key: 'journal', Component: Journal },
    { key: 'contact', Component: Contact },
  ]

  const visibleSections = sections.filter((s) => sectionVisible(s.key))

  return (
    <main style={{ position: 'relative', zIndex: 1 }}>
      {visibleSections.map((section, index) => (
        <>
          {index > 0 && <SectionDivider key={`div-${section.key}`} />}
          <section.Component key={section.key} />
        </>
      ))}
    </main>
  )
}
