'use client'

// ─────────────────────────────────────────────────────────────────────────────
// components/cart/CartDrawer.tsx
// Slide-in cart panel from the right side.
// Opens when item is added or cart icon is tapped.
// Shows: items, free shipping progress, subtotal, checkout CTA.
// ─────────────────────────────────────────────────────────────────────────────

import Link from 'next/link'
import { motion, AnimatePresence } from 'framer-motion'
import { X, ShoppingBag }          from 'lucide-react'
import { CartItem }    from '@/components/cart/CartItem'
import { Button }      from '@/components/ui/Button'
import { useCart }     from '@/hooks/useCart'
import { formatPrice } from '@/lib/utils'
import { ROUTES, CART } from '@/lib/constants'

export function CartDrawer() {
  const {
    items,
    isOpen,
    isEmpty,
    itemCount,
    subtotal,
    shipping,
    total,
    hasFreeShipping,
    amountForFreeShipping,
    closeCart,
  } = useCart()

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* ── Backdrop ───────────────────────────────────────────────── */}
          <motion.div
            className="fixed inset-0 z-50 bg-lp-dark/40 backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={closeCart}
          />

          {/* ── Drawer panel ───────────────────────────────────────────── */}
          <motion.div
            className="
              fixed top-0 right-0 bottom-0 z-50
              w-full max-w-[400px]
              bg-lp-light dark:bg-lp-dark
              flex flex-col
              shadow-2xl
              transition-colors duration-350
            "
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ duration: 0.4, ease: [0.25, 0.1, 0.25, 1] }}
          >
            {/* ── Header ─────────────────────────────────────────────── */}
            <div className="
              flex items-center justify-between
              px-5 py-4
              border-b border-lp-border-light dark:border-lp-border-dark
              transition-colors duration-350
            ">
              <div className="flex items-center gap-2">
                <ShoppingBag size={16} strokeWidth={1.5} className="text-lp-gold" />
                <span className="text-[11px] tracking-lp-wider uppercase text-lp-ink dark:text-lp-mist transition-colors duration-350">
                  Your Bag
                </span>
                {itemCount > 0 && (
                  <span className="
                    text-[10px] bg-lp-gold text-lp-dark
                    w-5 h-5 rounded-full
                    flex items-center justify-center font-semibold
                  ">
                    {itemCount}
                  </span>
                )}
              </div>

              <button
                onClick={closeCart}
                className="
                  text-lp-muted-light dark:text-lp-muted-dark
                  hover:text-lp-ink dark:hover:text-lp-mist
                  transition-colors duration-200
                "
                aria-label="Close cart"
              >
                <X size={18} strokeWidth={1.5} />
              </button>
            </div>

            {/* ── Free shipping progress ──────────────────────────────── */}
            {!hasFreeShipping && subtotal > 0 && (
              <div className="px-5 py-3 border-b border-lp-border-light dark:border-lp-border-dark transition-colors duration-350">
                <p className="text-[10px] text-lp-muted-light dark:text-lp-muted-dark mb-2">
                  Add{' '}
                  <span className="text-lp-gold font-medium">
                    {formatPrice(amountForFreeShipping)}
                  </span>{' '}
                  more for free shipping
                </p>
                {/* Progress bar */}
                <div className="h-0.5 bg-lp-border-light dark:bg-lp-border-dark rounded-full overflow-hidden">
                  <motion.div
                    className="h-full bg-lp-gold rounded-full"
                    initial={{ width: 0 }}
                    animate={{
                      width: `${Math.min(100, (subtotal / CART.freeShippingThreshold) * 100)}%`,
                    }}
                    transition={{ duration: 0.5, ease: [0.25, 0.1, 0.25, 1] }}
                  />
                </div>
              </div>
            )}

            {hasFreeShipping && (
              <div className="px-5 py-2.5 bg-lp-gold/10 border-b border-lp-gold/20">
                <p className="text-[10px] tracking-lp-wide uppercase text-lp-gold text-center">
                  Free shipping applied
                </p>
              </div>
            )}

            {/* ── Items list ─────────────────────────────────────────── */}
            <div className="flex-1 overflow-y-auto py-2">
              {isEmpty ? (

                // Empty state
                <div className="flex flex-col items-center justify-center h-full gap-4 px-5 text-center">
                  <ShoppingBag
                    size={40}
                    strokeWidth={1}
                    className="text-lp-muted-light dark:text-lp-muted-dark"
                  />
                  <div>
                    <p className="font-display text-xl text-lp-ink dark:text-lp-mist mb-1 transition-colors duration-350">
                      Your bag is empty
                    </p>
                    <p className="text-[12px] text-lp-muted-light dark:text-lp-muted-dark">
                      Start exploring our collection
                    </p>
                  </div>
                  <button
                    onClick={closeCart}
                    className="text-[10px] tracking-lp-wider uppercase text-lp-gold hover:opacity-75 transition-opacity"
                  >
                    Continue Shopping
                  </button>
                </div>

              ) : (

                // Cart items
                <div>
                  {items.map((item, i) => (
                    <CartItem key={item.variantId} item={item} isLast={i === items.length - 1} />
                  ))}
                </div>
              )}
            </div>

            {/* ── Footer: summary + checkout ──────────────────────────── */}
            {!isEmpty && (
              <div className="
                border-t border-lp-border-light dark:border-lp-border-dark
                px-5 py-5 space-y-3
                transition-colors duration-350
              ">
                {/* Subtotal */}
                <div className="flex justify-between items-center text-[12px]">
                  <span className="text-lp-muted-light dark:text-lp-muted-dark">Subtotal</span>
                  <span className="text-lp-ink dark:text-lp-mist transition-colors duration-350">
                    {formatPrice(subtotal)}
                  </span>
                </div>

                {/* Shipping */}
                <div className="flex justify-between items-center text-[12px]">
                  <span className="text-lp-muted-light dark:text-lp-muted-dark">Shipping</span>
                  <span className={shipping === 0 ? 'text-lp-success' : 'text-lp-ink dark:text-lp-mist transition-colors duration-350'}>
                    {shipping === 0 ? 'Free' : formatPrice(shipping)}
                  </span>
                </div>

                {/* Divider */}
                <div className="h-px bg-lp-border-light dark:bg-lp-border-dark" />

                {/* Total */}
                <div className="flex justify-between items-center">
                  <span className="text-[11px] tracking-lp-wide uppercase text-lp-ink dark:text-lp-mist transition-colors duration-350">
                    Total
                  </span>
                  <span className="font-display text-xl text-lp-ink dark:text-lp-mist transition-colors duration-350">
                    {formatPrice(total)}
                  </span>
                </div>

                {/* Checkout CTA */}
                <Link href={ROUTES.checkout} onClick={closeCart}>
                  <Button variant="gold" size="md" fullWidth className="mt-1">
                    Proceed to Checkout
                  </Button>
                </Link>

                {/* Continue shopping */}
                <button
                  onClick={closeCart}
                  className="
                    w-full text-center
                    text-[10px] tracking-lp-wider uppercase
                    text-lp-muted-light dark:text-lp-muted-dark
                    hover:text-lp-ink dark:hover:text-lp-mist
                    transition-colors duration-200 py-1
                  "
                >
                  Continue Shopping
                </button>
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}
