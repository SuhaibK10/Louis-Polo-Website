'use client'

// ─────────────────────────────────────────────────────────────────────────────
// components/home/BrandStory.tsx
// The brand credibility section — 9 years, OEM expertise, manufacturing.
// This is Louis Polo's biggest differentiator vs competitors: they actually
// make luggage, not just sell it.
//
// Layout: Full-width editorial — text left, stats right on desktop.
// Slide-in animation from opposite sides on scroll entry.
// ─────────────────────────────────────────────────────────────────────────────

import { motion } from 'framer-motion'
import { BRAND }  from '@/lib/constants'
import {
  slideFromLeft,
  slideFromRight,
  fadeUp,
  staggerChildren,
  VIEWPORT_CONFIG,
} from '@/lib/animations'

const STATS = [
  { value: '9+',    label: 'Years of Manufacturing' },
  { value: '50+',   label: 'Products Designed' },
  { value: 'OEM',   label: 'Custom Manufacturing' },
  { value: 'GS1',   label: 'Certified Products' },
] as const

export function BrandStory() {
  return (
    <section className="py-16 md:py-24 border-t border-lp-border-light dark:border-lp-border-dark transition-colors duration-350">
      <div className="px-5 md:px-8">

        {/* ── Main grid ──────────────────────────────────────────────────── */}
        <div className="grid md:grid-cols-2 gap-12 md:gap-16 lg:gap-24 items-center">

          {/* ── Left: Story text ─────────────────────────────────────────── */}
          <motion.div
            variants={slideFromLeft}
            initial="hidden"
            whileInView="visible"
            viewport={VIEWPORT_CONFIG}
          >
            <p className="lp-eyebrow mb-4">Our Story</p>

            <h2 className="
              font-display text-4xl md:text-5xl lg:text-6xl
              font-normal leading-[0.95] tracking-lp-tight
              text-lp-ink dark:text-lp-mist
              mb-6 transition-colors duration-350
            ">
              9 Years.
              <br />
              <span className="italic">One Craft.</span>
            </h2>

            {/* Gold divider */}
            <div className="w-10 h-px bg-lp-gold mb-6" />

            <p className="
              text-[13px] leading-relaxed
              text-lp-muted-light dark:text-lp-muted-dark
              mb-4
            ">
              {BRAND.address.company} has spent nearly a decade perfecting the
              art of luggage manufacturing. We don't just sell travel bags — we
              design and build them from the ground up.
            </p>

            <p className="
              text-[13px] leading-relaxed
              text-lp-muted-light dark:text-lp-muted-dark
              mb-8
            ">
              With full OEM and ODM capabilities, our factory partners with
              brands worldwide to produce premium luggage to exact specifications.
              Louis Polo is the culmination of that expertise — brought directly
              to the traveller.
            </p>

            {/* OEM capabilities */}
            <div className="space-y-3">
              {[
                'Custom design and manufacturing',
                'Fast sample delivery — 2 to 3 days',
                'GS1 certified product catalogue',
                'Pan-India distribution',
              ].map((point) => (
                <div key={point} className="flex items-center gap-3">
                  <div className="w-1 h-1 rounded-full bg-lp-gold flex-shrink-0" />
                  <span className="text-[12px] text-lp-muted-light dark:text-lp-muted-dark">
                    {point}
                  </span>
                </div>
              ))}
            </div>
          </motion.div>

          {/* ── Right: Stats grid ─────────────────────────────────────────── */}
          <motion.div
            variants={slideFromRight}
            initial="hidden"
            whileInView="visible"
            viewport={VIEWPORT_CONFIG}
          >
            <div className="grid grid-cols-2 gap-px bg-lp-border-light dark:bg-lp-border-dark transition-colors duration-350">
              {STATS.map(({ value, label }) => (
                <div
                  key={label}
                  className="
                    flex flex-col justify-between
                    p-6 md:p-8
                    bg-lp-light dark:bg-lp-dark
                    transition-colors duration-350
                  "
                >
                  <span className="
                    font-display text-5xl md:text-6xl font-normal
                    text-lp-gold leading-none
                    mb-4
                  ">
                    {value}
                  </span>
                  <span className="
                    text-[10px] tracking-lp-wider uppercase
                    text-lp-muted-light dark:text-lp-muted-dark
                  ">
                    {label}
                  </span>
                </div>
              ))}
            </div>

            {/* Quote */}
            <div className="mt-6 pl-4 border-l-2 border-lp-gold">
              <p className="
                font-display text-lg italic font-normal
                text-lp-ink dark:text-lp-mist
                leading-snug mb-2
                transition-colors duration-350
              ">
                "Quality, Style, Durability."
              </p>
              <p className="text-[10px] tracking-lp-wider uppercase text-lp-gold">
                — Louis Polo
              </p>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
