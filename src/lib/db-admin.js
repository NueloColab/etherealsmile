import { drizzle } from 'drizzle-orm/node-postgres'
import { Pool } from 'pg'
import * as schema from './schema'

// Direct connection to primary — always fresh data, no read-replica lag.
// Used ONLY by admin read routes. Public routes use the pooler (db.js).
const directUrl = process.env.DATABASE_URL_DIRECT || process.env.DATABASE_URL

const pool = new Pool({
  connectionString: directUrl,
})

export const dbAdmin = drizzle(pool, { schema })
export { schema }