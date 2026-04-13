// ─────────────────────────────────────────────────────────────────────────────
// app/not-found.tsx
// Custom 404 page — shown when a product slug or order ID doesn't exist.
// ─────────────────────────────────────────────────────────────────────────────

import Link from 'next/link'
import { ROUTES } from '@/lib/constants'

export default function NotFound() {
  return (
    <div className="
      min-h-screen flex flex-col items-center justify-center
      px-5 text-center
      bg-lp-light dark:bg-lp-dark
      transition-colors duration-350
    ">
      <p className="font-display text-[120px] md:text-[180px] font-normal text-lp-gold/20 leading-none select-none">
        404
      </p>
      <h1 className="font-display text-3xl font-normal text-lp-ink dark:text-lp-mist -mt-6 mb-3 transition-colors duration-350">
        Page Not Found
      </h1>
      <p className="text-[13px] text-lp-muted-light dark:text-lp-muted-dark mb-8">
        The page you're looking for has moved or doesn't exist.
      </p>
      <Link
        href={ROUTES.home}
        className="
          text-[10px] tracking-lp-wider uppercase
          bg-lp-gold text-lp-dark
          px-6 py-3.5
          hover:opacity-85 transition-opacity
        "
      >
        Back to Home
      </Link>
    </div>
  )
}
