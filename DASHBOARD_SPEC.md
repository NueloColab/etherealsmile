# Ethereal Smile Admin Dashboard Spec

## Current State
- 4 basic stat cards: Enquiries, Journal Posts, Gallery Items, Services
- Recent Enquiries table (5 rows)
- No bookings, no clients, no consent records, no calendar, no revenue

## New Dashboard Layout

### Top Stats Row (8 cards, 4 per row on desktop)
1. **Pending Bookings** (count, pink accent, links to /admin/bookings?filter=pending)
2. **Confirmed (Upcoming)** (count of confirmed bookings with date >= today, green accent)
3. **Total Clients** (count, gold accent, links to /admin/clients)
4. **Consent Pending** (count of records with status 'sent' or 'viewed', blue accent)
5. **Consent Signed** (count of records with status 'signed', teal accent)
6. **Enquiries** (count, pink accent, links to /admin/enquiries)
7. **Journal Posts** (count, gold accent)
8. **Revenue** (sum of booking prices where status='confirmed', formatted as GBP)

### Calendar Section
- Inline mini calendar (same component as BookingCalendar but compact)
- Shows this month, clickable days
- Below calendar: today's bookings + next 7 days of bookings
- Each booking row: date, time, customer, service, status badge, link to detail

### Recent Activity Section
- Left column: Recent Bookings (last 10, newest first)
- Right column: Recent Consent Activity (last 10: signed/sent/viewed)
- Each shows date, name, type, status badge

### Quick Actions Row
- "New Booking" link (could just link to bookings page)
- "Send Consent Form" (link to client list)
- "View Calendar" (link to bookings calendar view)

## API Data Needed
The dashboard page (server component) needs to query:
- bookings: count by status, confirmed with date >= today, recent 10
- clients: total count
- consent_records: count by status (sent, viewed, signed, declined, expired)
- enquiries: recent 5 (already have)
- services: count (already have)
- Revenue: SUM of booking price where confirmed (this is tricky since price is varchar)

## Style
- Dark navy background (#0a0e17), pink (#e94480) and gold (#c9a96e) accents
- Pirata One for headings, Inter for body
- Rounded cards with subtle borders (rgba(255,255,255,0.06))
- Hover effects on stat cards (lift + pink border glow)
- Mobile responsive: 2-col grid on mobile for stats

## Existing Components to Reuse
- DashboardStats (already exists, just needs more stats)
- BookingCalendar (import from bookings page)
- STATUS_STYLES object from bookings page

## File Changes
- Rewrite `src/app/admin/page.jsx` (server component, queries DB directly)
- Rewrite `src/components/DashboardStats.jsx` (add more stat cards, better layout)
- Create `src/components/DashboardCalendar.jsx` (compact calendar + upcoming bookings list)
- Create `src/components/DashboardActivity.jsx` (recent bookings + consent activity side by side)

## Revenue Note
Booking price is a VARCHAR (e.g. "£35", "£50", "Free"). Need to parse:
- Strip £ and commas, parse as number
- "Free" or empty = 0
- SUM the parsed values for confirmed bookings
- This should be done in JS on the server, not SQL

## Consent Status Colors (match existing ConsentRecordsPanel)
- sent: blue #4A8FD9
- viewed: purple #7B6BA5
- signed: teal #2EC4B6
- declined: muted white
- expired: muted white

## Booking Status Colors (match existing)
- pending: pink #e94480
- confirmed: green #4ade80
- rejected: red #f87171
- cancelled: muted white