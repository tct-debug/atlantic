-- ============================================================
--  Migration: 0003_reposition_products.sql
--  Repositions Atlantic's product catalogue from livestock feed
--  to cereals and soy products.
-- ============================================================

-- 1. Remove discontinued products (cascade removes their daily_prices rows)
DELETE FROM public.products WHERE slug IN ('wheat-bran', 'soy-meal-48', 'sunflower-meal');

-- 2. Rename Maïs Jaune → Maïs, fix slug, set display order
UPDATE public.products
SET name = 'Maïs', slug = 'mais', category = 'cereal', display_order = 1
WHERE slug = 'corn-yellow';

-- 3. Fix Orge slug and display order
UPDATE public.products
SET slug = 'orge', category = 'cereal', display_order = 2
WHERE slug = 'barley';

-- 4. Insert Soja if not present
INSERT INTO public.products (slug, name, category, unit, display_order)
VALUES ('soja', 'Soja', 'soy', 'ton', 3)
ON CONFLICT (slug) DO NOTHING;

-- 5. Insert Coque de soja if not present
INSERT INTO public.products (slug, name, category, unit, display_order)
VALUES ('coque-soja', 'Coque de soja', 'soy', 'ton', 4)
ON CONFLICT (slug) DO NOTHING;

-- 6. Seed today's price for Soja
INSERT INTO public.daily_prices (product_id, price, currency, effective_date)
SELECT id, 85000, 'DZD', current_date
FROM public.products
WHERE slug = 'soja'
ON CONFLICT (product_id, effective_date) DO NOTHING;

-- 7. Seed today's price for Coque de soja
INSERT INTO public.daily_prices (product_id, price, currency, effective_date)
SELECT id, 25000, 'DZD', current_date
FROM public.products
WHERE slug = 'coque-soja'
ON CONFLICT (product_id, effective_date) DO NOTHING;
