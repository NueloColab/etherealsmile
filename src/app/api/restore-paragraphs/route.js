import { db } from '../../../lib/db'
import { siteContent } from '../../../lib/schema'
import { eq } from 'drizzle-orm'
import { NextResponse } from 'next/server'

export async function POST() {
  try {
    // Update About section
    const about = await db.select().from(siteContent).where(eq(siteContent.sectionKey, 'about'))
    if (about.length > 0) {
      const existing = about[0].content
      await db
        .update(siteContent)
        .set({
          content: {
            ...existing,
            heading: existing.heading || 'About Ethereal Smile',
            subtitle: existing.subtitle || 'Luxury crystal tooth gems, applied with precision',
            bodyText: `Tooth gems are small, dazzling crystals bonded to the surface of your teeth using a safe, dental-grade adhesive. They add a subtle sparkle to your smile, turning every conversation into a moment of quiet luxury. No drilling, no damage, just pure brilliance.\n\nWe use only genuine Swarovski and Preciosa crystals, the world's finest. Each gem is hand-selected for its cut, clarity, and fire. Whether you choose a single subtle stone or a constellation of sparkles, you're wearing the same quality trusted by luxury jewellers worldwide.\n\nEvery appointment is private, relaxed, and tailored to you. We consult on placement and style, apply your gem with meticulous care, and send you home with aftercare guidance.`,
            image: existing.image || '/hattie-portrait.jpg',
          },
          updatedAt: new Date(),
        })
        .where(eq(siteContent.sectionKey, 'about'))
    }

    // Update Hattie section
    const hattie = await db.select().from(siteContent).where(eq(siteContent.sectionKey, 'hattie'))
    if (hattie.length > 0) {
      const existing = hattie[0].content
      await db
        .update(siteContent)
        .set({
          content: {
            ...existing,
            heading: existing.heading || "Who's Hattie",
            subtitle: existing.subtitle || 'The face behind the sparkle',
            bodyText: `I'm Hattie Clifford, the founder and artist behind Ethereal Smile. What started as a fascination with the intersection of beauty and self-expression has grown into a passion for helping people discover a new kind of confidence, one tiny sparkle at a time.\n\nI trained extensively in tooth gem application and oral safety, ensuring every procedure meets the highest hygiene standards. But beyond the technical skill, what matters most to me is the experience: making sure every client feels comfortable, heard, and leaves with a smile that truly feels like their own.\n\nEvery crystal I place is chosen for its brilliance and quality. I work exclusively with Swarovski and Preciosa because I believe in using only the best. This isn't just a service; it's a collaboration between us, creating something beautiful together.`,
            portraitImage: existing.portraitImage || '/hattie-portrait.jpg',
            workingImage: existing.workingImage || '/hattie-working.jpg',
          },
          updatedAt: new Date(),
        })
        .where(eq(siteContent.sectionKey, 'hattie'))
    }

    return NextResponse.json({ success: true, message: 'Paragraphs restored' })
  } catch (err) {
    console.error('Restore error:', err)
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}
