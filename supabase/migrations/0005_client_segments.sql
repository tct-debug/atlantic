-- ============================================================
--  Migration: 0005_client_segments.sql
--  Adds client type + region to profiles.
--  Creates segment_prices table for region/type-based pricing.
-- ============================================================

-- 1. client_type enum
DO $$ BEGIN
  CREATE TYPE public.client_type AS ENUM ('gros', 'detail', 'supergros');
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

-- 2. Add region + client_type to profiles
ALTER TABLE public.profiles
  ADD COLUMN IF NOT EXISTS region      text,
  ADD COLUMN IF NOT EXISTS client_type public.client_type;

-- 3. segment_prices table
CREATE TABLE IF NOT EXISTS public.segment_prices (
  id             uuid         PRIMARY KEY DEFAULT uuid_generate_v4(),
  product_id     uuid         NOT NULL REFERENCES public.products(id) ON DELETE CASCADE,
  region         text,                             -- NULL = applies to all regions
  client_type    public.client_type,               -- NULL = applies to all types
  price          numeric(12,2) NOT NULL CHECK (price >= 0),
  currency       text         NOT NULL DEFAULT 'DZD',
  effective_date date         NOT NULL DEFAULT current_date,
  created_at     timestamptz  NOT NULL DEFAULT now(),
  updated_at     timestamptz  NOT NULL DEFAULT now()
);

-- Two partial unique indexes (enum::text cast is not IMMUTABLE, so COALESCE trick fails)
CREATE UNIQUE INDEX IF NOT EXISTS idx_segment_prices_region
  ON public.segment_prices (product_id, effective_date, region)
  WHERE client_type IS NULL AND region IS NOT NULL;

CREATE UNIQUE INDEX IF NOT EXISTS idx_segment_prices_type
  ON public.segment_prices (product_id, effective_date, client_type)
  WHERE region IS NULL AND client_type IS NOT NULL;

-- 4. RLS
ALTER TABLE public.segment_prices ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "staff_manage_segment_prices" ON public.segment_prices;
CREATE POLICY "staff_manage_segment_prices"
  ON public.segment_prices FOR ALL TO authenticated
  USING (public.is_staff())
  WITH CHECK (public.is_staff());

DROP POLICY IF EXISTS "clients_read_segment_prices" ON public.segment_prices;
CREATE POLICY "clients_read_segment_prices"
  ON public.segment_prices FOR SELECT TO authenticated
  USING (true);
