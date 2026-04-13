-- =============================================================================
-- Louis Polo — Seed Data
-- Run AFTER schema.sql.
-- Contains all products and variants extracted from the GS1 sheet.
-- Images are placeholders — replace with real Cloudinary public_ids after upload.
-- =============================================================================


-- =============================================================================
-- PRODUCTS
-- =============================================================================

INSERT INTO products (id, name, slug, description, category, features, is_active, is_featured, tag) VALUES

-- ─── SkyTrail ──────────────────────────────────────────────────────────────
(
  'a1000000-0000-0000-0000-000000000001',
  'SkyTrail',
  'skytrail',
  'SkyTrail is a hard shell ABS trolley suitcase designed for every journey. Equipped with 360° spinner wheels, telescopic handle and combination lock — built to keep up with wherever you go.',
  'trolley',
  '[
    {"icon": "RotateCw",   "label": "360° Spinner Wheels"},
    {"icon": "Lock",       "label": "Combination Lock"},
    {"icon": "ArrowUp",    "label": "Telescopic Handle"},
    {"icon": "Shield",     "label": "Hard Shell ABS"}
  ]'::jsonb,
  true, true, 'New Arrival'
),

-- ─── VeeZoom ───────────────────────────────────────────────────────────────
(
  'a1000000-0000-0000-0000-000000000002',
  'VeeZoom',
  'veezoom',
  'VeeZoom is a hard shell ABS trolley suitcase with bold V-pattern design. Equipped with 360° spinner wheels and telescopic handle — makes a statement on every conveyor belt.',
  'trolley',
  '[
    {"icon": "RotateCw",   "label": "360° Spinner Wheels"},
    {"icon": "ArrowUp",    "label": "Telescopic Handle"},
    {"icon": "Shield",     "label": "Hard Shell ABS"},
    {"icon": "Zap",        "label": "Lightweight Build"}
  ]'::jsonb,
  true, true, 'New Arrival'
),

-- ─── SoftSquare ────────────────────────────────────────────────────────────
(
  'a1000000-0000-0000-0000-000000000003',
  'SoftSquare',
  'softsquare',
  'SoftSquare blends a clean geometric design with premium ABS hard shell protection. Features 360° spinner wheels and a telescopic handle — your reliable travel companion.',
  'trolley',
  '[
    {"icon": "RotateCw",   "label": "360° Spinner Wheels"},
    {"icon": "Lock",       "label": "Combination Lock"},
    {"icon": "ArrowUp",    "label": "Telescopic Handle"},
    {"icon": "Shield",     "label": "Hard Shell ABS"}
  ]'::jsonb,
  true, true, 'Best Seller'
),

-- ─── ProStripe ─────────────────────────────────────────────────────────────
(
  'a1000000-0000-0000-0000-000000000004',
  'ProStripe',
  'prostripe',
  'ProStripe is a bold front-open hard shell trolley suitcase — perfect for travellers who want instant access to their essentials. 360° spinner wheels and combination lock included.',
  'trolley',
  '[
    {"icon": "RotateCw",   "label": "360° Spinner Wheels"},
    {"icon": "Lock",       "label": "Combination Lock"},
    {"icon": "ArrowUp",    "label": "Telescopic Handle"},
    {"icon": "DoorOpen",   "label": "Front Open Design"}
  ]'::jsonb,
  true, true, 'Exclusive'
),

-- ─── MotoStripe ────────────────────────────────────────────────────────────
(
  'a1000000-0000-0000-0000-000000000005',
  'MotoStripe',
  'motostripe',
  'MotoStripe is a hard shell polycarbonate trolley suitcase with racing-inspired stripe design. Lightweight, durable, and built for the frequent flyer.',
  'trolley',
  '[
    {"icon": "RotateCw",   "label": "360° Spinner Wheels"},
    {"icon": "Shield",     "label": "Polycarbonate Shell"},
    {"icon": "ArrowUp",    "label": "Telescopic Handle"},
    {"icon": "Feather",    "label": "Ultra Lightweight"}
  ]'::jsonb,
  true, false, 'New Arrival'
),

-- ─── AeroSmart 3in1 ────────────────────────────────────────────────────────
(
  'a1000000-0000-0000-0000-000000000006',
  'AeroSmart 3-in-1',
  'aerosmart-3in1',
  'Travel in style with the AeroSmart 3-in-1 — our most innovative suitcase. Features a unique integrated side compartment and front pocket for effortless access to your travel essentials. Premium metallic finish with ultra-smooth rolling wheels.',
  'trolley',
  '[
    {"icon": "RotateCw",   "label": "360° Spinner Wheels"},
    {"icon": "Layers",     "label": "3-in-1 Compartments"},
    {"icon": "ArrowUp",    "label": "Telescopic Handle"},
    {"icon": "Shield",     "label": "Hard Shell ABS"}
  ]'::jsonb,
  true, true, 'Best Seller'
),

