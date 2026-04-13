// ─────────────────────────────────────────────────────────────────────────────
// lib/animations.ts
// All Framer Motion animation variants in one place.
// Import from here — never define variants inline in components.
//
// Usage:
//   import { fadeUp, staggerChildren } from '@/lib/animations'
//   <motion.div variants={fadeUp} initial="hidden" whileInView="visible">
// ─────────────────────────────────────────────────────────────────────────────

import type { Variants } from 'framer-motion'

// The premium easing curve — same as CSS cubic-bezier(0.25, 0.1, 0.25, 1)
const LP_EASE = [0.25, 0.1, 0.25, 1] as const

// ─── Base Variants ────────────────────────────────────────────────────────────

// Element fades up from below — most commonly used
export const fadeUp: Variants = {
  hidden:  { opacity: 0, y: 28 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: LP_EASE },
  },
}

// Element fades in without movement — for backgrounds, overlays
export const fadeIn: Variants = {
  hidden:  { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { duration: 0.5, ease: 'easeOut' },
  },
}

// Element slides in from right — for hero text, section headings
export const slideFromRight: Variants = {
  hidden:  { opacity: 0, x: 30 },
  visible: {
    opacity: 1,
    x: 0,
    transition: { duration: 0.5, ease: LP_EASE },
  },
}

// Element slides in from left
export const slideFromLeft: Variants = {
  hidden:  { opacity: 0, x: -30 },
  visible: {
    opacity: 1,
    x: 0,
    transition: { duration: 0.5, ease: LP_EASE },
  },
}

// Scale up slightly — for cards, images
export const scaleUp: Variants = {
  hidden:  { opacity: 0, scale: 0.95 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: { duration: 0.5, ease: LP_EASE },
  },
}

// ─── Stagger Container ────────────────────────────────────────────────────────

// Wrap a list of elements with this to stagger their animations
// Children must have their own variant (e.g. fadeUp)
export const staggerChildren: Variants = {
  hidden:  {},
  visible: {
    transition: {
      // Each child animates 120ms after the previous
      staggerChildren: 0.12,
    },
  },
}

// Faster stagger — for product grids
export const staggerFast: Variants = {
  hidden:  {},
  visible: {
    transition: {
      staggerChildren: 0.08,
    },
  },
}

// ─── Special Variants ─────────────────────────────────────────────────────────

// Hero title — each word reveals individually
export const heroWord: Variants = {
  hidden:  { opacity: 0, y: 40, rotateX: -10 },
  visible: {
    opacity: 1,
    y: 0,
    rotateX: 0,
    transition: { duration: 0.7, ease: LP_EASE },
  },
}

// Gold line expands from left — used under hero title
export const expandLine: Variants = {
  hidden:  { scaleX: 0, originX: 0 },
  visible: {
    scaleX: 1,
    transition: { duration: 0.6, delay: 0.2, ease: LP_EASE },
  },
}

// Carousel card entering — subtle scale + fade
export const carouselCard: Variants = {
  hidden:  { opacity: 0.7, scale: 0.97 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: { duration: 0.5, ease: LP_EASE },
  },
}

// ─── Viewport Config ──────────────────────────────────────────────────────────

// Standard viewport config for whileInView triggers
// once: true — animates only on first entry, not on scroll back
export const VIEWPORT_CONFIG = {
  once:   true,
  margin: '-80px',  // triggers slightly before element enters viewport
} as const
