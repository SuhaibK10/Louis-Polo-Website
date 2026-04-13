// ─────────────────────────────────────────────────────────────────────────────
// hooks/useCart.ts
// Computed cart values + clean API for components.
// Components use this hook, not the store directly.
// ─────────────────────────────────────────────────────────────────────────────

import { useCartStore } from '@/store/cartStore'
import { CART } from '@/lib/constants'

export function useCart() {
  const {
    items,
    isOpen,
    addItem,
    removeItem,
    updateQty,
    clearCart,
    openCart,
    closeCart,
  } = useCartStore()

  // Total number of items (respects quantity)
  // e.g. 2 × AeroSmart + 1 × SkyTrail = 3
  const itemCount = items.reduce((sum, item) => sum + item.quantity, 0)

  // Subtotal before shipping
  const subtotal = items.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  )

  // Shipping — free above threshold, otherwise flat rate
  const shipping =
    subtotal >= CART.freeShippingThreshold ? 0 : CART.shippingCost

  // Grand total
  const total = subtotal + shipping

  // Is cart empty?
  const isEmpty = items.length === 0

  // Has free shipping?
  const hasFreeShipping = subtotal >= CART.freeShippingThreshold

  // Amount remaining for free shipping
  const amountForFreeShipping = Math.max(
    0,
    CART.freeShippingThreshold - subtotal
  )

  return {
    // State
    items,
    isOpen,
    isEmpty,

    // Computed values
    itemCount,
    subtotal,
    shipping,
    total,
    hasFreeShipping,
    amountForFreeShipping,

    // Actions
    addItem,
    removeItem,
    updateQty,
    clearCart,
    openCart,
    closeCart,
  }
}
