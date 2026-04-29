# Project: Atlantic — Cereal & Soy Products Platform

## Business Context
Atlantic is an Algerian company specialising in cereals and soy products.
Currently sells: maïs (corn), orge (barley), soja (soybeans), coque de soja
(soybean hulls). More products may be added over time.

The company has two customer types:
- General market customers who see **public prices** on the vitrine
- Contracted clients who get **negotiated prices** via a private client portal (Phase 2)

## Tech Stack (current — do not change unless asked)
- **Next.js 16.2.4** with App Router
- **React 19.2.4**
- **TypeScript**
- **Tailwind CSS v4** — config lives in `src/app/globals.css`. There is NO
  `tailwind.config.ts` (it does not exist). Do not create one.
- **shadcn/ui** — style: `base-nova`, baseColor: `neutral`
- **Supabase** (cloud) — Postgres, Auth, RLS
- **Hosting target**: Vercel (not yet deployed)
- **Routing**: `src/proxy.ts` (Next.js 16 convention — this replaces the
  `src/middleware.ts` used in older Next.js versions; do not create or rename)

## Current Status — what is actually built
- ✅ Public vitrine fully built and styled (Atlantic brand, grain/soy positioning)
- ✅ Pages: `/` (homepage), `/produits`, `/prix`, `/a-propos`, `/services`, `/contact`
- ✅ Sticky header with French nav, footer with company info
- ✅ Public daily prices visible to all visitors via `current_prices` view
- ✅ Admin login at `/login` (Supabase Auth)
- ✅ Admin dashboard at `/admin` — price editor tab + clients tab
- ✅ Three-layer security: `src/proxy.ts` redirect + `requireStaff()` / `requireClient()` guards + RLS
- ✅ Audit log via DB triggers on price changes
- ✅ Auth routing: `/auth/redirect` reads role → staff go to `/admin`, clients go to `/portal`
- ✅ Client portal at `/portal` — shows negotiated prices per client
- ✅ Admin can create client accounts and assign per-product negotiated prices
- ✅ Product catalogue: Maïs, Orge, Soja, Coque de soja (migration 0003 applied)
- ⚠️ Contact form UI exists at `/contact` but does NOT send email and has no backend storage
  → `contact_messages` table was never created in Supabase
  → Fix: wire up Resend for email delivery (next session)

## Architecture Rules — NON-NEGOTIABLE

### 1. Modular business logic
All Supabase queries go through `src/lib/modules/[domain]/queries.ts` or
`mutations.ts`. **Never inline queries inside pages or components.**

### 2. Server vs Client components
Server Components are the default. Use Client Components only when truly needed
(forms, interactivity, hooks). **Never import `src/lib/supabase/server.ts` into
a Client Component** — it depends on `next/headers` and will break at runtime.

### 3. No API routes by default
This project uses Server Components and Server Actions instead of API routes.
An `api/` directory does not exist and should not be created unless there is a
specific need that cannot be met by Server Actions.

### 4. Route groups
| Group | Path | Purpose |
|---|---|---|
| `(vitrine)` | `/` | Public showcase site |
| `(admin)` | `/admin` | Atlantic staff dashboard |
| `(auth)` | `/login`, `/logout` | Shared auth flows |
| `(client-portal)` | `/portal` | Contracted clients (Phase 2) |

### 5. Component organisation
```
src/components/
  vitrine/       ← public site only
  admin/         ← admin dashboard only
  client-portal/ ← client portal only (Phase 2)
  ui/            ← shadcn primitives
  shared/        ← used by multiple areas (create folder when first needed)
```
**Convention**: if a component is used by both vitrine AND admin/portal, place
it in `src/components/shared/`. The folder does not exist yet — create it when
the first shared component is needed.

### 6. Brand
- **Company**: Atlantic
- **Language**: French only — do NOT add multi-language support
- **Colors**: primary `#1a3d2e` (deep green), accent `#c9a961` (gold),
  cream `#faf8f3` (background), wheat `#e8dcc4` (surfaces),
  charcoal `#2d2d2d` (body text), muted `#6b6b6b` (secondary text)
