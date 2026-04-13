// ─────────────────────────────────────────────────────────────────────────────
// store/cartStore.ts
// Zustand cart state — persisted to localStorage so cart survives refresh.
// All cart logic lives here. Components only call these actions.
// ─────────────────────────────────────────────────────────────────────────────

import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { CartItem } from '@/types'

interface CartState {
  items: CartItem[]
  isOpen: boolean   // controls the cart drawer visibility

  // Actions
  addItem:    (item: CartItem) => void
  removeItem: (variantId: string) => void
  updateQty:  (variantId: string, quantity: number) => void
  clearCart:  () => void
  openCart:   () => void
  closeCart:  () => void

  // Computed (derived values — calculated in useCart hook, not stored here)
}

export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      items:  [],
      isOpen: false,

      addItem: (newItem) => {
        const existing = get().items.find(
          (item) => item.variantId === newItem.variantId
        )

        if (existing) {
          // Item already in cart — increment quantity
          set((state) => ({
            items: state.items.map((item) =>
              item.variantId === newItem.variantId
                ? { ...item, quantity: item.quantity + newItem.quantity }
                : item
            ),
          }))
        } else {
          // New item — add to cart
          set((state) => ({ items: [...state.items, newItem] }))
        }

        // Open cart drawer when item is added
        set({ isOpen: true })
      },

      removeItem: (variantId) => {
        set((state) => ({
          items: state.items.filter((item) => item.variantId !== variantId),
        }))
      },

      updateQty: (variantId, quantity) => {
        if (quantity <= 0) {
          // Remove item if quantity reaches 0
          get().removeItem(variantId)
          return
        }

        set((state) => ({
          items: state.items.map((item) =>
            item.variantId === variantId ? { ...item, quantity } : item
          ),
        }))
      },

      clearCart: () => set({ items: [] }),

      openCart:  () => set({ isOpen: true }),
      closeCart: () => set({ isOpen: false }),
    }),

    {
      name: 'lp-cart', // localStorage key
      // Only persist items, not UI state (isOpen)
      partialize: (state) => ({ items: state.items }),
    }
  )
)
