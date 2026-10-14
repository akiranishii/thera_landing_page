# thera. — The Relationship Assistant (marketing site)

The launch website for **Thera**, a voice-first AI relationship assistant and location-aware personal CRM. A single responsive landing page with working navigation, scripted interactive product demonstrations, and a real early-access waitlist.

> **Thera is a working brand name pending naming clearance.** The name is read from one place, `src/config/brand.ts` (or the `NEXT_PUBLIC_BRAND_NAME` environment variable), and flows into every headline, metadata field, and UI label.

## Stack

- Next.js 16 (App Router) + React 19 + TypeScript
- Tailwind CSS v4 (design tokens live in `src/app/globals.css`)
- Motion (`motion/react`) for restrained, reduced-motion-aware animation
- Lucide icons
- Waitlist persistence: Supabase (via its REST API, no client library) or a local JSON-lines file
- Fonts: Inter (UI) and Newsreader italic (editorial emphasis) via `next/font`

No real AI, speech, calendar, or location service is used anywhere on the page. Every demonstration runs on local sample data (`src/config/demo-data.ts`), and every example person is fictional.

## Local development

Requires Node 20.9+ and npm.

```bash
npm install
cp .env.example .env.local   # optional; see "Waitlist" below
npm run dev                  # http://localhost:3000
```

Other scripts:

```bash
npm run lint     # eslint
npx tsc --noEmit # type-check
npm run build    # production build
npm run start    # serve the production build
```

In development the waitlist form writes to `data/waitlist.jsonl` (git-ignored) with no configuration, so the full signup flow works out of the box.

## Waitlist

`POST /api/waitlist` accepts `{ email, role?, website, startedAt }` and returns `{ ok: true, status: "created" | "exists" }` or `{ ok: false, error, code }`. It performs server-side email validation, role validation, duplicate handling (case-insensitive), a honeypot check, a time-to-submit check, and a small per-IP rate limit. Privileged keys never reach the browser.

The form only shows "You're on the list" after the server confirms the row was written. If no store is configured in production, the API returns `503` and the form shows an error instead of a fake success.

Storage is chosen from environment variables, in this order:

| Variables | Store |
| --- | --- |
| `SUPABASE_URL` + `SUPABASE_SERVICE_ROLE_KEY` (+ optional `SUPABASE_WAITLIST_TABLE`, default `waitlist`) | Supabase table (recommended for Vercel) |
| `WAITLIST_STORE=file` (+ optional `WAITLIST_FILE`, default `data/waitlist.jsonl`) | JSON-lines file; only for a server with a persistent disk |
| none, outside production | JSON-lines file (development convenience) |
| none, in production | Not configured: API returns `503` |

To use Supabase: create a project, run `supabase/waitlist.sql` in the SQL editor, then set the two variables above. The service-role key is used server-side only; row-level security stays on with no public policies.

Rows are read with:

```sql
select email, role, created_at from public.waitlist order by created_at desc;
```

## Deployment (Vercel)

1. Push this directory to a Git repository and import it in Vercel. `vercel.json` pins the framework preset to Next.js, so no custom build settings are needed.
2. Add environment variables in the Vercel project:
   - `SUPABASE_URL`, `SUPABASE_SERVICE_ROLE_KEY` (required for signups to work)
   - `NEXT_PUBLIC_SITE_URL` set to the canonical URL if it differs from the Vercel production domain (used for Open Graph and structured data; without it the production domain is used)
   - optionally `NEXT_PUBLIC_CONTACT_EMAIL` (turns the footer "Contact" link into a `mailto:`) and `NEXT_PUBLIC_BRAND_NAME`
3. Deploy. The page is statically prerendered; only `/api/waitlist` runs on demand.

The in-memory rate limiter is per server instance. On serverless platforms it is a first line of defense only; the database's unique constraint on `email` is the real backstop against duplicates.

## Project layout

```
src/
  app/
    layout.tsx            fonts, metadata, JSON-LD
    page.tsx              section order
    globals.css           Blue Haze design tokens, base styles, reduced-motion rules
    icon.svg, apple-icon.png, opengraph-image.tsx
    api/waitlist/route.ts signup endpoint
  config/
    brand.ts              brand name, tagline, site URL (the one place to rename the product)
    copy.ts               all homepage copy, in page order
    demo-data.ts          fictional people, cities, calendar, scenarios, profiles
    roles.ts              waitlist role options (shared by form and API)
    logo.ts               the mark's paths and colours (single source for every logo rendering)
  components/
    layout/               Navbar, Footer
    sections/             Hero, Problem, Features, DemoSection, Discover, HowItWorks, Philosophy, Privacy, EarlyAccess
    product/              PhoneMockup, ContactCard, CalendarPreview, CalendarWeek, VoiceAssistantPreview,
                          CitySelector, VoiceNoteDemo, ContactProfile, SchedulingDemo, InteractiveDemo,
                          TalentProfile, RelationshipTimeline, AssistantNote
    forms/WaitlistForm.tsx
    ui/                   Button, Container, SectionHeading, Eyebrow, Reveal, Avatar, Badge, Card, Waveform, Wordmark, DemoLabel
  lib/waitlist/           validate.ts, store.ts (Supabase / file adapters), rate-limit.ts
  lib/useReducedMotion.ts hydration-safe reduced-motion preference
  assets/fonts/           static Inter TTFs for the Open Graph image
supabase/waitlist.sql     table definition
```

## Design notes

- Logo: the "Caldera and Sunken Head" mark, a disc split by a goddess profile. The ink crescent is the cliffs of Thera, the sea-blue half is the sunken head, and the dot is the island she looks toward. Paths live in `src/config/logo.ts`; `BrandSymbol` renders the two-tone mark at 20 px and up and the simplified 16 px cut for small glyphs. The favicon (`src/app/icon.svg`) switches to a light fill in dark-mode browsers, and `src/app/apple-icon.png` is the dark tile. Source files, construction notes and the logo exploration are in `design/logos/`.

- Palette ("Blue Haze"): off-white `#F7F9FA` background, white cards, `#EAF0F4` secondary surfaces, `#466680` primary buttons, `#223848` headings, `#586C79` body text, `#DDE6EC` borders, with the four pastel calendar colors for meetings, personal, networking and travel blocks. Small secondary text uses `#5D7488` so it meets a 4.5:1 contrast ratio on light surfaces.
- The Philosophy section uses the dark slate `#1C2E3D` with warm white type.
- Every animation is skipped or shortened when the visitor prefers reduced motion; smooth anchor scrolling is disabled too.
- Everything illustrative is labelled as such on the page: the hero phone, each feature demo, the interactive concept preview, the researcher profile, and the "Planned" integrations in How it Works.

## What is intentionally not claimed

No usage statistics, testimonials, integrations, certifications, or launch dates appear on the page. The privacy section describes the intended model and says operational details will be published as each piece ships.
