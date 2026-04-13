-- =============================================================================
-- Louis Polo — Supabase Database Schema
-- Run this entire file in Supabase SQL Editor to set up the database.
-- Order matters — referenced tables must exist before foreign keys.
-- =============================================================================


-- =============================================================================
-- EXTENSIONS
-- =============================================================================

-- Enable UUID generation
CREATE EXTENSION IF NOT EXISTS "pgcrypto";


-- =============================================================================
-- CLEANUP (safe to re-run — drops existing tables in correct order)
-- =============================================================================

DROP TABLE IF EXISTS order_items    CASCADE;
DROP TABLE IF EXISTS orders         CASCADE;
DROP TABLE IF EXISTS addresses      CASCADE;
DROP TABLE IF EXISTS users          CASCADE;
DROP TABLE IF EXISTS variants       CASCADE;
DROP TABLE IF EXISTS products       CASCADE;


-- =============================================================================
-- PRODUCTS
-- Core product table — one row per product line (e.g. "SkyTrail")
-- Individual size/color combinations live in variants table
-- =============================================================================

CREATE TABLE products (
  id          UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
  name        TEXT        NOT NULL,
  slug        TEXT        UNIQUE NOT NULL,
  description TEXT        NOT NULL DEFAULT '',
  category    TEXT        NOT NULL CHECK (category IN (
                            'trolley', 'set', 'backpack',
                            'office-bag', 'kids', 'vanity', 'duffle'
                          )),
  -- Cloudinary public_ids array — transform via URL at render time
  -- Example: ["louispolo/products/skytrail/skytrail-blue-1"]
  images      TEXT[]      NOT NULL DEFAULT '{}',
  -- Product features as JSON array
  -- Example: [{"icon": "RotateCw", "label": "360° Spinner Wheels"}]
  features    JSONB       NOT NULL DEFAULT '[]',
  -- Controls visibility — flip to false to hide without deleting
  is_active   BOOLEAN     NOT NULL DEFAULT true,
  -- Shows in Best Sellers carousel on homepage
  is_featured BOOLEAN     NOT NULL DEFAULT false,
  -- Promotional tag displayed on product card
  tag         TEXT        CHECK (tag IN (
                            'Best Seller', 'New Arrival', 'Exclusive',
                            'Limited Edition', 'Bestseller', NULL
                          )),
  created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Auto-update updated_at on any change
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER products_updated_at
  BEFORE UPDATE ON products
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

-- Index for fast slug lookups (product detail page)
CREATE INDEX idx_products_slug     ON products(slug);
CREATE INDEX idx_products_category ON products(category);
CREATE INDEX idx_products_active   ON products(is_active);
CREATE INDEX idx_products_featured ON products(is_featured);


-- =============================================================================
-- VARIANTS
-- Each row is a specific color + size combination of a product.
-- Prices can differ per variant (e.g. 20" is cheaper than 28").
-- =============================================================================

CREATE TABLE variants (
  id          UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
  product_id  UUID        NOT NULL REFERENCES products(id) ON DELETE CASCADE,
  color       TEXT        NOT NULL,
  -- Hex color code for the swatch UI — e.g. '#1E88E5'
  color_hex   TEXT        NOT NULL DEFAULT '#9E9E9E',
  -- NULL for bags with no size (office bags, backpacks with one size)
  size        TEXT        CHECK (size IN ('20"', '24"', '28"', 'Set of 3', 'One Size')),
  -- Price in INR (not paise — we convert to paise only when calling Razorpay)
  price       NUMERIC     NOT NULL CHECK (price > 0),
  stock       INTEGER     NOT NULL DEFAULT 0 CHECK (stock >= 0),
  -- GS1 GTIN/EAN barcode — matches the GS1 sheet data
  sku         TEXT        UNIQUE NOT NULL,
  -- Net weight in kg — from GS1 data
  weight_kg   NUMERIC     NOT NULL DEFAULT 0,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_variants_product  ON variants(product_id);
CREATE INDEX idx_variants_sku      ON variants(sku);


-- =============================================================================
-- USERS
-- Phone-based auth — Supabase Auth handles OTP, we store profile here.
-- The id matches the Supabase Auth user UUID.
-- =============================================================================

CREATE TABLE users (
  -- Matches Supabase Auth user ID exactly
  id          UUID        PRIMARY KEY,
  phone       TEXT        UNIQUE NOT NULL,
  name        TEXT,
  -- Optional email for order confirmations
  email       TEXT,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TRIGGER users_updated_at
  BEFORE UPDATE ON users
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();


-- =============================================================================
-- ADDRESSES
-- Users can save multiple addresses. One marked as default.
-- =============================================================================

CREATE TABLE addresses (
  id          UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id     UUID        NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  name        TEXT        NOT NULL,   -- recipient name
  phone       TEXT        NOT NULL,   -- recipient phone
  line1       TEXT        NOT NULL,
  line2       TEXT,
  city        TEXT        NOT NULL,
  state       TEXT        NOT NULL,
  pincode     TEXT        NOT NULL CHECK (pincode ~ '^\d{6}$'),
  is_default  BOOLEAN     NOT NULL DEFAULT false,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_addresses_user ON addresses(user_id);

-- Ensure only one default address per user
CREATE UNIQUE INDEX idx_addresses_one_default
  ON addresses(user_id)
  WHERE is_default = true;


-- =============================================================================
-- ORDERS
-- One row per order. Address is stored as JSONB snapshot —
-- preserves the delivery address even if user edits their address later.
-- =============================================================================

CREATE TABLE orders (
  id                   UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
  -- Human-readable: LP-2025-00001
  order_number         TEXT        UNIQUE NOT NULL,
  -- NULL for guest orders (phone-only checkout)
  user_id              UUID        REFERENCES users(id) ON DELETE SET NULL,
  -- Always stored — used for guest order tracking
  phone                TEXT        NOT NULL,
  -- Complete address snapshot at time of order
  address              JSONB       NOT NULL,
  status               TEXT        NOT NULL DEFAULT 'pending'
                                   CHECK (status IN (
                                     'pending', 'confirmed', 'shipped',
                                     'delivered', 'cancelled'
                                   )),
  payment_status       TEXT        NOT NULL DEFAULT 'pending'
                                   CHECK (payment_status IN (
                                     'pending', 'paid', 'failed', 'refunded'
                                   )),
  -- Total in INR
  total                NUMERIC     NOT NULL CHECK (total > 0),
  -- Razorpay references — populated after payment
  razorpay_order_id    TEXT,
  razorpay_payment_id  TEXT,
  created_at           TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at           TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TRIGGER orders_updated_at
  BEFORE UPDATE ON orders
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE INDEX idx_orders_user         ON orders(user_id);
CREATE INDEX idx_orders_phone        ON orders(phone);
CREATE INDEX idx_orders_status       ON orders(status);
CREATE INDEX idx_orders_order_number ON orders(order_number);


-- =============================================================================
-- ORDER ITEMS
-- Line items within an order. All product details are snapshotted —
-- so order history is preserved even if product is deleted or price changes.
-- =============================================================================

CREATE TABLE order_items (
  id            UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id      UUID        NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
  variant_id    UUID        REFERENCES variants(id) ON DELETE SET NULL,
  -- Snapshot fields — preserved forever
  product_name  TEXT        NOT NULL,
  color         TEXT        NOT NULL,
  size          TEXT,
  price         NUMERIC     NOT NULL CHECK (price > 0),
  quantity      INTEGER     NOT NULL CHECK (quantity > 0),
  -- First product image at time of order
  image         TEXT        NOT NULL DEFAULT ''
);

CREATE INDEX idx_order_items_order ON order_items(order_id);


-- =============================================================================
-- ROW LEVEL SECURITY (RLS)
-- Controls what each user can read/write.
-- Service role key bypasses RLS — used only in API routes.
-- =============================================================================

ALTER TABLE products    ENABLE ROW LEVEL SECURITY;
ALTER TABLE variants    ENABLE ROW LEVEL SECURITY;
ALTER TABLE users       ENABLE ROW LEVEL SECURITY;
ALTER TABLE addresses   ENABLE ROW LEVEL SECURITY;
ALTER TABLE orders      ENABLE ROW LEVEL SECURITY;
ALTER TABLE order_items ENABLE ROW LEVEL SECURITY;

-- Products & variants — public read, no public write
CREATE POLICY "products_public_read"
  ON products FOR SELECT USING (is_active = true);

CREATE POLICY "variants_public_read"
  ON variants FOR SELECT USING (true);

-- Users — can only read/write their own profile
CREATE POLICY "users_own_profile"
  ON users FOR ALL
  USING (auth.uid() = id);

-- Addresses — users can only see their own
CREATE POLICY "addresses_own"
  ON addresses FOR ALL
  USING (auth.uid() = user_id);

-- Orders — users can see their own orders, guests can see by phone
CREATE POLICY "orders_own"
  ON orders FOR SELECT
  USING (
    auth.uid() = user_id
    OR phone = (
      SELECT phone FROM users WHERE id = auth.uid()
    )
  );

-- Order items — accessible if parent order is accessible
CREATE POLICY "order_items_via_order"
  ON order_items FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM orders
      WHERE orders.id = order_items.order_id
        AND (
          orders.user_id = auth.uid()
          OR orders.phone = (
            SELECT phone FROM users WHERE id = auth.uid()
          )
        )
    )
  );
