'use client'

// ─────────────────────────────────────────────────────────────────────────────
// components/home/Hero.tsx
// Full-screen hero — the first thing visitors see.
// Psychological impact: large serif type, confident whitespace, single CTA.
// LP watermark in background creates depth without distraction.
// ─────────────────────────────────────────────────────────────────────────────

import Link from 'next/link'
import { motion } from 'framer-motion'
import { ArrowRight } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { ROUTES, BRAND } from '@/lib/constants'
import {
  fadeUp,
  fadeIn,
  expandLine,
  staggerChildren,
  VIEWPORT_CONFIG,
} from '@/lib/animations'

export function Hero() {
  return (
    <section
      className="
        relative min-h-[92vh] md:min-h-[88vh]
        flex flex-col justify-center
        px-5 md:px-16 lg:px-24
        pt-12 pb-16
        overflow-hidden
      "
    >
      {/* ── Background LP watermark ─────────────────────────────────────── */}
      {/* Large, barely-visible — creates editorial depth */}
      <motion.div
        className="
          absolute right-[-5vw] top-1/2 -translate-y-1/2
          font-display font-bold
          text-[28vw] md:text-[22vw]
          leading-none tracking-tighter
          text-lp-ink/[0.035] dark:text-lp-mist/[0.035]
          pointer-events-none select-none
          transition-colors duration-350
        "
        variants={fadeIn}
        initial="hidden"
        animate="visible"
        transition={{ delay: 0.6 }}
      >
        LP
      </motion.div>

      {/* ── Gold accent line — top left ─────────────────────────────────── */}
      <motion.div
        className="absolute top-0 left-5 md:left-16 lg:left-24 w-px h-16 bg-lp-gold"
        initial={{ scaleY: 0, originY: 0 }}
        animate={{ scaleY: 1 }}
        transition={{ duration: 0.8, delay: 0.2, ease: [0.25, 0.1, 0.25, 1] }}
      />

      {/* ── Main content ─────────────────────────────────────────────────── */}
      <motion.div
        className="relative z-10 max-w-xl"
        variants={staggerChildren}
        initial="hidden"
        animate="visible"
      >
        {/* Eyebrow */}
        <motion.p
          className="lp-eyebrow mb-5"
          variants={fadeUp}
        >
          New Collection · 2025
        </motion.p>

        {/* Main title — each line animates separately */}
        <div className="overflow-hidden mb-5">
          <motion.h1
            className="
              font-display font-normal
              text-[14vw] xs:text-[13vw] sm:text-[11vw] md:text-[9vw] lg:text-[8rem]
              leading-[0.9] tracking-lp-tight
              text-lp-ink dark:text-lp-mist
              transition-colors duration-350
            "
            variants={{
              hidden:  { opacity: 0, y: 60 },
              visible: {
                opacity: 1,
                y: 0,
                transition: {
                  duration: 0.8,
                  ease: [0.25, 0.1, 0.25, 1],
                },
              },
            }}
          >
            Louis
            <br />
            <span className="italic">Polo</span>
          </motion.h1>
        </div>

        {/* Gold divider line */}
        <motion.div
          className="w-10 h-px bg-lp-gold mb-5"
          variants={expandLine}
        />

        {/* Subheading */}
        <motion.p
          className="
            text-[11px] tracking-lp-wider uppercase
            text-lp-muted-light dark:text-lp-muted-dark
            mb-8 transition-colors duration-350
          "
          variants={fadeUp}
        >
          {BRAND.tagline}
        </motion.p>

        {/* CTAs */}
        <motion.div
          className="flex flex-col xs:flex-row gap-3"
          variants={fadeUp}
        >
          <Link href={ROUTES.shop}>
            <Button variant="gold" size="md" className="w-full xs:w-auto">
              Shop Collection
              <ArrowRight size={13} strokeWidth={2} />
            </Button>
          </Link>

          <Link href={ROUTES.about}>
            <Button variant="outline" size="md" className="w-full xs:w-auto">
              Our Story
            </Button>
          </Link>
        </motion.div>
      </motion.div>

      {/* ── Bottom stats bar ─────────────────────────────────────────────── */}
      <motion.div
        className="
          absolute bottom-8 left-5 right-5
          md:left-16 md:right-16 lg:left-24 lg:right-24
          flex items-center gap-6 md:gap-10
          border-t border-lp-border-light dark:border-lp-border-dark
          pt-5
        "
        variants={fadeUp}
        initial="hidden"
        animate="visible"
        transition={{ delay: 0.9 }}
      >
        {[
          { value: '9+',    label: 'Years of Craft' },
          { value: '50+',   label: 'Products' },
          { value: 'OEM',   label: 'Expertise' },
          { value: 'India', label: 'Made In' },
        ].map(({ value, label }) => (
          <div key={label} className="flex flex-col gap-0.5">
            <span className="font-display text-lg font-normal text-lp-gold leading-none">
              {value}
            </span>
            <span className="text-[9px] tracking-lp-wide uppercase text-lp-muted-light dark:text-lp-muted-dark">
              {label}
            </span>
          </div>
        ))}
      </motion.div>
    </section>
  )
}