-- ─── Phantom Pro ───────────────────────────────────────────────────────────
(
  'a1000000-0000-0000-0000-000000000007',
  'Phantom Pro',
  'phantom-pro',
  'The Phantom Pro is our premium polycarbonate trolley — 8 smooth spinner wheels, gun metal finish, and military-grade shell protection. For the traveller who refuses to compromise.',
  'trolley',
  '[
    {"icon": "RotateCw",   "label": "8 Spinner Wheels"},
    {"icon": "Shield",     "label": "100% Polycarbonate"},
    {"icon": "ArrowUp",    "label": "Telescopic Handle"},
    {"icon": "Star",       "label": "Premium Finish"}
  ]'::jsonb,
  true, false, 'Exclusive'
),

-- ─── Magnus ────────────────────────────────────────────────────────────────
(
  'a1000000-0000-0000-0000-000000000008',
  'Magnus',
  'magnus',
  'Magnus is a 100% polypropylene trolley with 8 smooth spinner wheels and a sleek gun metal finish. Lightweight, structured, and built to last.',
  'trolley',
  '[
    {"icon": "RotateCw",   "label": "8 Spinner Wheels"},
    {"icon": "Shield",     "label": "100% Polypropylene"},
    {"icon": "ArrowUp",    "label": "Telescopic Handle"},
    {"icon": "Feather",    "label": "Lightweight Build"}
  ]'::jsonb,
  true, false, NULL
),

-- ─── ArmorPack (Backpack) ──────────────────────────────────────────────────
(
  'a1000000-0000-0000-0000-000000000009',
  'ArmorPack',
  'armorpack',
  'ArmorPack is a hard shell backpack designed for daily use and travel. Features a rigid protective outer shell with secure zip closure and adjustable shoulder straps.',
  'backpack',
  '[
    {"icon": "Shield",     "label": "Hard Shell Protection"},
    {"icon": "Shirt",      "label": "Adjustable Shoulder Straps"},
    {"icon": "Lock",       "label": "Secure Zip Closure"},
    {"icon": "Laptop",     "label": "Laptop Compartment"}
  ]'::jsonb,
  true, true, 'New Arrival'
),

-- ─── HexCore (Office Bag) ──────────────────────────────────────────────────
(
  'a1000000-0000-0000-0000-000000000010',
  'HexCore',
  'hexcore',
  'HexCore is a hard shell office bag designed for daily professional use. Features a rigid protective outer shell with secure zip closure and carry handle — perfect for documents and office essentials.',
  'office-bag',
  '[
    {"icon": "Shield",     "label": "Hard Shell Protection"},
    {"icon": "Briefcase",  "label": "Professional Design"},
    {"icon": "Lock",       "label": "Secure Zip Closure"},
    {"icon": "FileText",   "label": "Document Friendly"}
  ]'::jsonb,
  true, false, NULL
),

-- ─── SkyTrail Set of 3 ─────────────────────────────────────────────────────
(
  'a1000000-0000-0000-0000-000000000011',
  'SkyTrail — Set of 3',
  'skytrail-set',
  'The SkyTrail 3-piece luggage set includes 20", 24", and 28" hard shell ABS trolley bags — designed in a nesting format where one fits inside another for compact storage. A complete travel set for every trip.',
  'set',
  '[
    {"icon": "Package",    "label": "20\", 24\" & 28\" Included"},
    {"icon": "RotateCw",   "label": "360° Spinner Wheels"},
    {"icon": "Lock",       "label": "Combination Lock"},
    {"icon": "Archive",    "label": "Nesting Storage Design"}
  ]'::jsonb,
  true, false, NULL
),

-- ─── VeeZoom Set of 3 ──────────────────────────────────────────────────────
(
  'a1000000-0000-0000-0000-000000000012',
  'VeeZoom — Set of 3',
  'veezoom-set',
  'The VeeZoom 3-piece set includes 20", 24", and 28" hard shell ABS trolley bags in matching design. Nesting format for compact storage — the complete set for the frequent traveller.',
  'set',
  '[
    {"icon": "Package",    "label": "20\", 24\" & 28\" Included"},
    {"icon": "RotateCw",   "label": "360° Spinner Wheels"},
    {"icon": "Shield",     "label": "Hard Shell ABS"},
    {"icon": "Archive",    "label": "Nesting Storage Design"}
  ]'::jsonb,
  true, false, NULL
),