- **Fonts**: Playfair Display (serif headings) + Inter (sans body)
- **Currency**: DZD (Algerian Dinar)
- **Mood**: Established, trustworthy, premium agricultural business

## Actual File Structure (as of Phase 1 completion)
```
src/
├── app/
│   ├── (admin)/admin/page.tsx
│   ├── (auth)/login/page.tsx
│   ├── (auth)/logout/route.ts
│   ├── (client-portal)/portal/page.tsx   ← scaffolded only
│   ├── (vitrine)/
│   │   ├── layout.tsx
│   │   ├── page.tsx                      ← homepage
│   │   ├── a-propos/page.tsx
│   │   ├── contact/page.tsx
│   │   ├── prix/page.tsx
│   │   ├── produits/page.tsx
│   │   └── services/page.tsx
│   ├── globals.css                       ← Tailwind v4 config lives here
│   ├── layout.tsx
│   └── not-found.tsx
├── components/
│   ├── admin/price-editor.tsx
│   ├── ui/                               ← shadcn primitives
│   └── vitrine/
│       ├── contact-form.tsx
│       ├── footer.tsx
│       ├── header.tsx
│       └── product-grid.tsx
├── lib/
│   ├── auth/guards.ts                    ← contains requireStaff() only
│   ├── modules/
│   │   ├── client-pricing/              ← placeholder for Phase 2
│   │   │   ├── queries.ts
│   │   │   └── types.ts
│   │   ├── contact/
│   │   │   ├── mutations.ts
│   │   │   ├── schemas.ts
│   │   │   └── types.ts
│   │   ├── prices/
│   │   │   ├── mutations.ts
│   │   │   ├── queries.ts
│   │   │   ├── schemas.ts
│   │   │   └── types.ts
│   │   └── products/
│   │       ├── queries.ts
│   │       └── types.ts
│   ├── supabase/
│   │   ├── admin.ts
│   │   ├── client.ts
│   │   ├── server.ts
│   │   └── session.ts                   ← used by src/proxy.ts
│   └── utils.ts
└── proxy.ts                              ← Next.js 16 routing/auth guard
```

## Database Schema
Source of truth: `supabase/migrations/0001_initial_schema.sql` and
`supabase/migrations/0002_add_contact_messages.sql`

| Table | Purpose |
|---|---|
| `profiles` | User metadata + role (`admin` / `employee` / `client`) |
| `products` | Product catalogue |
| `daily_prices` | Public daily prices (one per product per day) |
| `customer_prices` | Per-client negotiated prices (Phase 2 — table exists, feature not built) |
| `price_audit_log` | Automatic audit via DB triggers |
| `contact_messages` | Contact form submissions |

**View**: `current_prices` — latest price per active product; this is what the
public vitrine reads.

**Function**: `is_staff()` — returns true if current user has role `admin` or
`employee`. Used in RLS policies.

All tables have RLS enabled. All code must respect these policies.

## How Claude Code Should Work in This Project
1. **Audit before action.** Read CLAUDE.md and relevant files first. Report
   findings before changing anything.
2. **Wait for approval.** After proposing a plan, wait for the user to confirm
   before writing files.
3. **Stay in scope.** Don't propose improvements, refactors, or features outside
   what's asked.
4. **Don't break what works.** `/admin`, `/login`, public price flow, and the
   contact form must keep working after any change.
5. **Suggest commits, don't run them.** Propose a commit message; let the user
   run `git commit` themselves.
6. **One task per session.** When a task is done, stop. Don't accumulate
   unrelated changes.

## Lessons Learned
- Tailwind v4 moves config to CSS — don't look for or create `tailwind.config.ts`
- Next.js 16 uses `src/proxy.ts` (not `src/middleware.ts`) — do not rename it
- **Never** import `src/lib/supabase/server.ts` into a Client Component
- Restart the dev server (`Ctrl+C`, `npm run dev`) when CSS or env changes
  don't appear in the browser

## Phase Roadmap
| Phase | Status |
|---|---|
| Phase 1 — Public vitrine + admin price editor | COMPLETE |
| Repositioning to grain/soy focus (fix stale copy) | PENDING — next session |
| Phase 2 — Client portal with negotiated prices | NOT STARTED |
