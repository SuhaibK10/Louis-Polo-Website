'use client'

// ─────────────────────────────────────────────────────────────────────────────
// components/shop/ProductCard.tsx
// Individual product card — horizontal layout (image left, info right).
// Optimised for mobile thumb interaction.
// Shows: image, tag, name, category, color swatches, price, + button.
// ─────────────────────────────────────────────────────────────────────────────

import { useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { Plus } from 'lucide-react'
import { useCart } from '@/hooks/useCart'
import { formatPrice } from '@/lib/utils'
import { ROUTES } from '@/lib/constants'
import type { Product, Variant } from '@/types'

interface ProductCardProps {
  product: Product
}

export function ProductCard({ product }: ProductCardProps) {
  const { addItem } = useCart()

  // Active color — defaults to first variant's color
  const variants     = product.variants ?? []
  const uniqueColors = Array.from(new Map(variants.map((v) => [v.color, v])).values())
  const [activeColor, setActiveColor] = useState<Variant>(uniqueColors[0] ?? variants[0])

  // Price for active color (lowest size)
  const colorVariants = variants.filter((v) => v.color === activeColor?.color)
  const price         = colorVariants.length
    ? Math.min(...colorVariants.map((v) => v.price))
    : 0

  // First image — use activeColor if multiple images per color later
  const image = product.images?.[0] ?? null

  function handleAddToCart(e: React.MouseEvent) {
    // Prevent navigation to product page when clicking +
    e.preventDefault()
    e.stopPropagation()

    if (!activeColor) return

    addItem({
      variantId:   activeColor.id,
      productId:   product.id,
      productName: product.name,
      productSlug: product.slug,
      image:       image ?? '',
      color:       activeColor.color,
      colorHex:    activeColor.colorHex,
      size:        activeColor.size,
      price,
      quantity:    1,
    })
  }

  return (
    <Link
      href={`${ROUTES.shop}/${product.slug}`}
      className="
        block group
        hover:opacity-95 transition-opacity duration-200
      "
    >
      <div className="flex gap-3.5 items-start">

        {/* ── Product image ──────────────────────────────────────────────── */}
        <div
          className="
            relative w-[130px] flex-shrink-0 aspect-[3/4]
            bg-lp-surface-light dark:bg-lp-surface-dark
            overflow-hidden transition-colors duration-350
          "
        >
          {/* Tag badge */}
          {product.tag && (
            <div className="
              absolute top-2 left-2 z-10
              bg-lp-gold text-lp-dark
              text-[8px] tracking-lp-wide uppercase font-semibold
              px-2 py-1
            ">
              {product.tag}
            </div>
          )}

          {image ? (
            <Image
              src={`https://res.cloudinary.com/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}/image/upload/f_auto,q_80,w_400,h_533,c_fit/${image}`}
              alt={product.name}
              fill
              className="object-contain group-hover:scale-[1.03] transition-transform duration-500"
              sizes="130px"
            />
          ) : (
            // Placeholder until images uploaded to Cloudinary
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="font-display text-3xl text-lp-gold/25 select-none">LP</span>
            </div>
          )}
        </div>

        {/* ── Product info ───────────────────────────────────────────────── */}
        <div className="flex-1 pt-1 min-w-0">

          {/* Name */}
          <h3 className="
            font-display text-[17px] font-normal leading-tight tracking-lp-tight
            text-lp-ink dark:text-lp-mist
            mb-1 transition-colors duration-350
            group-hover:text-lp-gold
          ">
            {product.name}
          </h3>

          {/* Category */}
          <p className="
            text-[9px] tracking-lp-wide uppercase
            text-lp-muted-light dark:text-lp-muted-dark
            mb-3
          ">
            {product.category === 'office-bag'
              ? 'Office Bag'
              : product.category.charAt(0).toUpperCase() + product.category.slice(1)
            }
            {/* Show available sizes */}
            {colorVariants.length > 1 && (
              <span className="ml-2 text-lp-gold">
                {colorVariants.map((v) => v.size).filter(Boolean).join(' · ')}
              </span>
            )}
          </p>

          {/* Color swatches */}
          {uniqueColors.length > 0 && (
            <div className="flex gap-1.5 mb-3 flex-wrap">
              {uniqueColors.map((variant) => (
                <button
                  key={variant.color}
                  title={variant.color}
                  onClick={(e) => {
                    e.preventDefault()
                    e.stopPropagation()
                    setActiveColor(variant)
                  }}
                  className={`
                    w-3.5 h-3.5 rounded-full flex-shrink-0
                    transition-all duration-200
                    ${activeColor?.color === variant.color
                      ? 'ring-1 ring-offset-1 ring-lp-gold ring-offset-lp-light dark:ring-offset-lp-dark'
                      : 'opacity-70 hover:opacity-100'
                    }
                  `}
                  style={{ backgroundColor: variant.colorHex }}
                  aria-label={variant.color}
                />
              ))}
            </div>
          )}

          {/* Price + Add button */}
          <div className="flex items-center justify-between">
            <div>
              {uniqueColors.length > 1 && (
                <span className="text-[9px] text-lp-muted-light dark:text-lp-muted-dark">
                  From{' '}
                </span>
              )}
              <span className="text-[16px] font-medium text-lp-ink dark:text-lp-mist transition-colors duration-350">
                {formatPrice(price)}
              </span>
            </div>

            {/* Add to cart button */}
            <button
              onClick={handleAddToCart}
              className="
                w-9 h-9 flex-shrink-0
                flex items-center justify-center
                bg-lp-gold text-lp-dark
                hover:opacity-85 active:scale-95
                transition-all duration-200
              "
              aria-label={`Add ${product.name} to cart`}
            >
              <Plus size={16} strokeWidth={2} />
            </button>
          </div>
        </div>
      </div>
    </Link>
  )
}