-- ─── SoftSquare Set of 3 ───────────────────────────────────────────────────
(
  'a1000000-0000-0000-0000-000000000013',
  'SoftSquare — Set of 3',
  'softsquare-set',
  'The SoftSquare 3-piece luggage set includes 20", 24", and 28" ABS trolley bags. Clean geometric design in matching colors — the smart choice for families and frequent travellers.',
  'set',
  '[
    {"icon": "Package",    "label": "20\", 24\" & 28\" Included"},
    {"icon": "RotateCw",   "label": "360° Spinner Wheels"},
    {"icon": "Lock",       "label": "Combination Lock"},
    {"icon": "Archive",    "label": "Nesting Storage Design"}
  ]'::jsonb,
  true, false, NULL
);


-- =============================================================================
-- VARIANTS
-- All 45 SKUs from the GS1 sheet.
-- Prices and GTINs are from the official GS1 data.
-- =============================================================================

INSERT INTO variants (product_id, color, color_hex, size, price, stock, sku, weight_kg) VALUES

-- ─── SkyTrail Variants ─────────────────────────────────────────────────────
('a1000000-0000-0000-0000-000000000001', 'Blue', '#1E88E5', '20"',  9099,  50, '8906206840292', 2.54),
('a1000000-0000-0000-0000-000000000001', 'Blue', '#1E88E5', '24"',  10649, 40, '8906206840308', 3.06),
('a1000000-0000-0000-0000-000000000001', 'Blue', '#1E88E5', '28"',  12550, 30, '8906206840315', 3.64),
('a1000000-0000-0000-0000-000000000001', 'Grey', '#9E9E9E', '20"',  9099,  50, '8906206840346', 2.54),
('a1000000-0000-0000-0000-000000000001', 'Grey', '#9E9E9E', '24"',  10649, 40, '8906206840339', 3.06),
('a1000000-0000-0000-0000-000000000001', 'Grey', '#9E9E9E', '28"',  12550, 30, '8906206840322', 3.46),

-- ─── VeeZoom Variants ──────────────────────────────────────────────────────
('a1000000-0000-0000-0000-000000000002', 'Yellow', '#FDD835', '20"', 9099,  50, '8906206840230', 3.68),
('a1000000-0000-0000-0000-000000000002', 'Yellow', '#FDD835', '24"', 10649, 40, '8906206840247', 3.68),
('a1000000-0000-0000-0000-000000000002', 'Yellow', '#FDD835', '28"', 12550, 30, '8906206840254', 4.20),
('a1000000-0000-0000-0000-000000000002', 'Black',  '#212121', '20"', 9099,  50, '8906206840285', 3.68),
('a1000000-0000-0000-0000-000000000002', 'Black',  '#212121', '24"', 10649, 40, '8906206840278', 3.68),
('a1000000-0000-0000-0000-000000000002', 'Black',  '#212121', '28"', 12550, 30, '8906206840261', 4.20),

-- ─── SoftSquare Variants ───────────────────────────────────────────────────
('a1000000-0000-0000-0000-000000000003', 'Rosegold', '#B76E79', '20"', 9490,  40, '8906206840353', 2.72),
('a1000000-0000-0000-0000-000000000003', 'Rosegold', '#B76E79', '24"', 10990, 30, '8906206840360', 3.32),
('a1000000-0000-0000-0000-000000000003', 'Rosegold', '#B76E79', '28"', 12490, 25, '8906206840377', 4.00),
('a1000000-0000-0000-0000-000000000003', 'Blue',     '#1E88E5', '20"', 9490,  40, '8906206840407', 2.72),
('a1000000-0000-0000-0000-000000000003', 'Blue',     '#1E88E5', '24"', 10990, 30, '8906206840384', 3.32),
('a1000000-0000-0000-0000-000000000003', 'Blue',     '#1E88E5', '28"', 12490, 25, '8906206840391', 4.00),
('a1000000-0000-0000-0000-000000000003', 'Black',    '#212121', '20"', 9490,  40, '8906206840414', 2.72),
('a1000000-0000-0000-0000-000000000003', 'Black',    '#212121', '24"', 10990, 30, '8906206840438', 3.32),
('a1000000-0000-0000-0000-000000000003', 'Black',    '#212121', '28"', 12490, 25, '8906206840421', 4.00),

-- ─── ProStripe Variants ────────────────────────────────────────────────────
('a1000000-0000-0000-0000-000000000004', 'Grey',  '#9E9E9E', '20"', 13259, 20, '8906206840056', 3.10),
('a1000000-0000-0000-0000-000000000004', 'Black', '#212121', '20"', 13259, 20, '8906206840117', 3.10),

