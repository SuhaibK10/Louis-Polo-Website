'use client'

// ─────────────────────────────────────────────────────────────────────────────
// components/layout/MobileNav.tsx
// Bottom tab bar — mobile only (hidden on md+).
// Thumb-friendly navigation with active state highlighting in gold.
// ─────────────────────────────────────────────────────────────────────────────

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Home, Grid2X2, ShoppingBag, User } from 'lucide-react'
import { useCart } from '@/hooks/useCart'
import { ROUTES } from '@/lib/constants'
import { cn } from '@/lib/utils'

const NAV = [
  { label: 'Home',    href: ROUTES.home,    Icon: Home },
  { label: 'Shop',    href: ROUTES.shop,    Icon: Grid2X2 },
  { label: 'Cart',    href: ROUTES.cart,    Icon: ShoppingBag },
  { label: 'Account', href: ROUTES.account, Icon: User },
] as const

export function MobileNav() {
  const pathname    = usePathname()
  const { itemCount } = useCart()

  return (
    <nav
      className={cn(
        'md:hidden',  // hidden on desktop
        'fixed bottom-0 left-0 right-0 z-50',
        'flex items-center justify-around',
        'pt-2.5 pb-6',    // pb-6 accounts for iOS home indicator
        'border-t border-lp-border-light dark:border-lp-border-dark',
        'bg-lp-light/95 dark:bg-lp-dark/95 backdrop-blur-sm',
        'transition-colors duration-350'
      )}
    >
      {NAV.map(({ label, href, Icon }) => {
        const isActive = pathname === href
        const isCart   = label === 'Cart'

        return (
          <Link
            key={label}
            href={href}
            className={cn(
              'flex flex-col items-center gap-1 flex-1',
              'transition-colors duration-200',
              isActive
                ? 'text-lp-gold'
                : 'text-lp-muted-light dark:text-lp-muted-dark'
            )}
            aria-label={label}
          >
            {/* Icon with cart badge */}
            <div className="relative">
              <Icon size={20} strokeWidth={isActive ? 1.8 : 1.5} />

              {/* Cart badge */}
              {isCart && itemCount > 0 && (
                <span
                  className={cn(
                    'absolute -top-1.5 -right-1.5',
                    'w-3.5 h-3.5 rounded-full',
                    'bg-lp-gold text-lp-dark',
                    'text-[7px] font-bold',
                    'flex items-center justify-center'
                  )}
                >
                  {itemCount > 9 ? '9+' : itemCount}
                </span>
              )}
            </div>

            {/* Label */}
            <span className="text-[9px] tracking-[0.08em] uppercase">
              {label}
            </span>
          </Link>
        )
      })}
    </nav>
  )
}
