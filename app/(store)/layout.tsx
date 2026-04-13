// ─────────────────────────────────────────────────────────────────────────────
// app/(store)/layout.tsx
// Wraps all store pages (homepage, shop, product, cart, checkout, etc.)
// with the shared navigation shell.
// ─────────────────────────────────────────────────────────────────────────────

import { Navbar }      from '@/components/layout/Navbar'
import { Footer }      from '@/components/layout/Footer'
import { MobileNav }   from '@/components/layout/MobileNav'
import { CartDrawer }  from '@/components/cart/CartDrawer'

export default function StoreLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <>
      <Navbar />

      {/* Main content — padding-bottom on mobile for bottom nav */}
      <main className="min-h-screen pb-20 md:pb-0">
        {children}
      </main>

      <Footer />

      {/* Bottom tab bar — mobile only */}
      <MobileNav />

      {/* Cart slide-in drawer — available on every store page */}
      <CartDrawer />
    </>
  )
}
