-- ============================================================
--  Migration: 0004_add_more_products.sql
--  Adds 4 new cereal and soy products to the catalogue.
-- ============================================================

-- Blé dur (hard wheat — staple for pasta and semolina, widely traded in Algeria)
INSERT INTO public.products (slug, name, category, description, unit, display_order)
VALUES (
  'ble-dur',
  'Blé dur',
  'cereal',
  'Blé dur sélectionné pour sa haute teneur en protéines et en gluten fort. Idéal pour la semoule et la fabrication de pâtes alimentaires.',
  'ton',
  5
)
ON CONFLICT (slug) DO NOTHING;

-- Blé tendre (soft wheat — used for flour and pastry)
INSERT INTO public.products (slug, name, category, description, unit, display_order)
VALUES (
  'ble-tendre',
  'Blé tendre',
  'cereal',
  'Blé tendre de qualité meunière, à faible teneur en gluten. Destiné à la farine de boulangerie et à la pâtisserie industrielle.',
  'ton',
  6
)
ON CONFLICT (slug) DO NOTHING;

-- Farine de soja (soy flour — processed soy product, high protein)
INSERT INTO public.products (slug, name, category, description, unit, display_order)
VALUES (
  'farine-soja',
  'Farine de soja',
  'soy',
  'Farine de soja à haute valeur protéique (45–50 %), issue de graines triées et déshuilées. Utilisée en alimentation animale et en industrie agroalimentaire.',
  'ton',
  7
)
ON CONFLICT (slug) DO NOTHING;

-- Son de blé (wheat bran — cereal byproduct, used for feed)
INSERT INTO public.products (slug, name, category, description, unit, display_order)
VALUES (
  'son-ble',
  'Son de blé',
  'cereal',
  'Sous-produit de la mouture du blé, riche en fibres et en minéraux. Très utilisé dans la ration des bovins, ovins et volailles.',
  'ton',
  8
)
ON CONFLICT (slug) DO NOTHING;
