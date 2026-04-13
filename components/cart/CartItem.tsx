'use client'

// ─────────────────────────────────────────────────────────────────────────────
// components/cart/CartItem.tsx
// Individual item row inside the CartDrawer.
// Shows: image, name, color, size, quantity controls, price, remove button.
// ─────────────────────────────────────────────────────────────────────────────

import Image      from 'next/image'
import { Minus, Plus, X } from 'lucide-react'
import { motion }          from 'framer-motion'
import { useCart }         from '@/hooks/useCart'
import { formatPrice }     from '@/lib/utils'
import type { CartItem as CartItemType } from '@/types'

const CLOUD = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME

interface CartItemProps {
  item:   CartItemType
  isLast: boolean
}

export function CartItem({ item, isLast }: CartItemProps) {
  const { updateQty, removeItem } = useCart()

  const imageUrl = item.image
    ? `https://res.cloudinary.com/${CLOUD}/image/upload/f_auto,q_80,w_200,h_267,c_fill/${item.image}`
    : null

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, x: 20 }}
      transition={{ duration: 0.3, ease: [0.25, 0.1, 0.25, 1] }}
      className={`
        flex gap-3.5 px-5 py-4
        ${!isLast ? 'border-b border-lp-border-light dark:border-lp-border-dark' : ''}
        transition-colors duration-350
      `}
    >
      {/* ── Product image ────────────────────────────────────────────── */}
      <div className="
        relative w-20 flex-shrink-0 aspect-[3/4]
        bg-lp-surface-light dark:bg-lp-surface-dark
        overflow-hidden transition-colors duration-350
      ">
        {imageUrl ? (
          <Image
            src={imageUrl}
            alt={item.productName}
            fill
            className="object-cover"
            sizes="80px"
          />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="font-display text-xl text-lp-gold/25 select-none">LP</span>
          </div>
        )}
      </div>

      {/* ── Item details ─────────────────────────────────────────────── */}
      <div className="flex-1 min-w-0">
        <div className="flex items-start justify-between gap-2">

          {/* Name + details */}
          <div className="min-w-0">
            <h4 className="
              font-display text-[15px] font-normal leading-tight
              text-lp-ink dark:text-lp-mist
              truncate transition-colors duration-350
            ">
              {item.productName}
            </h4>

            {/* Color chip + size */}
            <div className="flex items-center gap-2 mt-1 mb-2.5">
              <span
                className="inline-block w-2.5 h-2.5 rounded-full flex-shrink-0"
                style={{ backgroundColor: item.colorHex }}
              />
              <span className="text-[11px] text-lp-muted-light dark:text-lp-muted-dark">
                {item.color}
                {item.size ? ` · ${item.size}` : ''}
              </span>
            </div>

            {/* Quantity controls */}
            <div className="flex items-center gap-2">
              <button
                onClick={() => updateQty(item.variantId, item.quantity - 1)}
                className="
                  w-6 h-6 border border-lp-border-light dark:border-lp-border-dark
                  flex items-center justify-center
                  text-lp-muted-light dark:text-lp-muted-dark
                  hover:border-lp-gold hover:text-lp-gold
                  transition-all duration-200
                "
                aria-label="Decrease quantity"
              >
                <Minus size={10} strokeWidth={2} />
              </button>

              <span className="
                text-[13px] font-medium w-5 text-center tabular-nums
                text-lp-ink dark:text-lp-mist transition-colors duration-350
              ">
                {item.quantity}
              </span>

              <button
                onClick={() => updateQty(item.variantId, item.quantity + 1)}
                disabled={item.quantity >= 10}
                className="
                  w-6 h-6 border border-lp-border-light dark:border-lp-border-dark
                  flex items-center justify-center
                  text-lp-muted-light dark:text-lp-muted-dark
                  hover:border-lp-gold hover:text-lp-gold
                  disabled:opacity-40 disabled:cursor-not-allowed
                  transition-all duration-200
                "
                aria-label="Increase quantity"
              >
                <Plus size={10} strokeWidth={2} />
              </button>
            </div>
          </div>

          {/* Price + remove */}
          <div className="flex flex-col items-end gap-2 flex-shrink-0">
            {/* Remove */}
            <button
              onClick={() => removeItem(item.variantId)}
              className="
                text-lp-muted-light dark:text-lp-muted-dark
                hover:text-lp-error
                transition-colors duration-200
              "
              aria-label={`Remove ${item.productName}`}
            >
              <X size={14} strokeWidth={1.5} />
            </button>

            {/* Line total */}
            <span className="
              text-[14px] font-medium
              text-lp-ink dark:text-lp-mist
              transition-colors duration-350
            ">
              {formatPrice(item.price * item.quantity)}
            </span>
          </div>
        </div>
      </div>
    </motion.div>
  )
}
