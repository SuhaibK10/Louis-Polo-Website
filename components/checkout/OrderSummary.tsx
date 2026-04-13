// ─────────────────────────────────────────────────────────────────────────────
// components/checkout/OrderSummary.tsx
// Read-only order summary shown during checkout.
// Displays cart items, subtotal, shipping, and total.
// ─────────────────────────────────────────────────────────────────────────────

import Image from 'next/image'
import { useCart }     from '@/hooks/useCart'
import { formatPrice } from '@/lib/utils'

const CLOUD = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME

export function OrderSummary() {
  const { items, subtotal, shipping, total, hasFreeShipping } = useCart()

  return (
    <div className="space-y-4">
      {/* Items */}
      <div className="space-y-3">
        {items.map((item) => (
          <div key={item.variantId} className="flex gap-3 items-start">
            {/* Thumbnail */}
            <div className="
              relative w-14 h-14 flex-shrink-0
              bg-lp-surface-light dark:bg-lp-surface-dark
              overflow-hidden transition-colors duration-350
            ">
              {item.image ? (
                <Image
                  src={`https://res.cloudinary.com/${CLOUD}/image/upload/f_auto,q_70,w_120,h_120,c_fill/${item.image}`}
                  alt={item.productName}
                  fill
                  className="object-cover"
                  sizes="56px"
                />
              ) : (
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="font-display text-lg text-lp-gold/25">LP</span>
                </div>
              )}

              {/* Quantity badge */}
              <div className="
                absolute -top-1.5 -right-1.5
                w-4.5 h-4.5 rounded-full
                bg-lp-gold text-lp-dark
                text-[9px] font-bold
                flex items-center justify-center
              ">
                {item.quantity}
              </div>
            </div>

            {/* Info */}
            <div className="flex-1 min-w-0">
              <p className="text-[12px] font-medium text-lp-ink dark:text-lp-mist leading-tight mb-0.5 transition-colors duration-350 truncate">
                {item.productName}
              </p>
              <p className="text-[10px] text-lp-muted-light dark:text-lp-muted-dark">
                {item.color}{item.size ? ` · ${item.size}` : ''}
              </p>
            </div>

            {/* Price */}
            <p className="text-[12px] text-lp-ink dark:text-lp-mist flex-shrink-0 transition-colors duration-350">
              {formatPrice(item.price * item.quantity)}
            </p>
          </div>
        ))}
      </div>

      <div className="h-px bg-lp-border-light dark:bg-lp-border-dark" />

      {/* Totals */}
      <div className="space-y-2">
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
    </div>
  )
}
