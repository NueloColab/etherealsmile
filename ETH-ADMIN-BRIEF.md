# Ethereal Smile Admin — Rebuild Brief

## Problem
The current admin was built from scratch with inline styles and has been crashing repeatedly on auth issues. The front end has 10 sections all hardcoded in JSX with no CMS integration. This means every text change, image swap, or price update requires a developer.

## Architecture: CMS-First, Not Hardcoded

The front end MUST read all section content from the `site_content` database table via the CMS API. No section text, images, or prices should be hardcoded in JSX. The only things that stay in code are:
- Layout structure (section order, spacing, animations)
- Starfield/background effects
- Component types (card, grid, form)

Everything else — headings, body text, images, prices, time slots, service names — comes from `site_content`.

## Reference: NUVO CMS (copy this pattern exactly)

The NUVO project at `/Documents/Business/Nuvo/Code/nuvo-site/` has the exact admin CMS pattern to copy:

### Front End: Reads from CMS API
```jsx
// Each section component calls /api/cms?key=home
// and renders from the JSON data, not hardcoded text
const [content, setContent] = useState(null)
useEffect(() => {
  fetch('/api/cms?key=home').then(r => r.json()).then(setContent)
}, [])
```

### Admin: Section Editors
Each section gets its own editor page at `/admin/cms/home`, `/admin/cms/home-about`, etc.

Each editor:
1. Loads content from `/api/cms?key=home`
2. Renders editable fields for each piece of content
3. Saves back via PUT to `/api/cms`
4. Shows a save button with loading state

### CMS API (already exists at `/api/cms`)
- `GET /api/cms?key=home` → returns the full document for that key
- `PUT /api/cms` with `{ key: 'home', section: 'hero', content: {...} }` → updates a single section
- `PUT /api/cms` with the full document → replaces all sections

### site_content Table (already in schema)
```sql
CREATE TABLE site_content (
  id SERIAL PRIMARY KEY,
  section_key VARCHAR(255) UNIQUE NOT NULL,
  content JSONB NOT NULL DEFAULT '{}',
  updated_at TIMESTAMP NOT NULL DEFAULT NOW()
);
```

Each row stores one section's content as JSONB. The `key` for the Ethereal Smile sections:

| section_key | Content fields |
|---|---|
| `home` | hero heading, hero subtitle, hero CTA text, hero background image |
| `about` | heading, body text, image |
| `hattie` | heading, body text, portrait image, working image |
| `book` | heading, subtitle, available time slots (JSONB), booking intro text |
| `services` | heading, services array (name, description, price, duration, image, sort_order) |
| `gallery` | heading, items array (type, url, caption, sort_order) |
| `journal` | heading |
| `contact` | heading, email, phone, instagram link, tiktok link |
| `review` | heading, review link text, review URL |

## Admin Pages to Build

### 1. CMS Overview (`/admin/cms`)
Cards for each editable section. Click to edit. See NUVO's `app/admin/cms/page.jsx`.

### 2. Hero Editor (`/admin/cms/home`)
- Hero heading (text input)
- Hero subtitle (text input)
- Hero CTA button text (text input)
- Hero background image (Cloudinary upload)

### 3. About Editor (`/admin/cms/home-about`)
- Heading (text input)
- Body text (textarea)
- Image (Cloudinary upload)

### 4. Hattie Editor (`/admin/cms/home-hattie`)
- Heading (text input)
- Body text (textarea)
- Portrait image (Cloudinary upload)
- Working image (Cloudinary upload)

### 5. Book Editor (`/admin/cms/home-book`)
- Heading (text input)
- Subtitle (text input)
- Available time slots (add/remove, time picker)
- Booking intro text (textarea)

### 6. Services Editor (`/admin/cms/home-services`)
- Heading (text input)
- Services list (add/remove/reorder):
  - Name (text input)
  - Description (textarea)
  - Price (text input)
  - Duration (text input)
  - Image (Cloudinary upload)
  - Active toggle
  - Sort order (drag or up/down)

### 7. Gallery Editor (`/admin/cms/home-gallery`)
- Heading (text input)
- Upload images/videos (Cloudinary)
- Reorder (drag)
- Delete
- Add caption per item

