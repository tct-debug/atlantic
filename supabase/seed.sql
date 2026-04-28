-- ============================================================
--  Seed data for development & demo
-- ============================================================

-- Products
insert into public.products (slug, name, category, unit, display_order) values
  ('soy-meal-48',     'Tourteau de Soja 48%',    'feed',         'ton', 1),
  ('wheat-bran',      'Son de Blé',              'feed',         'ton', 2),
  ('corn-yellow',     'Maïs Jaune',              'cereal',       'ton', 3),
  ('barley',          'Orge',                    'cereal',       'ton', 4),
  ('sunflower-meal',  'Tourteau de Tournesol',   'raw_material', 'ton', 5)
on conflict (slug) do nothing;

-- Today's prices
insert into public.daily_prices (product_id, price, currency, effective_date)
select id,
       case slug
         when 'soy-meal-48'    then 78500
         when 'wheat-bran'     then 32000
         when 'corn-yellow'    then 45000
         when 'barley'         then 38000
         when 'sunflower-meal' then 52000
       end,
       'DZD',
       current_date
from public.products
on conflict (product_id, effective_date) do nothing;