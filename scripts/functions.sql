-- =============================================================================
-- Louis Polo — Database Functions
-- Run this in Supabase SQL Editor AFTER schema.sql and seed.sql
-- =============================================================================


-- =============================================================================
-- FUNCTION: decrement_stock
-- Called after payment verification to reduce variant stock.
-- Uses atomic update to prevent race conditions.
-- =============================================================================

CREATE OR REPLACE FUNCTION decrement_stock(
  variant_id UUID,
  quantity   INTEGER
)
RETURNS VOID AS $$
BEGIN
  UPDATE variants
  SET stock = GREATEST(0, stock - quantity)
  WHERE id = variant_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