-- ─── MotoStripe Variants ───────────────────────────────────────────────────
('a1000000-0000-0000-0000-000000000005', 'Grey',  '#9E9E9E', '20"', 8899, 30, '8906206840186', 2.70),
('a1000000-0000-0000-0000-000000000005', 'Green', '#43A047', '20"', 8899, 30, '8906206840162', 2.70),
('a1000000-0000-0000-0000-000000000005', 'Blue',  '#1E88E5', '20"', 8899, 30, '8906206840179', 2.70),

-- ─── AeroSmart 3in1 Variants ───────────────────────────────────────────────
('a1000000-0000-0000-0000-000000000006', 'Red',   '#C0392B', NULL, 8500, 40, '8906206840001-R', 0),
('a1000000-0000-0000-0000-000000000006', 'Teal',  '#2C9E8F', NULL, 8500, 40, '8906206840001-T', 0),
('a1000000-0000-0000-0000-000000000006', 'Brown', '#7D5A3C', NULL, 8500, 40, '8906206840001-B', 0),
('a1000000-0000-0000-0000-000000000006', 'Yellow','#FDD835', NULL, 8500, 40, '8906206840001-Y', 0),
('a1000000-0000-0000-0000-000000000006', 'White', '#F5F2EC', NULL, 8500, 40, '8906206840001-W', 0),

-- ─── Phantom Pro Variant ───────────────────────────────────────────────────
('a1000000-0000-0000-0000-000000000007', 'Gun Metal', '#4A4A4A', 'One Size', 12490, 20, '8906206840025', 2.60),

-- ─── Magnus Variant ────────────────────────────────────────────────────────
('a1000000-0000-0000-0000-000000000008', 'Gun Metal', '#4A4A4A', 'One Size', 8990, 20, '8906206840018', 2.60),

-- ─── ArmorPack Variants ────────────────────────────────────────────────────
('a1000000-0000-0000-0000-000000000009', 'Carbon Fiber',  '#2C2C2C', 'One Size', 8499, 30, '8906206840209', 1.46),
('a1000000-0000-0000-0000-000000000009', 'Silver Brush',  '#C0C0C0', 'One Size', 8499, 30, '8906206840193', 1.46),

-- ─── HexCore Variants ──────────────────────────────────────────────────────
('a1000000-0000-0000-0000-000000000010', 'Carbon Fiber',  '#2C2C2C', 'One Size', 6099, 30, '8906206840216', 0.88),
('a1000000-0000-0000-0000-000000000010', 'Silver Brush',  '#C0C0C0', 'One Size', 6099, 30, '8906206840223', 0.88),

-- ─── SkyTrail Set of 3 ─────────────────────────────────────────────────────
('a1000000-0000-0000-0000-000000000011', 'Blue', '#1E88E5', 'Set of 3', 31699, 15, '8906206840087', 9.34),
('a1000000-0000-0000-0000-000000000011', 'Grey', '#9E9E9E', 'Set of 3', 31699, 15, '8906206840100', 9.34),

-- ─── VeeZoom Set of 3 ──────────────────────────────────────────────────────
('a1000000-0000-0000-0000-000000000012', 'Yellow', '#FDD835', 'Set of 3', 31699, 15, '8906206840094', 10.64),
('a1000000-0000-0000-0000-000000000012', 'Black',  '#212121', 'Set of 3', 31699, 15, '8906206840070', 10.64),

-- ─── SoftSquare Set of 3 ───────────────────────────────────────────────────
('a1000000-0000-0000-0000-000000000013', 'Blue',     '#1E88E5', 'Set of 3', 32970, 15, '8906206840148', 10.24),
('a1000000-0000-0000-0000-000000000013', 'Black',    '#212121', 'Set of 3', 32970, 15, '8906206840155', 10.24),
('a1000000-0000-0000-0000-000000000013', 'Rosegold', '#B76E79', 'Set of 3', 32970, 15, '8906206840131', 10.24),
('a1000000-0000-0000-0000-000000000013', 'Pink',     '#EC407A', 'Set of 3', 32970, 15, '8906206840124', 10.24);


-- =============================================================================
-- VERIFY SEED
-- Run these after seeding to confirm everything looks correct.
-- =============================================================================

-- Should show 13 products
SELECT COUNT(*) AS total_products FROM products;

-- Should show 45+ variants
SELECT COUNT(*) AS total_variants FROM variants;

-- Show product + variant count per product
SELECT
  p.name,
  p.category,
  p.is_featured,
  p.tag,
  COUNT(v.id)          AS variant_count,
  MIN(v.price)         AS min_price,
  MAX(v.price)         AS max_price
FROM products p
LEFT JOIN variants v ON v.product_id = p.id
GROUP BY p.id, p.name, p.category, p.is_featured, p.tag
ORDER BY p.category, p.name;
