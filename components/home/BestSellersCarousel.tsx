'use client'

// ─────────────────────────────────────────────────────────────────────────────
// components/home/BestSellersCarousel.tsx
// Auto-sliding product carousel for featured/best seller products.
// Built from scratch — no external library. Zero extra dependencies.
//
// Features:
// - Auto-slides every 3.5 seconds
// - Pauses on touch (user is interacting)
// - Resumes 5 seconds after last touch
// - Swipe gesture support on mobile
// - Gold dot indicators
// - Peek design — 1.15 cards visible (signals "swipe for more")
// - Card entrance animation on slide change
// ─────────────────────────────────────────────────────────────────────────────

import { useState, useEffect, useRef, useCallback } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { motion, AnimatePresence } from 'framer-motion'
import { ArrowRight } from 'lucide-react'
import { formatPrice } from '@/lib/utils'
import { ROUTES } from '@/lib/constants'
import { fadeUp, VIEWPORT_CONFIG } from '@/lib/animations'
import type { Product } from '@/types'

interface BestSellersCarouselProps {
  products: Product[]
}

// Auto-slide interval in ms
const SLIDE_INTERVAL = 2000
// How long to wait after user touch before resuming auto-slide
const RESUME_DELAY = 5000

export function BestSellersCarousel({ products }: BestSellersCarouselProps) {
  const [current, setCurrent]         = useState(0)
  const [paused, setPaused]           = useState(false)
  const [direction, setDirection]     = useState<'left' | 'right'>('left')
  const autoSlideTimer = useRef<ReturnType<typeof setInterval> | null>(null)
  const resumeTimer    = useRef<ReturnType<typeof setTimeout> | null>(null)

  // Touch tracking for swipe gesture
  const touchStart                    = useRef<number>(0)
  const touchEnd                      = useRef<number>(0)

  // No products — don't render
  if (!products.length) return null

  const total = products.length

  // ─── Navigation ───────────────────────────────────────────────────────────

  const goTo = useCallback((index: number, dir: 'left' | 'right' = 'left') => {
    setDirection(dir)
    setCurrent((index + total) % total)
  }, [total])

  const next = useCallback(() => goTo(current + 1, 'left'), [current, goTo])
  const prev = useCallback(() => goTo(current - 1, 'right'), [current, goTo])

  // ─── Auto-slide ───────────────────────────────────────────────────────────

  useEffect(() => {
    if (paused) return

    autoSlideTimer.current = setInterval(next, SLIDE_INTERVAL)
    return () => clearInterval(autoSlideTimer.current ?? undefined)
  }, [paused, next])

  // ─── Touch handlers ───────────────────────────────────────────────────────

  function handleTouchStart(e: React.TouchEvent) {
    touchStart.current = e.targetTouches[0].clientX
    // Pause auto-slide while user is touching
    setPaused(true)
    clearTimeout(resumeTimer.current ?? undefined)
  }

  function handleTouchEnd(e: React.TouchEvent) {
    touchEnd.current = e.changedTouches[0].clientX
    const delta = touchStart.current - touchEnd.current

    // Swipe threshold — 50px minimum
    if (Math.abs(delta) > 50) {
      delta > 0 ? next() : prev()
    }

    // Resume auto-slide after delay
    resumeTimer.current = setTimeout(() => setPaused(false), RESUME_DELAY)
  }

  // ─── Card slide animation ─────────────────────────────────────────────────

  const slideVariants = {
    enter: (dir: 'left' | 'right') => ({
      x:       dir === 'left' ? 40 : -40,
      opacity: 0,
      scale:   0.97,
    }),
    center: {
      x:       0,
      opacity: 1,
      scale:   1,
      transition: { duration: 0.5, ease: [0.25, 0.1, 0.25, 1] },
    },
    exit: (dir: 'left' | 'right') => ({
      x:       dir === 'left' ? -40 : 40,
      opacity: 0,
      scale:   0.97,
      transition: { duration: 0.35, ease: [0.25, 0.1, 0.25, 1] },
    }),
  }

  const product  = products[current]
  // Lowest price from variants
  const minPrice = product.variants?.length
    ? Math.min(...product.variants.map((v) => v.price))
    : 0

  return (
    <motion.section
      className="py-14 md:py-20 overflow-hidden"
      variants={fadeUp}
      initial="hidden"
      whileInView="visible"
      viewport={VIEWPORT_CONFIG}
    >
      {/* ── Section header ─────────────────────────────────────────────── */}
      <div className="px-5 md:px-8 mb-8">
        <p className="lp-eyebrow mb-2">Featured</p>
        <h2 className="font-display text-3xl md:text-4xl font-normal text-lp-ink dark:text-lp-mist leading-none tracking-lp-tight transition-colors duration-350">
          Best Sellers
        </h2>
      </div>

      {/* ── Carousel ───────────────────────────────────────────────────── */}
      <div
        className="px-5 md:px-8 cursor-grab active:cursor-grabbing"
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
      >
        <AnimatePresence custom={direction} mode="wait">
          <motion.div
            key={current}
            custom={direction}
            variants={slideVariants}
            initial="enter"
            animate="center"
            exit="exit"
            className="
              grid grid-cols-1 md:grid-cols-2
              gap-0
              bg-lp-surface-light dark:bg-lp-surface-dark
              transition-colors duration-350
            "
          >
            {/* ── Product image ─────────────────────────────────────── */}
            <div className="relative aspect-[4/3] md:aspect-auto md:min-h-[480px] overflow-hidden bg-lp-surface-light dark:bg-lp-surface-dark">
              {product.images[0] ? (
                <Image
                  src={`https://res.cloudinary.com/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}/image/upload/f_auto,q_85,w_800,c_fit/${product.images[0]}`}
                  alt={product.name}
                  fill
                  className="object-contain transition-transform duration-700 hover:scale-[1.03]"
                  sizes="(max-width: 768px) 100vw, 50vw"
                  priority={current === 0}
                />
              ) : (
                // Placeholder while images are being uploaded to Cloudinary
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="font-display text-6xl text-lp-gold/20 select-none">
                    LP
                  </span>
                </div>
              )}

              {/* Tag badge */}
              {product.tag && (
                <div className="absolute top-4 left-4 bg-lp-gold text-lp-dark text-[9px] tracking-lp-wide uppercase px-2.5 py-1.5 font-semibold">
                  {product.tag}
                </div>
              )}
            </div>

            {/* ── Product info ──────────────────────────────────────── */}
            <div className="flex flex-col justify-between p-6 md:p-10">
              <div>
                <p className="lp-eyebrow mb-3">
                  {product.category === 'set' ? 'Set' : 'Hard Shell Trolley'}
                </p>

                <h3 className="font-display text-3xl md:text-4xl lg:text-5xl font-normal text-lp-ink dark:text-lp-mist leading-none tracking-lp-tight mb-4 transition-colors duration-350">
                  {product.name}
                </h3>

                <p className="text-[13px] text-lp-muted-light dark:text-lp-muted-dark leading-relaxed mb-6 line-clamp-3">
                  {product.description}
                </p>

                {/* Feature highlights */}
                {product.features?.slice(0, 3).map((feature) => (
                  <div
                    key={feature.label}
                    className="flex items-center gap-2 mb-2"
                  >
                    <div className="w-1 h-1 rounded-full bg-lp-gold flex-shrink-0" />
                    <span className="text-[11px] tracking-lp-wide uppercase text-lp-muted-light dark:text-lp-muted-dark">
                      {feature.label}
                    </span>
                  </div>
                ))}
              </div>

              {/* Price + CTA */}
              <div className="mt-8">
                <div className="flex items-baseline gap-1 mb-4">
                  <span className="text-[11px] tracking-lp-wide uppercase text-lp-muted-light dark:text-lp-muted-dark">
                    From
                  </span>
                  <span className="font-display text-3xl font-normal text-lp-ink dark:text-lp-mist transition-colors duration-350">
                    {formatPrice(minPrice)}
                  </span>
                </div>

                <Link href={`${ROUTES.shop}/${product.slug}`}>
                  <button className="
                    flex items-center gap-2
                    text-[10px] tracking-lp-wider uppercase
                    text-lp-ink dark:text-lp-mist
                    hover:text-lp-gold dark:hover:text-lp-gold
                    transition-colors duration-200
                    group
                  ">
                    Explore Product
                    <ArrowRight
                      size={13}
                      strokeWidth={1.5}
                      className="group-hover:translate-x-1 transition-transform duration-200"
                    />
                  </button>
                </Link>
              </div>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>

      {/* ── Dot indicators + counter ───────────────────────────────────── */}
      <div className="flex items-center justify-between px-5 md:px-8 mt-5">

        {/* Dots */}
        <div className="flex items-center gap-2">
          {products.map((_, i) => (
            <button
              key={i}
              onClick={() => goTo(i, i > current ? 'left' : 'right')}
              aria-label={`Go to slide ${i + 1}`}
              className="
                transition-all duration-300
                rounded-full
              "
              style={{
                width:           i === current ? '20px' : '6px',
                height:          '6px',
                backgroundColor: i === current ? '#C9A96E' : undefined,
              }}
              // Non-active dots inherit muted color via class
              data-active={i === current}
            >
              {i !== current && (
                <span className="block w-full h-full rounded-full bg-lp-muted-light/30 dark:bg-lp-muted-dark/30" />
              )}
            </button>
          ))}
        </div>

        {/* Counter */}
        <span className="text-[10px] tracking-lp-wide text-lp-muted-light dark:text-lp-muted-dark tabular-nums">
          {String(current + 1).padStart(2, '0')} / {String(total).padStart(2, '0')}
        </span>
      </div>
    </motion.section>
  )
}
