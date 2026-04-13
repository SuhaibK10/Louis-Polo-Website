'use client'

// ─────────────────────────────────────────────────────────────────────────────
// components/home/CategoryGrid.tsx
// Horizontally scrollable category chip strip on mobile.
// 2×3 tap-to-browse grid on desktop.
// Stagger-animates on scroll entry.
// ─────────────────────────────────────────────────────────────────────────────

import Link from 'next/link'
import { motion } from 'framer-motion'
import { ArrowRight } from 'lucide-react'
import { ROUTES } from '@/lib/constants'
import { fadeUp, staggerChildren, VIEWPORT_CONFIG } from '@/lib/animations'

const CATEGORIES = [
  {
    label:    'Trolley Bags',
    slug:     'trolley',
    sub:      'Hard shell · 20" to 28"',
    count:    '10 styles',
  },
  {
    label:    'Sets',
    slug:     'set',
    sub:      '3-piece nesting sets',
    count:    '3 styles',
  },
  {
    label:    'Backpacks',
    slug:     'backpack',
    sub:      'Hard shell protection',
    count:    '2 styles',
  },
  {
    label:    'Office Bags',
    slug:     'office-bag',
    sub:      'Professional carry',
    count:    '2 styles',
  },
] as const

export function CategoryGrid() {
  return (
    <motion.section
      className="py-14 md:py-20 px-5 md:px-8"
      variants={staggerChildren}
      initial="hidden"
      whileInView="visible"
      viewport={VIEWPORT_CONFIG}
    >
      {/* ── Header ─────────────────────────────────────────────────────── */}
      <motion.div variants={fadeUp} className="flex items-end justify-between mb-8">
        <div>
          <p className="lp-eyebrow mb-2">Browse</p>
          <h2 className="font-display text-3xl md:text-4xl font-normal text-lp-ink dark:text-lp-mist leading-none tracking-lp-tight transition-colors duration-350">
            Our Collections
          </h2>
        </div>

        <Link
          href={ROUTES.shop}
          className="
            hidden md:flex items-center gap-1.5
            text-[10px] tracking-lp-wider uppercase
            text-lp-muted-light dark:text-lp-muted-dark
            hover:text-lp-gold dark:hover:text-lp-gold
            transition-colors duration-200 group
          "
        >
          View All
          <ArrowRight size={12} strokeWidth={1.5} className="group-hover:translate-x-0.5 transition-transform" />
        </Link>
      </motion.div>

      {/* ── Category grid ──────────────────────────────────────────────── */}
      {/* Mobile: horizontal scroll — Desktop: 2×2 grid */}
      <div className="
        flex gap-3 overflow-x-auto scrollbar-hide pb-2
        md:grid md:grid-cols-2 md:overflow-visible md:pb-0
        lg:grid-cols-4
      ">
        {CATEGORIES.map(({ label, slug, sub, count }) => (
          <motion.div key={slug} variants={fadeUp}>
            <Link
              href={`${ROUTES.shop}?category=${slug}`}
              className="
                flex-shrink-0
                flex flex-col justify-between
                w-[200px] md:w-auto
                p-5 md:p-6
                border border-lp-border-light dark:border-lp-border-dark
                hover:border-lp-gold dark:hover:border-lp-gold
                transition-all duration-300
                group
              "
            >
              {/* Top — label + arrow */}
              <div className="flex items-start justify-between mb-8 md:mb-12">
                <h3 className="
                  font-display text-lg md:text-xl font-normal
                  text-lp-ink dark:text-lp-mist
                  leading-tight tracking-lp-tight
                  transition-colors duration-350
                  group-hover:text-lp-gold
                ">
                  {label}
                </h3>
                <ArrowRight
                  size={14}
                  strokeWidth={1.5}
                  className="
                    text-lp-muted-light dark:text-lp-muted-dark
                    group-hover:text-lp-gold group-hover:translate-x-0.5 group-hover:-translate-y-0.5
                    transition-all duration-200
                    flex-shrink-0 mt-0.5
                  "
                />
              </div>

              {/* Bottom — sub + count */}
              <div>
                <p className="text-[11px] text-lp-muted-light dark:text-lp-muted-dark mb-1">
                  {sub}
                </p>
                <p className="text-[10px] tracking-lp-wide uppercase text-lp-gold">
                  {count}
                </p>
              </div>
            </Link>
          </motion.div>
        ))}
      </div>

      {/* ── View all — mobile only ──────────────────────────────────────── */}
      <motion.div variants={fadeUp} className="md:hidden mt-6 text-center">
        <Link
          href={ROUTES.shop}
          className="
            text-[10px] tracking-lp-wider uppercase
            text-lp-muted-light hover:text-lp-gold
            transition-colors duration-200
          "
        >
          View All Products →
        </Link>
      </motion.div>
    </motion.section>
  )
}
