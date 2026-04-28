-- ============================================================
--  Contact messages from the public vitrine contact form
--  Migration: 0002_add_contact_messages.sql
-- ============================================================

create table public.contact_messages (
  id          uuid primary key default uuid_generate_v4(),
  name        text not null,
  email       text not null,
  phone       text,
  company     text,
  message     text not null,
  is_read     boolean not null default false,
  created_at  timestamptz not null default now()
);

create index idx_contact_messages_created_at on public.contact_messages(created_at desc);
create index idx_contact_messages_is_read    on public.contact_messages(is_read);

alter table public.contact_messages enable row level security;

-- Anyone (unauthenticated visitors) can submit a message
create policy "Anyone can submit a contact message"
  on public.contact_messages for insert
  with check (true);

-- Staff can read and mark messages as read
create policy "Staff can view contact messages"
  on public.contact_messages for select
  using (public.is_staff());

create policy "Staff can mark messages as read"
  on public.contact_messages for update
  using (public.is_staff())
  with check (public.is_staff());
