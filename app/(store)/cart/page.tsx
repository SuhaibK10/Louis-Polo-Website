'use client'

// ─────────────────────────────────────────────────────────────────────────────
// app/(store)/cart/page.tsx
// Dedicated cart page — full view of cart items.
// On mobile this is the primary cart experience.
// Desktop users typically use the cart drawer instead.
// ─────────────────────────────────────────────────────────────────────────────

import Link from 'next/link'
import { motion } from 'framer-motion'
import { ShoppingBag } from 'lucide-react'
import { CartItem }  from '@/components/cart/CartItem'
import { Button }    from '@/components/ui/Button'
import { useCart }   from '@/hooks/useCart'
import { formatPrice } from '@/lib/utils'
import { CART, ROUTES } from '@/lib/constants'
import { fadeUp, staggerChildren, VIEWPORT_CONFIG } from '@/lib/animations'

export default function CartPage() {
  const {
    items, isEmpty, itemCount,
    subtotal, shipping, total,
    hasFreeShipping, amountForFreeShipping,
  } = useCart()

  if (isEmpty) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] px-5 text-center">
        <ShoppingBag size={48} strokeWidth={1} className="text-lp-muted-light dark:text-lp-muted-dark mb-4" />
        <h1 className="font-display text-2xl text-lp-ink dark:text-lp-mist mb-2 transition-colors duration-350">
          Your bag is empty
        </h1>
        <p className="text-[13px] text-lp-muted-light dark:text-lp-muted-dark mb-8">
          Start adding products to your cart
        </p>
        <Link href={ROUTES.shop}>
          <Button variant="gold" size="md">Browse Collection</Button>
        </Link>
      </div>
    )
  }

  return (
    <motion.div
      className="px-5 md:px-8 py-10 md:py-14"
      variants={staggerChildren}
      initial="hidden"
      animate="visible"
    >
      {/* Header */}
      <motion.div variants={fadeUp} className="mb-8">
        <p className="lp-eyebrow mb-2">Your Bag</p>
        <h1 className="font-display text-3xl md:text-4xl font-normal text-lp-ink dark:text-lp-mist leading-none tracking-lp-tight transition-colors duration-350">
          {itemCount} {itemCount === 1 ? 'Item' : 'Items'}
        </h1>
      </motion.div>

      <div className="md:grid md:grid-cols-3 md:gap-10">

        {/* Items */}
        <motion.div variants={fadeUp} className="md:col-span-2 space-y-4 mb-8 md:mb-0">
          {items.map((item) => (
            <CartItem key={item.variantId} item={item} />
          ))}
        </motion.div>

        {/* Summary */}
        <motion.div variants={fadeUp} className="md:col-span-1">
          <div className="border border-lp-border-light dark:border-lp-border-dark p-5 space-y-4">
            <p className="text-[10px] tracking-lp-wider uppercase text-lp-ink dark:text-lp-mist transition-colors duration-350">
              Order Summary
            </p>

            {/* Free shipping bar */}
            {!hasFreeShipping && (
              <div>
                <p className="text-[11px] text-lp-muted-light dark:text-lp-muted-dark mb-1.5">
                  Add {formatPrice(amountForFreeShipping)} more for free shipping
                </p>
                <div className="h-px bg-lp-border-light dark:bg-lp-border-dark overflow-hidden">
                  <div
                    className="h-full bg-lp-gold transition-all duration-500"
                    style={{ width: `${Math.min(100, (subtotal / CART.freeShippingThreshold) * 100)}%` }}
                  />
                </div>
              </div>
            )}

            <div className="space-y-2 pt-1">
              <div className="flex justify-between text-[12px]">
                <span className="text-lp-muted-light dark:text-lp-muted-dark">Subtotal</span>
                <span className="text-lp-ink dark:text-lp-mist transition-colors duration-350">
                  {formatPrice(subtotal)}
                </span>
              </div>
              <div className="flex justify-between text-[12px]">
                <span className="text-lp-muted-light dark:text-lp-muted-dark">Shipping</span>
                <span className={hasFreeShipping ? 'text-lp-gold' : 'text-lp-ink dark:text-lp-mist transition-colors duration-350'}>
                  {hasFreeShipping ? 'Free' : formatPrice(shipping)}
                </span>
              </div>
            </div>

            <div className="h-px bg-lp-border-light dark:bg-lp-border-dark" />

            <div className="flex justify-between">
              <span className="text-[10px] tracking-lp-wider uppercase text-lp-ink dark:text-lp-mist transition-colors duration-350">
                Total
              </span>
              <span className="font-display text-xl text-lp-ink dark:text-lp-mist transition-colors duration-350">
                {formatPrice(total)}
              </span>
            </div>

            <Link href={ROUTES.checkout}>
              <Button variant="gold" size="md" fullWidth>
                Proceed to Checkout
              </Button>
            </Link>
          </div>
        </motion.div>
      </div>
    </motion.div>
  )
}
