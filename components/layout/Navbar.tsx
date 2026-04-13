'use client'

// ─────────────────────────────────────────────────────────────────────────────
// components/layout/Navbar.tsx
// Top navigation bar — sticky, minimal, premium.
// Shows: Hamburger | LP Logo | Search + Cart icons
// Desktop adds full nav links.
// ─────────────────────────────────────────────────────────────────────────────

import Image from 'next/image'
import Link from 'next/link'
import { useTheme } from 'next-themes'
import { Search, ShoppingBag, Sun, Moon, Menu } from 'lucide-react'
import { motion } from 'framer-motion'
import { useCart } from '@/hooks/useCart'
import { NAV_ITEMS, ROUTES } from '@/lib/constants'
import { cn } from '@/lib/utils'
import { useState, useEffect } from 'react'

export function Navbar() {
  const { resolvedTheme, setTheme } = useTheme()
  const { itemCount, openCart }     = useCart()
  const [mounted, setMounted]       = useState(false)

  useEffect(() => { setMounted(true) }, [])

  const isDark = resolvedTheme === 'dark'

  return (
    <motion.header
      className={cn(
        'sticky top-0 z-50',
        'border-b border-lp-border-light dark:border-lp-border-dark',
        'bg-lp-light/95 dark:bg-lp-dark/95',
        // Backdrop blur — frosted glass effect on scroll
        'backdrop-blur-sm',
        'transition-colors duration-350'
      )}
      // Subtle slide-down on page load
      initial={{ y: -10, opacity: 0 }}
      animate={{ y: 0,   opacity: 1 }}
      transition={{ duration: 0.4, ease: [0.25, 0.1, 0.25, 1] }}
    >
      <div className="flex items-center justify-between px-5 py-2.5 md:px-8 md:py-3">

        {/* ── Left: Hamburger (mobile) / Nav links (desktop) ── */}
        <div className="flex items-center gap-6">
          {/* Hamburger — mobile only */}
          <button
            className="md:hidden text-lp-ink dark:text-lp-mist"
            aria-label="Open menu"
          >
            <Menu size={20} strokeWidth={1.5} />
          </button>

          {/* Nav links — desktop only */}
          <nav className="hidden md:flex items-center gap-8">
            {NAV_ITEMS.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  'text-[10px] tracking-lp-wider uppercase',
                  'text-lp-muted-light dark:text-lp-muted-dark',
                  'hover:text-lp-gold transition-colors duration-200'
                )}
              >
                {item.label}
              </Link>
            ))}
          </nav>
        </div>

        {/* ── Centre: Logo ── */}
        <Link
          href={ROUTES.home}
          className="absolute left-1/2 -translate-x-1/2"
          aria-label="Louis Polo — Home"
        >
          <Image
  src="/logo.png"
  alt="Louis Polo"
  width={100}
  height={44}
  priority
  suppressHydrationWarning
  className="h-10 w-auto object-contain transition-all duration-350 dark:invert"
/>
        </Link>

        {/* ── Right: Search + Cart + Theme Toggle ── */}
        <div className="flex items-center gap-4">

          {/* Search */}
          <Link
            href={`${ROUTES.shop}?search=true`}
            className="text-lp-ink dark:text-lp-mist hover:text-lp-gold dark:hover:text-lp-gold transition-colors duration-200"
            aria-label="Search products"
          >
            <Search size={18} strokeWidth={1.5} />
          </Link>

          {/* Cart with badge */}
          <button
            onClick={openCart}
            className="relative text-lp-ink dark:text-lp-mist hover:text-lp-gold dark:hover:text-lp-gold transition-colors duration-200"
            aria-label={`Cart — ${itemCount} items`}
          >
            <ShoppingBag size={18} strokeWidth={1.5} />

            {/* Badge — only shows when cart has items */}
            {itemCount > 0 && (
              <motion.span
                className={cn(
                  'absolute -top-1.5 -right-1.5',
                  'w-4 h-4 rounded-full',
                  'bg-lp-gold text-lp-dark',
                  'text-[8px] font-semibold',
                  'flex items-center justify-center'
                )}
                // Pop-in animation when item added
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: 'spring', stiffness: 500, damping: 25 }}
              >
                {itemCount > 9 ? '9+' : itemCount}
              </motion.span>
            )}
          </button>

          {/* Theme toggle — sun/moon */}
      {/* Theme toggle — only render after mount to avoid hydration mismatch */}
{mounted && (
  <button
    onClick={() => setTheme(isDark ? 'light' : 'dark')}
    className="text-lp-ink dark:text-lp-mist hover:text-lp-gold dark:hover:text-lp-gold transition-colors duration-200"
    aria-label="Toggle theme"
  >
    <motion.div
      key={resolvedTheme}
      initial={{ rotate: -30, opacity: 0 }}
      animate={{ rotate: 0,   opacity: 1 }}
      transition={{ duration: 0.3 }}
    >
      {isDark
        ? <Sun  size={16} strokeWidth={1.5} />
        : <Moon size={16} strokeWidth={1.5} />
      }
    </motion.div>
  </button>
)}

        </div>
      </div>
    </motion.header>
  )
}
