# Project: Atlantic — Cereal & Soy Products Platform

## Business Context
Atlantic is an Algerian company specialising in cereals and soy products.
Currently sells: maïs, orge, soja, coque de soja, blé dur, blé tendre,
farine de soja, son de blé. More products may be added over time.

The company has two customer types:
- General market customers who see **public prices** on the vitrine
- Contracted clients who get **negotiated prices** via a private client portal
- Clients have a **region** (text) and **client_type** (`gros` / `detail` / `supergros`)
- Admin can set segment prices by region OR by client type

## Tech Stack (current — do not change unless asked)
- **Next.js 16.2.4** with App Router
- **React 19.2.4**
- **TypeScript**
- **Tailwind CSS v4** — config lives in `src/app/globals.css`. There is NO
  `tailwind.config.ts` (it does not exist). Do not create one.
- **shadcn/ui** — style: `base-nova`, baseColor: `neutral`
- **Supabase** (cloud) — Postgres, Auth, RLS
- **Hosting target**: Vercel (free Hobby tier — note: Hobby plan restricts
  commercial use; upgrade to Pro for production)

## Middleware / Routing Setup
- **`src/proxy.ts`** — all routing and auth-guard logic lives here; exports
  `proxy` (the middleware function) and `config`
- **`src/middleware.ts`** — Next.js 16 requires the entry point to be named
  `middleware.ts`; this file is a thin re-export:
  ```ts
  export { proxy as middleware, config } from './proxy'
  ```
  **Do not rename or delete either file.** `proxy.ts` holds the logic;
  `middleware.ts` is the Next.js hook point.

## Current Status — what is actually built
- ✅ Public vitrine fully built and styled (Atlantic brand, grain/soy positioning)
- ✅ Pages: `/` (homepage), `/produits`, `/prix`, `/a-propos`, `/services`, `/contact`
- ✅ Sticky header with French nav, footer with company info
- ✅ Public daily prices visible to all visitors via `current_prices` view
- ✅ Price sidebar on all vitrine pages: desktop collapsible right panel;
     mobile rotating ticker pill FAB + spring-animated bottom sheet
- ✅ Scroll-triggered AnimateIn animations (`src/components/vitrine/animate-in.tsx`)
- ✅ Hero slider (3 slides, 5.5s auto-advance) on homepage
- ✅ Image placeholders throughout (picsum.photos); replace with real images later
- ✅ Admin login at `/login` (Supabase Auth)
- ✅ Admin dashboard at `/admin` — price editor tab + clients tab + segment prices tab
- ✅ Admin can edit client profile (region + client_type) after creation
- ✅ Admin can set segment prices by region or by client type
- ✅ Three-layer security: `src/proxy.ts` redirect + `requireStaff()` / `requireClient()` guards + RLS
- ✅ Audit log via DB triggers on price changes
- ✅ Auth routing: `/auth/redirect` reads role → staff go to `/admin`, clients go to `/portal`
- ✅ Client portal at `/portal` — shows negotiated prices per client with "last updated" column
- ✅ Admin can create client accounts and assign per-product negotiated prices
- ✅ Product catalogue: Maïs, Orge, Soja, Coque de soja (migration 0003),
     Blé dur, Blé tendre, Farine de soja, Son de blé (migration 0004)
- ✅ Client segmentation schema: `region` + `client_type` on profiles,
     `segment_prices` table (migration 0005)
- ⚠️ Contact form UI exists at `/contact` but does NOT send email and has no backend storage
  → `contact_messages` table migration exists (0002) — run it in Supabase if not applied
  → Fix: wire up Resend for email delivery (next session)
- ⚠️ Migrations 0004 and 0005 must be applied in Supabase SQL Editor if not yet done;
     after applying 0005 run `NOTIFY pgrst, 'reload schema';` to refresh PostgREST cache

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
| `(auth)` | `/login`, `/logout`, `/auth/redirect` | Shared auth flows |
| `(client-portal)` | `/portal` | Contracted clients |

