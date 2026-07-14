# Ethereal Smile — Full Website Build Handoff

## Project Overview
- **Client**: Hattie Clifford (etherealsmilex@gmail.com)
- **Business**: Swarovski & Preciosa crystal tooth gems
- **Domain**: etherealsmile.co.uk (live, pointing to Vercel)
- **Vercel project ID**: `prj_GxPKbDxGMgKJVAnQd6JM2b2oDiMb`
- **GitHub**: NueloColab/etherealsmile
- **Current live site**: "Coming Soon" holding page on `main` branch

## Branch Strategy
- **`main`** = current holding page (LIVE, do NOT modify)
- **`feature/full-website`** = build the full website here (you are on this branch)
- When ready, Rory reviews the diff and merges to main

## Brand
- **Brand name**: Ethereal Smile
- **Tagline**: "Genuine Swarovski & Preciosa Crystal Tooth Gems"
- **Colours**: Black background, gold #c9a96e, white text, subtle sparkle
- **Fonts**: Playfair Display (headings), Inter (body)
- **Socials**: @etherealsmilex (Instagram, TikTok), etherealsmilex@gmail.com
- **Credit**: "by Hattie Clifford"

## Brand Assets (in /public/)
- `logo.jpg` - the illustrated mouth logo
- `brand-card-1.png` - brand card image
- `brand-card-2.png` - brand card image (used as hero on holding page)
- `hattie-portrait.jpg` - Hattie's portrait photo
- `hattie-working.jpg` - Hattie at work photo
- `favicon.svg` - favicon

## Tech Stack
- Next.js 14.2.35 (pure JS, NO TypeScript)
- React 18.2.0
- Node 24.x on Vercel
- No UI framework — custom CSS only (matches luxury aesthetic)

## What to Build
A full multi-page website for a tooth gem business. Pages needed:

### 1. Home (Hero + overview)
- Dramatic hero section with sparkle animation (keep the starfield from holding page)
- Brand logo, tagline
- Brief intro to what Ethereal Smile offers
- Call-to-action buttons (Book Now, View Gems)

### 2. About / The Artist
- Hattie Clifford profile
- Her story, qualifications, approach
- Use hattie-portrait.jpg and hattie-working.jpg
- Professional but personal tone

### 3. Gems / Services
- Showcase the tooth gem options (Swarovski, Preciosa)
- Pricing info if available (or "Contact for pricing")
- Gallery of gem styles
- Use brand-card images

### 4. Gallery
- Before/after photos (placeholder sections for now)
- Grid layout with lightbox/modal
- Luxury dark aesthetic

### 5. Book / Contact
- Booking inquiry form (name, email, phone, preferred date, message)
- Social links (Instagram, TikTok, email)
- Map or location info (placeholder for now)

### 6. FAQ
- Common questions about tooth gems (are they safe, how long do they last, etc.)
- Accordion or expandable sections

## Design Rules
- **Black/cosmic background** throughout (not white)
- **Gold #c9a96e** as primary accent colour
- **Playfair Display** for headings, **Inter** for body text
- Subtle sparkle/star animations (carry over from holding page)
- Luxury feel — think jewellery brand, not dental clinic
- Mobile-first responsive design
- Smooth transitions and hover effects
- NO em dashes ever
- NO pink or magenta anywhere

## Current Holding Page
The current `main` branch has a single-page holding page with:
- Starfield animation (50 stars, some gold)
- Floating brand logo animation
- "Ethereal Smile" heading + tagline
- "Coming Soon" text
- Social links (Instagram, TikTok, Email)
- "by Hattie Clifford" footer

Keep the starfield and brand elements, but expand into a full site.

## Deployment
- Vercel project already connected to GitHub repo
- Pushes to `main` auto-deploy to etherealsmile.co.uk
- `feature/full-website` branch can be previewed on Vercel preview URLs
- Node version on Vercel: 24.x

## Working Conventions
1. Stay on `feature/full-website` branch at all times
2. NEVER push to `main` — that's the live holding page
3. NEVER push to origin — Brian reviews and pushes
4. Read existing code before modifying
5. Run `npx next build` to verify it compiles after changes
6. Diagnose before reporting — if something breaks, say what you tried and what the error is
7. Never report done without evidence — paste actual code changes or build output
8. No em dashes ever

## Key Files
- `src/app/page.jsx` — current holding page (will become home page)
- `src/app/layout.jsx` — root layout with metadata
- `src/app/globals.css` — global styles
- `public/*` — brand assets