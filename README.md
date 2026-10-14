# Marivento: boutique hotel website with direct booking

A fictional 24-room boutique hotel on the Amalfi Coast, built by MYFRIX as a concept project. It shows a complete direct-booking hotel website: marketing pages, a five-step booking engine, booking management, an admin dashboard and an AI concierge.

Stack: Next.js 14 (App Router), TypeScript (strict), Tailwind CSS, GSAP + Lenis, next/font (Fraunces, DM Sans). Optional: Postgres (Neon), Stripe, Resend, Anthropic.

## Run locally

```
npm install
npm run dev
```

Open http://localhost:3000. Everything works immediately in **demo mode**, with no accounts or keys.

- `npm run build` then `npm start`: production build
- `npm run check:links`: verifies every internal link, anchor and image

## What's inside

| Area | Routes |
|---|---|
| Marketing | `/`, `/rooms`, `/rooms/[slug]` (6 rooms), `/dining`, `/spa`, `/experiences`, `/offers`, `/our-story`, `/getting-here`, `/faq`, `/policies` |
| Booking | `/book` (dates → room & rate → extras → details → confirm), `/book/confirmation`, `/manage` |
| Admin | `/admin` (KPIs, 14-day occupancy grid, reservations list, date blocking) |
| API | `/api/calendar`, `/api/quote`, `/api/book`, `/api/ics`, `/api/manage`, `/api/manage/cancel`, `/api/concierge`, `/api/admin/*` |

### Booking rules (in `src/lib/booking/engine.ts`)
- Open 1 April – 31 October. Shoulder season (Apr, May, Oct) and high season (Jun–Sep); Friday and Saturday nights +10%.
- Minimum stay: 2 nights (shoulder), 3 nights (high). Maximum 21 nights online.
- Rates: Flexible (pay first night now, free cancellation until 7 days before arrival) and Non-refundable (12% off, paid in full).
- Stay Longer offer: the 5th night is free for stays of 5+ nights.
- Breakfast optional (€32 adult / €16 child per night). City tax €5 per adult per night (max 7) shown before payment and paid at the hotel.
- Prices are always recalculated on the server. Every displayed price is the total price including all mandatory hotel charges.

### Demo mode vs live mode
| Feature | Demo (default) | Live (add environment variables) |
|---|---|---|
| Availability | Realistic generated occupancy | Real bookings in Postgres (`DATABASE_URL`) |
| Payment | "Confirm demo booking" | Stripe Checkout in test mode (`STRIPE_SECRET_KEY`) |
| Confirmation email | Confirmation page, calendar file, print | Email to guest and hotel (`RESEND_API_KEY`, `EMAIL_FROM`, `HOTEL_INBOX`) |
| Manage booking | Bookings saved in the guest's browser | Look-up by reference + email, online cancellation |
| Admin | Read-only sample data | Password login (`ADMIN_PASSWORD`), live data, block dates |
| Concierge | Scripted answers from hotel data | Claude answers (`ANTHROPIC_API_KEY`) |

Confirmation links are signed with `BOOKING_SECRET` (HMAC), so they cannot be tampered with. Set a long random value in production.

### Switching on the database
1. In Vercel, open your project, go to **Storage → Create → Neon (Postgres)** and connect it. This adds `DATABASE_URL`.
2. Open the Neon SQL editor and run `db/schema.sql` once.
3. Add `ADMIN_PASSWORD` and `BOOKING_SECRET`, then redeploy.

### Switching on Stripe (test mode)
Create a free Stripe account, copy the **test** secret key (`sk_test_…`) into `STRIPE_SECRET_KEY`, set `NEXT_PUBLIC_SITE_URL` to your live URL, and redeploy. Pay with card `4242 4242 4242 4242`, any future date and any CVC.

## Editing content
- Hotel details, dining, spa, experiences, offers, FAQs, story: `src/lib/data/hotel.ts`
- Rooms, prices, extras, rate plans: `src/lib/data/rooms.ts`
- Images: `public/images/*.webp` (keep file names when replacing)

## Quality
- SEO: Hotel and HotelRoom structured data (prices match the page), FAQPage, breadcrumbs, sitemap, robots, canonical URLs and Open Graph.
- Accessibility: skip link, keyboard-operable calendar (arrow keys), labelled forms with inline errors, focus states, reduced-motion support.
- Performance: static marketing pages, pre-compressed WebP images, minimal JavaScript on booking steps.

## Deploy
Push this `website` folder to GitHub, import it at vercel.com/new, set `NEXT_PUBLIC_SITE_URL` and `BOOKING_SECRET`, and deploy.
