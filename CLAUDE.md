# Project: Soy & Feed Platform

## Business Context
A vitrine (showcase) website + admin dashboard for a cereal and livestock feed
production company in Algeria. Sells soy, bran, corn, raw materials.

## Current Phase
Phase 1: Public vitrine + admin dashboard for daily price updates.
Phase 2 (future, designed but not built): Client portal with custom negotiated prices.

## Tech Stack (LOCKED — do not change)
- Next.js 16+ with App Router
- TypeScript
- Tailwind CSS v4 (config lives in `src/app/globals.css`, there is no `tailwind.config.ts`)
- shadcn/ui for admin components
- Supabase (cloud) for database + auth
- Hosting target: Vercel

## Architecture Rules (CRITICAL)
1. **Modularity**: Business logic lives in `src/lib/modules/` organized by domain
   (prices, products, client-pricing). Components and pages NEVER write SQL or
   Supabase queries inline — they import from modules.

2. **Route groups for separation**:
   - `(vitrine)` = public showcase site
   - `(admin)` = secure admin dashboard at /admin
   - `(client-portal)` = future client portal at /portal (scaffolded only)
   - `(auth)` = shared login/logout flows

3. **Three-layer security**:
   - Middleware redirects unauthenticated users from /admin
   - Server Component guards verify role before rendering
   - Supabase RLS policies enforce at the database level

4. **Images**: Stored locally in `public/images/`, NOT in Supabase Storage.
   Database stores file paths only.

5. **Components**:
   - `components/vitrine/` = public-only
   - `components/admin/` = admin-only
   - `components/shared/` = used by both
   - `components/ui/` = shadcn primitives

## Database Schema (already deployed to Supabase)
The full schema is in `supabase/migrations/0001_initial_schema.sql` — read this
file as the source of truth for table names, column names, types, RLS policies,
and helper functions.

Seed data for dev is in `supabase/seed.sql`.

Key reference points:
- Tables: profiles, products, daily_prices, customer_prices, price_audit_log
- View: current_prices (latest price per active product, what the public site reads)
- Helper function: is_staff() — returns true if current user has role 'admin' or 'employee'
- Currency default: DZD
- All tables have RLS enabled — code must respect these policies
- Audit log is automatic via triggers on daily_prices and customer_prices

## Folder Structure (target)
src/
├── app/
│   ├── (vitrine)/         # public site
│   ├── (admin)/admin/     # /admin dashboard
│   ├── (client-portal)/   # future, scaffolded
│   ├── (auth)/            # login/logout
│   └── api/               # route handlers
├── components/
│   ├── ui/                # shadcn
│   ├── vitrine/
│   ├── admin/
│   ├── client-portal/
│   └── shared/
├── lib/
│   ├── supabase/          # client.ts, server.ts, middleware.ts, admin.ts
│   ├── auth/              # guards.ts, roles.ts
│   ├── modules/           # business logic (queries, mutations, schemas, types)
│   │   ├── prices/
│   │   ├── products/
│   │   └── client-pricing/  # placeholder for future
│   └── utils/
├── types/
└── middleware.ts

## Current Status (where I am right now)
- ✅ Next.js + TypeScript + Tailwind v4 + App Router configured
- ✅ Supabase client files in place (client, server, middleware, admin)
- ✅ Database schema deployed: profiles, products, daily_prices, customer_prices,
     price_audit_log, contact_messages — all tables, RLS, triggers, audit log
- ✅ Seed data inserted (5 products with prices)
- ✅ Admin user created and promoted to 'admin' role
- ✅ Three-layer security in place (middleware + server guards + RLS)
- ✅ Vitrine fully built: /, /produits, /prix, /a-propos, /services, /contact
- ✅ Admin dashboard with price editor at /admin
- ✅ Contact form backend wired up (writes to contact_messages via module)
- ✅ Brand applied throughout: Atlantic name, colour palette, Playfair/Inter fonts
- ✅ Auth flow: /login, /logout, middleware redirect, requireStaff() guard
- ✅ Client portal scaffolded at /portal (Phase 2 — not yet built)
- ⏳ NEXT: TBD — Phase 1 is feature-complete for demo

## Working Style I Want
1. Build module by module, not all at once
2. Explain decisions briefly before writing code
3. Show me the file structure changes before making them
4. After each module, give me a way to test it
5. Plain language, no unnecessary jargon
6. I'm building this to demo to a client soon — prioritize a working demo over perfection

## Do NOT
- Add features I didn't ask for
- Change the tech stack
- Skip the modular structure to "save time"
- Use Supabase Storage for images (intentional decision)
- Build the client portal yet (only scaffold the routes)