### 5. Component organisation
```
src/components/
  vitrine/       ← public site only
  admin/         ← admin dashboard only
  client-portal/ ← client portal only
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

## Actual File Structure
```
src/
├── middleware.ts                          ← Next.js hook (re-exports proxy.ts)
├── proxy.ts                              ← all routing/auth guard logic
├── app/
│   ├── (admin)/admin/page.tsx            ← price editor + clients + segment prices tabs
│   ├── (auth)/
│   │   ├── auth/redirect/route.ts
│   │   ├── login/page.tsx
│   │   └── logout/route.ts
│   ├── (client-portal)/portal/
│   │   ├── layout.tsx
│   │   └── page.tsx                      ← negotiated prices for logged-in client
│   ├── (vitrine)/
│   │   ├── layout.tsx                    ← async; fetches prices; renders PriceSidebar
│   │   ├── page.tsx                      ← homepage with hero slider
│   │   ├── a-propos/page.tsx
│   │   ├── contact/page.tsx
│   │   ├── prix/page.tsx
│   │   ├── produits/page.tsx
│   │   └── services/page.tsx
│   ├── globals.css                       ← Tailwind v4 config lives here
│   ├── layout.tsx
│   └── not-found.tsx
├── components/
│   ├── admin/
│   │   ├── client-price-editor.tsx       ← per-client prices + profile edit
│   │   ├── clients-tab.tsx               ← create client, list clients
│   │   ├── price-editor.tsx              ← daily public price editor
│   │   └── segment-price-editor.tsx      ← prices by region or client_type
│   ├── ui/                               ← shadcn primitives
│   └── vitrine/
│       ├── animate-in.tsx                ← IntersectionObserver scroll animations
│       ├── contact-form.tsx
│       ├── footer.tsx
│       ├── header.tsx
│       ├── hero-slider.tsx               ← 3-slide auto-advance hero
│       ├── price-sidebar.tsx             ← desktop panel + mobile FAB/bottom-sheet
│       └── product-grid.tsx
├── lib/
│   ├── auth/guards.ts                    ← requireStaff(), requireClient()
│   ├── modules/
│   │   ├── client-pricing/
│   │   │   ├── mutations.ts
│   │   │   ├── queries.ts
│   │   │   └── types.ts
│   │   ├── clients/
│   │   │   ├── mutations.ts              ← createClient(), updateClientProfile()
│   │   │   ├── queries.ts
│   │   │   └── types.ts                 ← Client type with region + client_type
│   │   ├── contact/
│   │   │   ├── mutations.ts
│   │   │   ├── schemas.ts
│   │   │   └── types.ts
│   │   ├── prices/
│   │   │   ├── mutations.ts
│   │   │   ├── queries.ts
│   │   │   ├── schemas.ts
│   │   │   ├── segment-mutations.ts      ← upsertSegmentPrice() server action
│   │   │   ├── segment-queries.ts        ← getSegmentPrices(region?, clientType?)
│   │   │   └── types.ts
│   │   └── products/
│   │       ├── queries.ts
│   │       └── types.ts
│   ├── supabase/
│   │   ├── admin.ts
│   │   ├── client.ts
│   │   ├── server.ts
│   │   └── session.ts                   ← used by proxy.ts
│   └── utils.ts
```

## Database Schema
Source of truth: `supabase/migrations/`

| Migration | Purpose |
|---|---|
| `0001_initial_schema.sql` | Core tables: profiles, products, daily_prices, customer_prices, price_audit_log |
| `0002_add_contact_messages.sql` | contact_messages table |
| `0003_reposition_products.sql` | Initial product catalogue (Maïs, Orge, Soja, Coque de soja) |
| `0004_add_more_products.sql` | Blé dur, Blé tendre, Farine de soja, Son de blé |
| `0005_client_segments.sql` | client_type enum; region + client_type columns on profiles; segment_prices table |

| Table | Purpose |
|---|---|
| `profiles` | User metadata + role (`admin` / `employee` / `client`), region, client_type |
| `products` | Product catalogue |
| `daily_prices` | Public daily prices (one per product per day) |
| `customer_prices` | Per-client negotiated prices |
| `segment_prices` | Prices by region OR client_type (partial unique indexes) |
| `price_audit_log` | Automatic audit via DB triggers |
| `contact_messages` | Contact form submissions |

**View**: `current_prices` — latest price per active product; this is what the
public vitrine reads.

**Function**: `is_staff()` — returns true if current user has role `admin` or
`employee`. Used in RLS policies.

All tables have RLS enabled. All code must respect these policies.

### segment_prices uniqueness
`segment_prices` uses two **partial unique indexes** (not a single combined one)
because PostgreSQL UNIQUE constraints treat NULL as distinct and enum-to-text
casts are STABLE not IMMUTABLE (unusable in index expressions):
```sql
CREATE UNIQUE INDEX idx_segment_prices_region
  ON public.segment_prices (product_id, effective_date, region)
  WHERE client_type IS NULL AND region IS NOT NULL;

