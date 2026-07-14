const { drizzle } = require('drizzle-orm/node-postgres')
const { Pool } = require('pg')
const { adminUsers, services } = require('./src/lib/schema')
const { eq } = require('drizzle-orm')
const bcrypt = require('bcryptjs')

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
})

const db = drizzle(pool)

async function seed() {
  console.log('Seeding database...')

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

  const existingServices = await db.select().from(services)
  if (existingServices.length === 0) {
    await db.insert(services).values([
      {
        name: 'Single Swarovski Crystal',
        description: 'One genuine Swarovski crystal tooth gem, hand-placed with dental-grade adhesive. Perfect for a subtle, elegant sparkle.',
        price: '\u00a335',
        duration: '15 min',
        sortOrder: 1,
        active: true,
      },
      {
        name: 'Single Preciosa Crystal',
        description: 'One genuine Preciosa crystal tooth gem. Premium Czech crystal with exceptional clarity and fire.',
        price: '\u00a330',
        duration: '15 min',
        sortOrder: 2,
        active: true,
      },
      {
        name: 'Double Swarovski Set',
        description: 'Two matching Swarovski crystals placed in a complementary arrangement. Ideal for a balanced, symmetrical look.',
        price: '\u00a360',
        duration: '20 min',
        sortOrder: 3,
        active: true,
      },
      {
        name: 'Triple Swarovski Cluster',
        description: 'A constellation of three Swarovski crystals, creating a mini galaxy on your tooth. Our most popular choice.',
        price: '\u00a385',
        duration: '25 min',
        sortOrder: 4,
        active: true,
      },
      {
        name: 'Custom Design Consultation',
        description: 'Work directly with Hattie to design a bespoke tooth gem arrangement. Multiple crystals, unique patterns, fully personalised.',
        price: 'From \u00a3100',
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
  await pool.end()
  process.exit(0)
}

seed().catch((err) => {
  console.error('Seed failed:', err)
  pool.end().then(() => process.exit(1))
})
