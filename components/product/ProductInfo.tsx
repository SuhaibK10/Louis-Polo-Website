'use client'

// ─────────────────────────────────────────────────────────────────────────────
// components/product/ProductInfo.tsx
// Right panel on product detail page.
// Handles: color selection → size selection → add to cart flow.
// Sticky on desktop. Scrolls on mobile.
// ─────────────────────────────────────────────────────────────────────────────

import { useState }     from 'react'
import { Check, Minus, Plus } from 'lucide-react'
import { motion }       from 'framer-motion'
import { Button }       from '@/components/ui/Button'
import { useCart }      from '@/hooks/useCart'
import { formatPrice, SIZE_ORDER } from '@/lib/utils'
import { fadeUp, VIEWPORT_CONFIG } from '@/lib/animations'
import type { Product, Variant }   from '@/types'

interface ProductInfoProps {
  product: Product
}

export function ProductInfo({ product }: ProductInfoProps) {
  const { addItem } = useCart()

  const variants = product.variants ?? []

  // Get unique colors
  const uniqueColors = Array.from(new Map(
    variants.map((v) => [v.color, v])
  ).values())

  // Get unique sizes for active color — sorted in correct order
  function getSizesForColor(color: string) {
    return variants
      .filter((v) => v.color === color)
      .sort((a, b) =>
        SIZE_ORDER.indexOf(a.size as typeof SIZE_ORDER[number]) -
        SIZE_ORDER.indexOf(b.size as typeof SIZE_ORDER[number])
      )
  }

  // State
  const [activeColor, setActiveColor] = useState<Variant>(uniqueColors[0] ?? variants[0])
  const [activeSize,  setActiveSize]  = useState<Variant | null>(() => {
    const sizes = getSizesForColor(uniqueColors[0]?.color ?? '')
    // Auto-select if only one size
    return sizes.length === 1 ? sizes[0] : null
  })
  const [quantity, setQuantity]       = useState(1)
  const [added, setAdded]             = useState(false)

  const sizesForColor = getSizesForColor(activeColor?.color ?? '')
  const selectedVariant = activeSize

  // Price display
  const displayPrice = selectedVariant
    ? selectedVariant.price
    : Math.min(...sizesForColor.map((v) => v.price))

  const hasMultipleSizes = sizesForColor.length > 1

  function handleColorChange(variant: Variant) {
    setActiveColor(variant)
    const sizes = getSizesForColor(variant.color)
    // Auto-select if only one size
    setActiveSize(sizes.length === 1 ? sizes[0] : null)
  }

  function handleAddToCart() {
    if (!selectedVariant) return

    addItem({
      variantId:   selectedVariant.id,
      productId:   product.id,
      productName: product.name,
      productSlug: product.slug,
      image:       product.images[0] ?? '',
      color:       selectedVariant.color,
      colorHex:    selectedVariant.colorHex,
      size:        selectedVariant.size,
      price:       selectedVariant.price,
      quantity,
    })

    // Show confirmation flash
    setAdded(true)
    setTimeout(() => setAdded(false), 2000)
  }

  return (
    <div className="px-5 py-8 md:px-8 md:py-10 space-y-7">

      {/* ── Name + tag ─────────────────────────────────────────────────── */}
      <div>
        {product.tag && (
          <p className="lp-eyebrow mb-2">{product.tag}</p>
        )}
        <h1 className="
          font-display text-3xl md:text-4xl lg:text-5xl
          font-normal leading-none tracking-lp-tight
          text-lp-ink dark:text-lp-mist
          transition-colors duration-350
        ">
          {product.name}
        </h1>
      </div>

      {/* ── Price ──────────────────────────────────────────────────────── */}
      <div className="flex items-baseline gap-2">
        {!selectedVariant && hasMultipleSizes && (
          <span className="text-[11px] tracking-lp-wide uppercase text-lp-muted-light dark:text-lp-muted-dark">
            From
          </span>
        )}
        <span className="font-display text-3xl font-normal text-lp-ink dark:text-lp-mist transition-colors duration-350">
          {formatPrice(displayPrice)}
        </span>
        <span className="text-[11px] text-lp-muted-light dark:text-lp-muted-dark">
          incl. all taxes
        </span>
      </div>

      <div className="h-px bg-lp-border-light dark:bg-lp-border-dark transition-colors duration-350" />

      {/* ── Color picker ───────────────────────────────────────────────── */}
      {uniqueColors.length > 0 && (
        <div>
          <div className="flex items-center justify-between mb-3">
            <p className="text-[10px] tracking-lp-wider uppercase text-lp-muted-light dark:text-lp-muted-dark">
              Color
            </p>
            <p className="text-[11px] text-lp-ink dark:text-lp-mist font-medium transition-colors duration-350">
              {activeColor?.color}
            </p>
          </div>

          <div className="flex gap-2.5 flex-wrap">
            {uniqueColors.map((variant) => (
              <button
                key={variant.color}
                title={variant.color}
                onClick={() => handleColorChange(variant)}
                className={`
                  w-7 h-7 rounded-full flex-shrink-0
                  transition-all duration-200
                  ${activeColor?.color === variant.color
                    ? 'ring-2 ring-offset-2 ring-lp-gold ring-offset-lp-light dark:ring-offset-lp-dark scale-110'
                    : 'hover:scale-105'
                  }
                `}
                style={{ backgroundColor: variant.colorHex }}
                aria-label={variant.color}
                aria-pressed={activeColor?.color === variant.color}
              />
            ))}
          </div>
        </div>
      )}

      {/* ── Size picker — only shown if multiple sizes ──────────────────── */}
      {hasMultipleSizes && (
        <div>
          <div className="flex items-center justify-between mb-3">
            <p className="text-[10px] tracking-lp-wider uppercase text-lp-muted-light dark:text-lp-muted-dark">
              Size
            </p>
            {!activeSize && (
              <p className="text-[10px] text-lp-error">Please select a size</p>
            )}
          </div>

          <div className="flex gap-2.5 flex-wrap">
            {sizesForColor.map((variant) => {
              const inStock   = variant.stock > 0
              const isActive  = activeSize?.id === variant.id

              return (
                <button
                  key={variant.id}
                  onClick={() => inStock && setActiveSize(variant)}
                  disabled={!inStock}
                  className={`
                    px-4 py-2.5 text-[11px] tracking-lp-wide uppercase
                    border transition-all duration-200 font-medium
                    disabled:opacity-40 disabled:cursor-not-allowed
                    ${isActive
                      ? 'bg-lp-gold text-lp-dark border-lp-gold'
                      : 'border-lp-border-light dark:border-lp-border-dark text-lp-ink dark:text-lp-mist hover:border-lp-gold'
                    }
                  `}
                >
                  {variant.size}
                  {!inStock && ' (Out)'}
                </button>
              )
            })}
          </div>
        </div>
      )}

      {/* ── Quantity picker ─────────────────────────────────────────────── */}
      <div>
        <p className="text-[10px] tracking-lp-wider uppercase text-lp-muted-light dark:text-lp-muted-dark mb-3">
          Quantity
        </p>
        <div className="flex items-center gap-3">
          <button
            onClick={() => setQuantity(Math.max(1, quantity - 1))}
            className="
              w-9 h-9 border border-lp-border-light dark:border-lp-border-dark
              flex items-center justify-center
              text-lp-ink dark:text-lp-mist
              hover:border-lp-gold hover:text-lp-gold
              transition-all duration-200
            "
          >
            <Minus size={13} strokeWidth={2} />
          </button>

          <span className="w-8 text-center text-[15px] font-medium text-lp-ink dark:text-lp-mist tabular-nums transition-colors duration-350">
            {quantity}
          </span>

          <button
            onClick={() => setQuantity(Math.min(10, quantity + 1))}
            className="
              w-9 h-9 border border-lp-border-light dark:border-lp-border-dark
              flex items-center justify-center
              text-lp-ink dark:text-lp-mist
              hover:border-lp-gold hover:text-lp-gold
              transition-all duration-200
            "
          >
            <Plus size={13} strokeWidth={2} />
          </button>
        </div>
      </div>

      {/* ── Add to cart button ─────────────────────────────────────────── */}
      <Button
        variant="gold"
        size="lg"
        fullWidth
        onClick={handleAddToCart}
        disabled={hasMultipleSizes && !activeSize}
        className="transition-all duration-300"
      >
        {added ? (
          <>
            <Check size={14} strokeWidth={2} />
            Added to Cart
          </>
        ) : (
          hasMultipleSizes && !activeSize
            ? 'Select a Size'
            : 'Add to Cart'
        )}
      </Button>

      <div className="h-px bg-lp-border-light dark:bg-lp-border-dark transition-colors duration-350" />

      {/* ── Description ─────────────────────────────────────────────────── */}
      <div>
        <p className="text-[10px] tracking-lp-wider uppercase text-lp-muted-light dark:text-lp-muted-dark mb-3">
          About
        </p>
        <p className="text-[13px] leading-relaxed text-lp-muted-light dark:text-lp-muted-dark">
          {product.description}
        </p>
      </div>

      {/* ── Features ────────────────────────────────────────────────────── */}
      {product.features?.length > 0 && (
        <div>
          <p className="text-[10px] tracking-lp-wider uppercase text-lp-muted-light dark:text-lp-muted-dark mb-3">
            Features
          </p>
          <div className="space-y-2.5">
            {product.features.map((feature) => (
              <div key={feature.label} className="flex items-center gap-3">
                <div className="w-1.5 h-1.5 rounded-full bg-lp-gold flex-shrink-0" />
                <span className="text-[12px] text-lp-ink dark:text-lp-mist transition-colors duration-350">
                  {feature.label}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ── Weight info ─────────────────────────────────────────────────── */}
      {selectedVariant?.weight_kg ? (
        <p className="text-[11px] text-lp-muted-light dark:text-lp-muted-dark">
          Net weight: {selectedVariant.weight_kg} kg
        </p>
      ) : null}
    </div>
  )
}
