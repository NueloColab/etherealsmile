# Ethereal Smile — Full Website Build Handoff

## Project Overview
- **Client**: Hattie Clifford (etherealsmilex@gmail.com)
- **Business**: Swarovski & Preciosa crystal tooth gems
- **Domain**: etherealsmile.co.uk (live, pointing to Vercel)
- **Vercel project ID**: `prj_GxPKbDxGMgKJVAnQd6JM2b2oDiMb`
- **GitHub**: NueloColab/etherealsmile
- **Current live site**: "Coming Soon" holding page on `main` branch
- **Neon DB**: Can create a new database on `ep-blue-mountain-aba1iy84` (shared with other Nuelo projects)

## Branch Strategy
- **`main`** = current holding page (LIVE, do NOT modify)
- **`feature/full-website`** = build the full website here (YOU ARE ON THIS BRANCH)
- When ready, Rory reviews the diff and merges to main
- NEVER push to origin — Brian reviews and pushes

## Architecture
- Next.js 14+ (pure JS, NO TypeScript)
- Node 24.x on Vercel
- Neon Postgres for database (new DB: `etherealsmile` on existing cluster)
- Drizzle ORM (matches our other projects)
- NextAuth or similar for admin authentication
- Admin dashboard at `/admin`
- No UI component library — custom CSS matching the luxury brand aesthetic

