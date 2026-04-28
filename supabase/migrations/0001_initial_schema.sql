-- ============================================================
--  Initial schema for Soy & Feed Platform
--  Migration: 0001_initial_schema.sql
-- ============================================================

-- ---------- EXTENSIONS ----------
create extension if not exists "uuid-ossp";
create extension if not exists "pgcrypto";


-- ============================================================
--  1. ROLES & PROFILES
-- ============================================================
create type public.user_role as enum ('admin', 'employee', 'client');

create table public.profiles (
  id           uuid primary key references auth.users(id) on delete cascade,
  email        text not null,
  full_name    text,
  role         public.user_role not null default 'client',
  company_name text,
  is_active    boolean not null default true,
  created_at   timestamptz not null default now(),
  updated_at   timestamptz not null default now()
);

create index idx_profiles_role on public.profiles(role);

create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.profiles (id, email, role)
  values (new.id, new.email, 'client');
  return new;
end;
$$;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();


-- ============================================================
--  2. PRODUCTS
-- ============================================================
create table public.products (
  id           uuid primary key default uuid_generate_v4(),
  slug         text unique not null,
  name         text not null,
  category     text not null,
  description  text,
  unit         text not null default 'ton',
  image_url    text,
  is_active    boolean not null default true,
  display_order int not null default 0,
  created_at   timestamptz not null default now(),
  updated_at   timestamptz not null default now()
);

create index idx_products_category on public.products(category) where is_active = true;
create index idx_products_active   on public.products(is_active);


-- ============================================================
--  3. DAILY PRICES
-- ============================================================
create table public.daily_prices (
  id             uuid primary key default uuid_generate_v4(),
  product_id     uuid not null references public.products(id) on delete cascade,
  price          numeric(12,2) not null check (price >= 0),
  currency       text not null default 'DZD',
  effective_date date not null default current_date,
  notes          text,
  created_by     uuid references public.profiles(id) on delete set null,
  created_at     timestamptz not null default now(),
  updated_at     timestamptz not null default now(),

  unique (product_id, effective_date)
);

create index idx_daily_prices_date    on public.daily_prices(effective_date desc);
create index idx_daily_prices_product on public.daily_prices(product_id, effective_date desc);

create or replace view public.current_prices as
select distinct on (dp.product_id)
  dp.product_id,
  p.slug,
  p.name,
  p.category,
  p.unit,
  dp.price,
  dp.currency,
  dp.effective_date,
  dp.updated_at
from public.daily_prices dp
join public.products p on p.id = dp.product_id
where p.is_active = true
order by dp.product_id, dp.effective_date desc;


-- ============================================================
--  4. CUSTOMER PRICES (future client portal)
-- ============================================================
create table public.customer_prices (
  id           uuid primary key default uuid_generate_v4(),
  customer_id  uuid not null references public.profiles(id) on delete cascade,
  product_id   uuid not null references public.products(id) on delete cascade,
  price        numeric(12,2) not null check (price >= 0),
  currency     text not null default 'DZD',
  valid_from   date not null default current_date,
  valid_until  date,
  notes        text,
  created_by   uuid references public.profiles(id) on delete set null,
  created_at   timestamptz not null default now(),
  updated_at   timestamptz not null default now(),

  check (valid_until is null or valid_until >= valid_from)
);

create index idx_customer_prices_lookup
  on public.customer_prices(customer_id, product_id, valid_from desc);


-- ============================================================
--  5. AUDIT LOG
-- ============================================================
create table public.price_audit_log (
  id          uuid primary key default uuid_generate_v4(),
  table_name  text not null,
  record_id   uuid not null,
  action      text not null,
  old_data    jsonb,
  new_data    jsonb,
  changed_by  uuid references public.profiles(id),
  changed_at  timestamptz not null default now()
);

create index idx_audit_table_record on public.price_audit_log(table_name, record_id);
create index idx_audit_changed_at   on public.price_audit_log(changed_at desc);


-- ============================================================
--  6. UPDATED_AT TRIGGER
-- ============================================================
create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create trigger trg_profiles_updated_at         before update on public.profiles
  for each row execute function public.set_updated_at();
create trigger trg_products_updated_at         before update on public.products
  for each row execute function public.set_updated_at();
create trigger trg_daily_prices_updated_at     before update on public.daily_prices
  for each row execute function public.set_updated_at();
create trigger trg_customer_prices_updated_at  before update on public.customer_prices
  for each row execute function public.set_updated_at();


-- ============================================================
--  7. ROW LEVEL SECURITY
-- ============================================================
alter table public.profiles         enable row level security;
alter table public.products         enable row level security;
alter table public.daily_prices     enable row level security;
alter table public.customer_prices  enable row level security;
alter table public.price_audit_log  enable row level security;

create or replace function public.is_staff()
returns boolean
language sql
security definer
stable
set search_path = public
as $$
  select exists (
    select 1 from public.profiles
    where id = auth.uid()
      and role in ('admin', 'employee')
      and is_active = true
  );
$$;

-- PROFILES POLICIES
create policy "Users can view their own profile"
  on public.profiles for select
  using (auth.uid() = id);

create policy "Staff can view all profiles"
  on public.profiles for select
  using (public.is_staff());

create policy "Users can update their own profile (limited)"
  on public.profiles for update
  using (auth.uid() = id)
  with check (auth.uid() = id);

-- PRODUCTS POLICIES
create policy "Anyone can view active products"
  on public.products for select
  using (is_active = true);

create policy "Staff can manage products"
  on public.products for all
  using (public.is_staff())
  with check (public.is_staff());

-- DAILY PRICES POLICIES
create policy "Anyone can view daily prices"
  on public.daily_prices for select
  using (true);

create policy "Staff can insert daily prices"
  on public.daily_prices for insert
  with check (public.is_staff());

create policy "Staff can update daily prices"
  on public.daily_prices for update
  using (public.is_staff())
  with check (public.is_staff());

create policy "Staff can delete daily prices"
  on public.daily_prices for delete
  using (public.is_staff());

-- CUSTOMER PRICES POLICIES
create policy "Clients see only their own custom prices"
  on public.customer_prices for select
  using (
    customer_id = auth.uid()
    and (valid_until is null or valid_until >= current_date)
  );

create policy "Staff can view all customer prices"
  on public.customer_prices for select
  using (public.is_staff());

create policy "Staff can manage customer prices"
  on public.customer_prices for all
  using (public.is_staff())
  with check (public.is_staff());

-- AUDIT LOG POLICIES
create policy "Staff can view audit log"
  on public.price_audit_log for select
  using (public.is_staff());


-- ============================================================
--  8. AUDIT TRIGGERS
-- ============================================================
create or replace function public.log_price_change()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.price_audit_log (table_name, record_id, action, old_data, new_data, changed_by)
  values (
    tg_table_name,
    coalesce(new.id, old.id),
    tg_op,
    case when tg_op in ('UPDATE','DELETE') then to_jsonb(old) end,
    case when tg_op in ('INSERT','UPDATE') then to_jsonb(new) end,
    auth.uid()
  );
  return coalesce(new, old);
end;
$$;

create trigger trg_audit_daily_prices
  after insert or update or delete on public.daily_prices
  for each row execute function public.log_price_change();

create trigger trg_audit_customer_prices
  after insert or update or delete on public.customer_prices
  for each row execute function public.log_price_change();