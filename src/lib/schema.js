import { pgTable, serial, varchar, text, timestamp, integer, boolean, jsonb, pgEnum } from 'drizzle-orm/pg-core'

export const enquiryStatusEnum = pgEnum('enquiry_status', ['pending', 'confirmed', 'rejected', 'cancelled'])
export const bookingStatusEnum = pgEnum('booking_status', ['pending', 'confirmed', 'rejected', 'cancelled'])
export const postStatusEnum = pgEnum('post_status', ['draft', 'published'])
export const invoiceStatusEnum = pgEnum('invoice_status', ['draft', 'sent', 'paid', 'overdue'])
export const galleryTypeEnum = pgEnum('gallery_type', ['image', 'video'])

export const enquiries = pgTable('enquiries', {
  id: serial('id').primaryKey(),
  name: varchar('name', { length: 255 }).notNull(),
  email: varchar('email', { length: 255 }).notNull(),
  phone: varchar('phone', { length: 50 }),
  preferredDate: timestamp('preferred_date', { mode: 'date' }),
  preferredTime: varchar('preferred_time', { length: 50 }),
  proposedDate: timestamp('proposed_date', { mode: 'date' }),
  proposedTime: varchar('proposed_time', { length: 50 }),
  proposalToken: varchar('proposal_token', { length: 255 }).unique(),
  proposalExpiresAt: timestamp('proposal_expires_at', { mode: 'date' }),
  service: varchar('service', { length: 255 }),
  price: varchar('price', { length: 50 }),
  message: text('message'),
  status: enquiryStatusEnum('status').notNull().default('pending'),
  createdAt: timestamp('created_at', { mode: 'date' }).notNull().defaultNow(),
  confirmedAt: timestamp('confirmed_at', { mode: 'date' }),
  notes: text('notes'),
})

export const bookings = pgTable('bookings', {
  id: serial('id').primaryKey(),
  enquiryId: integer('enquiry_id'),
  name: varchar('name', { length: 255 }).notNull(),
  email: varchar('email', { length: 255 }).notNull(),
  phone: varchar('phone', { length: 50 }),
  date: timestamp('date', { mode: 'date' }),
  timeSlot: varchar('time_slot', { length: 50 }),
  service: varchar('service', { length: 255 }),
  status: bookingStatusEnum('status').notNull().default('pending'),
  price: varchar('price', { length: 50 }),
  notes: text('notes'),
  createdAt: timestamp('created_at', { mode: 'date' }).notNull().defaultNow(),
})

export const blogPosts = pgTable('blog_posts', {
  id: serial('id').primaryKey(),
  title: varchar('title', { length: 255 }).notNull(),
  slug: varchar('slug', { length: 255 }).notNull().unique(),
  content: text('content').notNull(),
  excerpt: text('excerpt'),
  imageUrl: text('image_url'),
  status: postStatusEnum('status').notNull().default('draft'),
  publishedAt: timestamp('published_at', { mode: 'date' }),
  createdAt: timestamp('created_at', { mode: 'date' }).notNull().defaultNow(),
  updatedAt: timestamp('updated_at', { mode: 'date' }).notNull().defaultNow(),
})

export const galleryItems = pgTable('gallery_items', {
  id: serial('id').primaryKey(),
  type: galleryTypeEnum('type').notNull().default('image'),
  url: text('url').notNull(),
  caption: text('caption'),
  sortOrder: integer('sort_order').notNull().default(0),
  createdAt: timestamp('created_at', { mode: 'date' }).notNull().defaultNow(),
})

export const services = pgTable('services', {
  id: serial('id').primaryKey(),
  name: varchar('name', { length: 255 }).notNull(),
  description: text('description'),
  price: varchar('price', { length: 50 }),
  duration: varchar('duration', { length: 50 }),
  sortOrder: integer('sort_order').notNull().default(0),
  active: boolean('active').notNull().default(true),
  createdAt: timestamp('created_at', { mode: 'date' }).notNull().defaultNow(),
})

export const invoices = pgTable('invoices', {
  id: serial('id').primaryKey(),
  bookingId: integer('booking_id'),
  customerName: varchar('customer_name', { length: 255 }).notNull(),
  customerEmail: varchar('customer_email', { length: 255 }).notNull(),
  amount: varchar('amount', { length: 50 }).notNull(),
  status: invoiceStatusEnum('status').notNull().default('draft'),
  dueDate: timestamp('due_date', { mode: 'date' }),
  paidAt: timestamp('paid_at', { mode: 'date' }),
  createdAt: timestamp('created_at', { mode: 'date' }).notNull().defaultNow(),
})

export const siteContent = pgTable('site_content', {
  id: serial('id').primaryKey(),
  sectionKey: varchar('section_key', { length: 255 }).notNull().unique(),
  content: jsonb('content').notNull().default({}),
  updatedAt: timestamp('updated_at', { mode: 'date' }).notNull().defaultNow(),
})

export const adminUsers = pgTable('admin_users', {
  id: serial('id').primaryKey(),
  email: varchar('email', { length: 255 }).notNull().unique(),
  passwordHash: varchar('password_hash', { length: 255 }).notNull(),
  name: varchar('name', { length: 255 }),
  role: varchar('role', { length: 50 }).notNull().default('admin'),
  createdAt: timestamp('created_at', { mode: 'date' }).notNull().defaultNow(),
})
