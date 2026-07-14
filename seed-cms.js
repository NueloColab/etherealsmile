const { db } = require('./src/lib/db.js')
const { siteContent } = require('./src/lib/schema.js')
const { eq } = require('drizzle-orm')

const defaultContent = {
  home: {
    heroHeading: 'Ethereal Smile',
    heroSubtitle: 'Swarovski \u0026 Preciosa Crystal Tooth Gems',
    ctaText: 'Book Now',
    backgroundImage: '/hero-logo-card.png',
  },
  about: {
    heading: 'About',
    bodyText: 'Ethereal Smile brings a touch of sparkle to your smile with genuine Swarovski and Preciosa crystal tooth gems. Founded by Hattie Clifford, we offer professional tooth gem application in a safe, sterile environment.',
    image: '/hattie-portrait.jpg',
  },
  hattie: {
    heading: "Who's Hattie",
    bodyText: 'Hattie Clifford is the founder and lead artist at Ethereal Smile. With years of experience in dental aesthetics and a passion for unique beauty, Hattie has transformed thousands of smiles across the UK.',
    portraitImage: '/hattie-portrait.jpg',
    workingImage: '/hattie-working.jpg',
  },
  book: {
    heading: 'Book Your Appointment',
    subtitle: 'Choose your preferred date and time',
    introText: 'Select a date from the calendar and pick your preferred time slot. We will confirm your appointment within 24 hours.',
    timeSlots: ['10:00', '11:30', '13:00', '14:30', '16:00'],
  },
  services: {
    heading: 'Services',
    services: [
      { name: 'Single Swarovski', description: 'One genuine Swarovski crystal', price: '£45', duration: '15 min', active: true, sortOrder: 1 },
      { name: 'Double Set', description: 'Two crystals in a paired design', price: '£80', duration: '25 min', active: true, sortOrder: 2 },
      { name: 'Preciosa Cluster', description: 'Cluster of Preciosa crystals', price: '£65', duration: '20 min', active: true, sortOrder: 3 },
      { name: 'Gold Cap', description: '18k gold tooth cap', price: '£55', duration: '15 min', active: true, sortOrder: 4 },
      { name: 'Custom Design', description: 'Bespoke crystal arrangement', price: 'From £95', duration: '45 min', active: true, sortOrder: 5 },
    ],
  },
  gallery: {
    heading: 'Gallery',
    subtitle: 'See the sparkle for yourself',
  },
  journal: {
    heading: 'Journal',
    subtitle: 'Tips, trends, and aftercare wisdom',
  },
  contact: {
    heading: 'Contact',
    subtitle: 'We would love to hear from you',
    email: 'etherealsmilex@gmail.com',
    phone: '',
    instagram: 'https://www.instagram.com/etherealsmilex',
    tiktok: 'https://www.tiktok.com/@etherealsmilex',
  },
  review: {
    heading: 'Leave a Review',
    subtitle: 'Share your Ethereal Smile experience',
    linkText: 'Leave a Review',
    reviewUrl: 'https://www.google.com/search?q=ethereal+smile+reviews',
  },
}

async function seed() {
  for (const [key, content] of Object.entries(defaultContent)) {
    const existing = await db.select().from(siteContent).where(eq(siteContent.sectionKey, key))
    if (existing.length === 0) {
      await db.insert(siteContent).values({
        sectionKey: key,
        content,
        updatedAt: new Date(),
      })
      console.log(`Seeded ${key}`)
    } else {
      console.log(`${key} already exists, skipping`)
    }
  }
  console.log('Done')
  process.exit(0)
}

seed().catch((err) => {
  console.error(err)
  process.exit(1)
})
