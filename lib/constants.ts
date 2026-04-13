// ─────────────────────────────────────────────────────────────────────────────
// lib/constants.ts
// Every magic string, number, or brand value lives here.
// Never hardcode these values anywhere else in the codebase.
// ─────────────────────────────────────────────────────────────────────────────

import type { NavItem, CategoryChip } from '@/types'

// ─── Brand ───────────────────────────────────────────────────────────────────

export const BRAND = {
  name:       'Louis Polo',
  tagline:    'Trendsetters in Luggage',
  taglineSub: 'Travel with Tomorrow\'s Style',
  email:      'support@louispolo.in',
  phone:      '+91-89287 89287',
  whatsapp:   'https://wa.me/918928789287',
  instagram:  'https://instagram.com/louispololuggage',
  linkedin:   'https://linkedin.com/company/louis-polo',
  address: {
    company: 'LOUISPOLO FASHION INDIA PRIVATE LIMITED',
    country: 'India',
  },
  gst: {
    igst: 18,
    sgst: 9,
    cgst: 9,
  },
} as const

// ─── Routes ──────────────────────────────────────────────────────────────────

export const ROUTES = {
  home:     '/',
  shop:     '/shop',
  cart:     '/cart',
  checkout: '/checkout',
  orders:   '/orders',
  account:  '/account',
  about:    '/about',
  login:    '/login',
  verify:   '/verify',
} as const

// ─── Navigation ──────────────────────────────────────────────────────────────

export const NAV_ITEMS: NavItem[] = [
  { label: 'Shop',    href: ROUTES.shop },
  { label: 'About',   href: ROUTES.about },
]

// Bottom navigation — mobile only
export const BOTTOM_NAV_ITEMS = [
  { label: 'Home',    href: ROUTES.home,    icon: 'Home' },
  { label: 'Shop',    href: ROUTES.shop,    icon: 'Grid2X2' },
  { label: 'Search',  href: ROUTES.shop,    icon: 'Search' },
  { label: 'Cart',    href: ROUTES.cart,    icon: 'ShoppingBag' },
  { label: 'Account', href: ROUTES.account, icon: 'User' },
] as const

// ─── Categories ───────────────────────────────────────────────────────────────

export const CATEGORIES: CategoryChip[] = [
  { label: 'All',        value: 'all' },
  { label: 'Trolley',    value: 'trolley' },
  { label: 'Sets',       value: 'set' },
  { label: 'Backpacks',  value: 'backpack' },
  { label: 'Office Bags',value: 'office-bag' },
  { label: 'Vanity',     value: 'vanity' },
]

// ─── Product config ───────────────────────────────────────────────────────────

// Used to display product sizes in a consistent order
export const SIZE_ORDER = ['20"', '24"', '28"', 'Set of 3', 'One Size'] as const

// Max images allowed per product
export const MAX_PRODUCT_IMAGES = 6

// ─── Cart config ─────────────────────────────────────────────────────────────

export const CART = {
  maxQuantityPerItem: 10,
  // Free shipping above this amount (INR)
  freeShippingThreshold: 5000,
  shippingCost: 199,
} as const

// ─── Auth config ─────────────────────────────────────────────────────────────

export const AUTH = {
  // OTP expires in 5 minutes (seconds)
  otpExpiry: 300,
  // Phone number format for display
  phonePrefix: '+91',
} as const

// ─── Payments ─────────────────────────────────────────────────────────────────

export const PAYMENT = {
  currency: 'INR',
  // Razorpay requires amount in paise — always multiply INR by this
  paiseMultiplier: 100,
} as const

// ─── SEO ──────────────────────────────────────────────────────────────────────

export const SEO = {
  title:       'Louis Polo — Trendsetters in Luggage',
  description: 'Premium hard luggage designed for every journey. Discover AeroSmart, SkyTrail, VeeZoom and more from Louis Polo — India\'s trendsetter in travel bags.',
  keywords:    'louis polo, luggage, trolley bags, hard shell suitcase, travel bags, india',
  ogImage:     '/og-image.jpg',
  url:         'https://louispolo.in',
} as const

// ─── Marquee text ─────────────────────────────────────────────────────────────

// Repeats to create seamless infinite scroll effect
export const MARQUEE_TEXT =
  'Trendsetters in Luggage \u00B7 Premium Hard Luggage \u00B7 9 Years of Craft \u00B7 OEM Expertise \u00B7 Made with Precision \u00B7 '
