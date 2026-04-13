'use client'

// ─────────────────────────────────────────────────────────────────────────────
// components/shop/ProductGrid.tsx
// Product listing grid with:
// - Category filter chips (horizontal scroll on mobile)
// - Animated product cards with stagger
// - Empty state when no products match filter
// ─────────────────────────────────────────────────────────────────────────────

import { useState } from 'react'
import { useRouter, usePathname } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import { ProductCard } from '@/components/shop/ProductCard'
import { CATEGORIES }  from '@/lib/constants'
import { staggerFast, fadeUp, VIEWPORT_CONFIG } from '@/lib/animations'
import type { Product, ProductCategory } from '@/types'

interface ProductGridProps {
  products:       Product[]
  activeCategory?: ProductCategory
}

export function ProductGrid({ products, activeCategory }: ProductGridProps) {
  const router   = useRouter()
  const pathname = usePathname()

  // Client-side active category — synced with URL
  const [active, setActive] = useState<ProductCategory | 'all'>(
    activeCategory ?? 'all'
  )

  // Filter products by active category
  const filtered = active === 'all'
    ? products
    : products.filter((p) => p.category === active)

  function handleCategoryChange(value: ProductCategory | 'all') {
    setActive(value)
    // Update URL without full page reload — preserves state
    const params = new URLSearchParams()
    if (value !== 'all') params.set('category', value)
    router.replace(`${pathname}?${params.toString()}`, { scroll: false })
  }

  return (
    <div>
      {/* ── Category filter chips ──────────────────────────────────────── */}
      <div className="flex gap-2.5 overflow-x-auto scrollbar-hide pb-1 mb-8 md:mb-10">
        {CATEGORIES.map(({ label, value }) => {
          const isActive = active === value
          return (
            <button
              key={value}
              onClick={() => handleCategoryChange(value)}
              className={`
                flex-shrink-0 px-4 py-2
                text-[9px] tracking-lp-wider uppercase
                border transition-all duration-250
                ${isActive
                  ? 'bg-lp-gold text-lp-dark border-lp-gold'
                  : 'border-lp-border-light dark:border-lp-border-dark text-lp-muted-light dark:text-lp-muted-dark bg-transparent hover:border-lp-gold hover:text-lp-gold'
                }
              `}
            >
              {label}
            </button>
          )
        })}
      </div>

      {/* ── Product list — mobile: single column, desktop: 2-3 columns ─── */}
      <AnimatePresence mode="wait">
        {filtered.length === 0 ? (

          // Empty state
          <motion.div
            key="empty"
            className="text-center py-20"
            variants={fadeUp}
            initial="hidden"
            animate="visible"
          >
            <p className="font-display text-2xl text-lp-ink dark:text-lp-mist mb-2 transition-colors duration-350">
              No products found
            </p>
            <p className="text-[12px] text-lp-muted-light dark:text-lp-muted-dark">
              Try a different category
            </p>
          </motion.div>

        ) : (

          // Product grid
          <motion.div
            key={active}
            className="
              flex flex-col gap-4 md:gap-5
              md:grid md:grid-cols-2 lg:grid-cols-3
            "
            variants={staggerFast}
            initial="hidden"
            animate="visible"
          >
            {filtered.map((product) => (
              <motion.div key={product.id} variants={fadeUp}>
                <ProductCard product={product} />
              </motion.div>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