### 8. Contact Editor (`/admin/cms/home-contact`)
- Heading (text input)
- Email (text input)
- Phone (text input)
- Instagram URL (text input)
- TikTok URL (text input)

### 9. Review Editor (`/admin/cms/home-review`)
- Heading (text input)
- Review link text (text input)
- Review URL (text input)

## Enquiry Management (already partially built)
The enquiry system is already in place. Keep these pages:
- `/admin/enquiries` — list of enquiries with status badges
- `/admin/enquiries/[id]` — enquiry detail with:
  - View enquiry details
  - Confirm: creates a booking, sends confirmation email with date/time
  - Propose different date/time: sends customer email with Accept/Reject buttons
  - Reject: sends polite rejection email
  - Customer confirmation page at `/booking/confirm/[token]`

### Booking Calendar (`/admin/enquiries/[id]`)
The booking section needs:
- A calendar showing available dates (Hattie manages availability)
- Time slot dropdown: 10:00, 11:30, 13:00, 14:30, 16:00
- When confirmed, creates a booking row in the `bookings` table
- Sends confirmation email via Resend (API key and SMTP from are already in Vercel env)

## Gallery Management (already has API and admin page)
- `/admin/gallery` — upload, reorder, delete images
- Uses Cloudinary for image uploads (Cloudinary creds in Vercel env)
- Gallery API at `/api/gallery` supports GET, POST, PUT, DELETE

## Blog/Journal Management (already has API and admin page)
- `/admin/blog` — create, edit, publish blog posts
- Blog API at `/api/blog-posts` supports GET, POST, PUT, DELETE
- Blog front end at `/journal/[slug]`

## Invoice System (schema exists, admin page needed)
- `/admin/invoices` — create and send invoices to customers
- Uses Resend for email delivery
- Invoice API at `/api/invoices` (needs building)

## Design Rules (CRITICAL)
- **Dark theme**: Black (#000000 or #0a0a0a) background throughout
- **Pink #e94480** as primary accent (NOT gold — this is the Ethereal Smile brand)
- **White text** for headings, lighter grey for body
- **Playfair Display** for headings
- **Inter** for body text
- **Pirata One** for the logo/brand stamp (used in current admin)
- **Underline inputs** (not boxed) — matches NUVO admin style
- **Gold #c9a96e** for secondary accents (review stars, dividers)
- NO em dashes anywhere
- Mobile responsive — Hattie will check bookings on her phone

## Tech Stack
- Pure JS (NO TypeScript)
- Drizzle ORM with Neon Postgres
- NextAuth for admin authentication
- Cloudinary for image uploads
- Resend for email (env vars already in Vercel)
- Tailwind CSS for admin styling (already in dependencies)
- Lucide React for icons (already in dependencies)
- shadcn/ui components where possible (buttons, inputs, dialogs, tables)

## DO NOT
- Build admin components from scratch with inline styles
- Hardcode section content in JSX
- Create a new admin layout when NUVO's exists
- Use a different auth system than NextAuth
- Use a different component library than shadcn/ui + Tailwind
- Leave sections as hardcoded — every text, image, and price must come from site_content

## Reference Files
- NUVO admin layout: `/Documents/Business/Nuvo/Code/nuvo-site/app/admin/layout.jsx`
- NUVO admin sidebar: `/Documents/Business/Nuvo/Code/nuvo-site/components/AdminSidebar.jsx`
- NUVO CMS overview: `/Documents/Business/Nuvo/Code/nuvo-site/app/admin/cms/page.jsx`
- NUVO CMS section editor: `/Documents/Business/Nuvo/Code/nuvo-site/app/admin/cms/home-about/page.jsx`
- NUVO useCmsContent hook: `/Documents/Business/Nuvo/Code/nuvo-site/lib/useCmsContent.js`
- NUVO CMS API: `/Documents/Business/Nuvo/Code/nuvo-site/app/api/cms/route.ts`
- Ethereal Smile schema: `/src/lib/schema.js` (already has site_content table)
- Ethereal Smile existing admin: `/src/app/admin/` (dashboard, enquiries, services, blog, gallery pages)
- Ethereal Smile front sections: `/src/app/sections/` (Hero, About, Hattie, Book, Services, Gallery, Journal, Contact, Review)