CREATE UNIQUE INDEX idx_segment_prices_type
  ON public.segment_prices (product_id, effective_date, client_type)
  WHERE region IS NULL AND client_type IS NOT NULL;
```

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
- Next.js requires the middleware entry point to be named `middleware.ts`;
  `proxy.ts` exports the function as `proxy` (not `middleware`), so the thin
  re-export in `middleware.ts` is load-bearing — do not remove it
- **Never** import `src/lib/supabase/server.ts` into a Client Component
- Restart the dev server (`Ctrl+C`, `npm run dev`) when CSS or env changes
  don't appear in the browser
- After applying a Supabase migration that adds columns or types, run
  `NOTIFY pgrst, 'reload schema';` in the SQL Editor to refresh the PostgREST
  schema cache immediately (or wait ~1 minute for auto-refresh)
- PostgreSQL UNIQUE constraints treat NULL as distinct — use partial unique
  indexes scoped with WHERE clauses when nullability is part of the key logic
- Enum-to-text casts are STABLE not IMMUTABLE — cannot use them in index
  expressions; use the enum column directly in the index

## Phase Roadmap
| Phase | Status |
|---|---|
| Phase 1 — Public vitrine + admin price editor | COMPLETE |
| Phase 1.5 — Grain/soy repositioning, image placeholders, animations, sidebar | COMPLETE |
| Phase 2 — Client portal with negotiated prices | COMPLETE (basic) |
| Phase 2.5 — Client segmentation (region + type) + segment prices admin tab | COMPLETE |
| Contact form backend — Resend email + DB storage | PENDING |
| Real product/facility images | PENDING (placeholders in place) |
| Vercel deployment | PENDING (see deployment notes below) |

## Vercel Deployment Checklist
1. Create a GitHub repository and push:
   ```bash
   git remote add origin https://github.com/YOUR_USERNAME/YOUR_REPO.git
   git push -u origin master
   ```
2. Go to vercel.com → New Project → Import from GitHub → select the repo
3. Framework preset will auto-detect as Next.js — leave defaults
4. Add environment variables (from your `.env.local`):
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - `SUPABASE_SERVICE_ROLE_KEY`
5. Deploy — Vercel will build and give you a `*.vercel.app` URL
6. In Supabase dashboard → Authentication → URL Configuration:
   - **Site URL**: set to your Vercel URL (e.g. `https://your-app.vercel.app`)
   - **Redirect URLs**: add `https://your-app.vercel.app/auth/redirect`
7. For a custom domain: add it in Vercel → Domains, then update Supabase URL config

**Note**: Vercel Hobby plan is free but prohibits commercial use. Atlantic is a
business — use the Pro plan ($20/mo) for production to comply with Vercel ToS.