## Brand
- **Brand name**: Ethereal Smile
- **Tagline**: "Genuine Swarovski & Preciosa Crystal Tooth Gems"
- **Colours**: Black background (#000000 or near-black), gold #c9a96e, white text, subtle sparkle
- **Fonts**: Playfair Display (headings), Inter (body text)
- **Socials**: @etherealsmilex (Instagram, TikTok), etherealsmilex@gmail.com
- **Credit**: "by Hattie Clifford"
- **NO pink or magenta anywhere. NO em dashes. NO AI templates.**

## Brand Assets (in /public/)
- `logo.jpg` — the illustrated mouth logo
- `brand-card-1.png` — brand card image
- `brand-card-2.png` — brand card image (used as hero on holding page)
- `hattie-portrait.jpg` — Hattie's portrait photo
- `hattie-working.jpg` — Hattie at work photo
- `favicon.svg` — favicon

## Page Structure (Top to Bottom, Single-Page Scroll with Sections)

### 1. Hero Section
- **Static glittering stars background** — stars are always visible, subtle, cosmic
- Logo scrolls with the page (parallax or scroll-based positioning)
- Brand name + tagline
- CTA: "Book Now" button
- The starfield is THE defining visual — every section should feel like you're scrolling through space
- Some sections semi-transparent (stars visible behind), some with clear solid borders/cards that frame against the stars

### 2. About Ethereal Smile
- What tooth gems are
- Why Swarovski & Preciosa
- The experience, the luxury feel
- Semi-transparent section with stars peeking through

### 3. Who's Hattie
- Hattie Clifford profile
- Use hattie-portrait.jpg and hattie-working.jpg
- Her story, qualifications, approach
- Professional but personal — this is a person, not a clinic

### 4. Book — Calendar Enquiry System
- **NOT instant booking** — this is an enquiry system
- Customer picks a preferred date from a calendar
- Fills in name, email, phone, message
- Submission goes to admin as an enquiry
- Hattie reviews and confirms/rejects in the backend
- Once confirmed, it becomes a booking in her diary
- Calendar shows available dates (Hattie manages availability in admin)

### 5. Services & Price List
- Tooth gem options with prices
- Swarovski crystals, Preciosa crystals, different styles/sizes
- Clean pricing table or cards
- Semi-transparent section with stars behind

### 6. Gallery
- Photos and videos of tooth gems
- Grid layout with lightbox/modal
- Before/after shots
- Luxury dark aesthetic — no white gallery cards
- Placeholder sections if no content yet

### 7. Journal / Blog
- Blog posts about tooth gems, aftercare, trends
- Card layout with featured images
- Individual post pages at /journal/[slug]

### 8. Book Again (bottom CTA)
- Second "Book Now" call-to-action
- Different design from the hero book button — maybe a full-width section
- Links to the booking/enquiry section

### 9. Contact
- Contact form (name, email, message)
- Or links to the booking calendar
- Social links

### 10. Leave a Review
- Link to Google Reviews page
- Simple section, maybe with a button "Leave us a review on Google"

### Footer
- Instagram link (@etherealsmilex)
- TikTok link (@etherealsmilex)
- Small "Admin" link (goes to /admin, discrete)
- "by Hattie Clifford" credit

## Admin Dashboard (/admin)

Build the admin AS you build the front — don't leave it for later.

### Admin Features Required:
1. **CMS for Front Page** — Edit hero text, about section, services, any content on the homepage
2. **Calendar & Booking Management** — View enquiries, confirm/reject bookings, set available dates, manage diary
3. **Messages from Contact/Enquiries** — View and reply to contact form submissions and booking enquiries
4. **Journal/Blog Section** — Create, edit, publish, delete blog posts with images
5. **Send Invoice** — Create and send invoices to customers
6. **Gallery Management** — Upload, reorder, delete gallery images and videos

### Admin Design
- Dark theme to match the brand (not generic white admin)
- Gold accents for actions/buttons
- Clean, minimal — Hattie isn't techy, make it simple
- Mobile-friendly — she'll probably check bookings on her phone

## Design Rules (CRITICAL)
- **Black/cosmic background** throughout — the starfield is ALWAYS present
- **Gold #c9a96e** as primary accent colour
- **White text** for headings, lighter grey for body
- **Playfair Display** for headings, **Inter** for body text
- Sections flow like scrolling through space — stars visible between and behind content
- Some sections semi-transparent (glass effect), some with solid borders that frame against stars
- Subtle sparkle animations (carry over from holding page)
- Luxury feel — jewellery brand, not dental clinic
- Mobile-first responsive design
- Smooth transitions and hover effects
- **NO AI TEMPLATES** — we've built enough high-standard websites to know the standard expected
- **NO em dashes ever**
- **NO pink or magenta anywhere**

## Current Holding Page
The `main` branch has a single-page holding page with starfield animation, floating logo, "Coming Soon", social links. Keep the starfield and brand elements, but expand into the full site described above.

## Database Schema (Starting Point)

### enquiries
- id, name, email, phone, preferred_date, message, status (pending/confirmed/rejected/cancelled), created_at, confirmed_at, notes

### bookings
- id, enquiry_id (nullable), name, email, phone, date, time_slot, service, status, price, notes, created_at

### blog_posts
- id, title, slug, content, excerpt, image_url, status (draft/published), published_at, created_at, updated_at

### gallery_items
- id, type (image/video), url, caption, sort_order, created_at

### services
- id, name, description, price, duration, sort_order, active

### invoices
- id, booking_id (nullable), customer_name, customer_email, amount, status (draft/sent/paid/overdue), due_date, paid_at, created_at

### site_content (CMS)
- id, section_key, content (jsonb), updated_at

### admin_users
- id, email, password_hash, name, role, created_at

## Deployment
- Vercel project connected to GitHub repo
- Pushes to `main` auto-deploy to etherealsmile.co.uk
- `feature/full-website` branch gets preview URLs
- Node version on Vercel: 24.x

## Working Conventions
1. Stay on `feature/full-website` branch at all times
2. NEVER push to `main` — that's the live holding page
3. NEVER push to origin — Brian reviews and pushes
4. Read existing code before modifying
5. Run `npx next build` to verify it compiles after changes
6. Diagnose before reporting — say what you tried, what the error is, what you need
7. Never report done without evidence — paste actual code changes or build output
8. No em dashes ever
9. Build admin as you build front — don't leave it for later

## Build Priority Order
1. Project setup: database, admin auth, API routes, base layout with starfield
2. Hero section (starfield + scroll logo)
3. About + Who's Hattie sections
4. Booking calendar + enquiry system (front + admin)
5. Services + Price List
6. Gallery
7. Journal/Blog (front + admin)
8. Contact + Review section
9. Invoice system (admin)
10. CMS for front page content (admin)