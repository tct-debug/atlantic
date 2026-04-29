-- ============================================================
--  Seed data for development & demo
-- ============================================================

-- Products
insert into public.products (slug, name, category, unit, display_order) values
  ('mais',       'Maïs',          'cereal', 'ton', 1),
  ('orge',       'Orge',          'cereal', 'ton', 2),
  ('soja',       'Soja',          'soy',    'ton', 3),
  ('coque-soja', 'Coque de soja', 'soy',    'ton', 4)
on conflict (slug) do nothing;

-- Today's prices
insert into public.daily_prices (product_id, price, currency, effective_date)
select id,
       case slug
         when 'mais'       then 45000
         when 'orge'       then 38000
         when 'soja'       then 85000
         when 'coque-soja' then 25000
       end,
       'DZD',
       current_date
from public.products
on conflict (product_id, effective_date) do nothing;
