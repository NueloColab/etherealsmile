import { db } from '../src/lib/db'
import { adminUsers, services } from '../src/lib/schema'
import bcrypt from 'bcryptjs'

import { eq } from 'drizzle-orm'

async function seed() {
  console.log('Seeding database...')

  // Check if admin already exists
  const existing = await db.select().from(adminUsers).where(eq(adminUsers.email, 'admin@etherealsmile.co.uk'))
  if (existing.length === 0) {
    const hash = await bcrypt.hash('ethereal2026', 10)
    await db.insert(adminUsers).values({
      email: 'admin@etherealsmile.co.uk',
      passwordHash: hash,
      name: 'Hattie Clifford',
      role: 'admin',
    })
    console.log('Admin user created: admin@etherealsmile.co.uk / ethereal2026')
  } else {
    console.log('Admin user already exists')
  }

  // Seed default services
  const existingServices = await db.select().from(services)
  if (existingServices.length === 0) {
    await db.insert(services).values([
      {
        name: 'Single Swarovski Crystal',
        description: 'One genuine Swarovski crystal tooth gem, hand-placed with dental-grade adhesive. Perfect for a subtle, elegant sparkle.',
        price: '£35',
        duration: '15 min',
        sortOrder: 1,
        active: true,
      },
      {
        name: 'Single Preciosa Crystal',
        description: 'One genuine Preciosa crystal tooth gem. Premium Czech crystal with exceptional clarity and fire.',
        price: '£30',
        duration: '15 min',
        sortOrder: 2,
        active: true,
      },
      {
        name: 'Double Swarovski Set',
        description: 'Two matching Swarovski crystals placed in a complementary arrangement. Ideal for a balanced, symmetrical look.',
        price: '£60',
        duration: '20 min',
        sortOrder: 3,
        active: true,
      },
      {
        name: 'Triple Swarovski Cluster',
        description: 'A constellation of three Swarovski crystals, creating a mini galaxy on your tooth. Our most popular choice.',
        price: '£85',
        duration: '25 min',
        sortOrder: 4,
        active: true,
      },
      {
        name: 'Custom Design Consultation',
        description: 'Work directly with Hattie to design a bespoke tooth gem arrangement. Multiple crystals, unique patterns, fully personalised.',
        price: 'From £100',
        duration: '30+ min',
        sortOrder: 5,
        active: true,
      },
    ])
    console.log('Default services created')
  } else {
    console.log('Services already exist')
  }

  console.log('Seeding complete.')
  process.exit(0)
}

seed().catch((err) => {
  console.error('Seed failed:', err)
  process.exit(1)
})
