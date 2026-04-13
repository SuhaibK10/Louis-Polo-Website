// ─────────────────────────────────────────────────────────────────────────────
// components/layout/Footer.tsx
// Site footer — brand info, links, contact, copyright.
// Server Component — no client-side interactivity needed.
// ─────────────────────────────────────────────────────────────────────────────

import Link from 'next/link'
import Image from 'next/image'
import { Instagram, Linkedin, MessageCircle } from 'lucide-react'
import { BRAND, ROUTES } from '@/lib/constants'

const FOOTER_LINKS = {
  Shop: [
    { label: 'All Products',   href: ROUTES.shop },
    { label: 'Trolley Bags',   href: `${ROUTES.shop}?category=trolley` },
    { label: 'Sets',           href: `${ROUTES.shop}?category=set` },
    { label: 'Backpacks',      href: `${ROUTES.shop}?category=backpack` },
    { label: 'Office Bags',    href: `${ROUTES.shop}?category=office-bag` },
  ],
  Company: [
    { label: 'About Us',       href: ROUTES.about },
    { label: 'Track Order',    href: ROUTES.orders },
    { label: 'Contact',        href: '/contact' },
  ],
  Support: [
    { label: 'Privacy Policy', href: '/privacy' },
    { label: 'Refund Policy',  href: '/refund-policy' },
    { label: 'Terms of Use',   href: '/terms' },
  ],
} as const

export function Footer() {
  return (
    <footer className="border-t border-lp-border-light dark:border-lp-border-dark mt-20 pb-24 md:pb-8">
      <div className="px-5 md:px-8 pt-12">

        {/* ── Top section ── */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-12 pb-10 border-b border-lp-border-light dark:border-lp-border-dark">

          {/* Brand column */}
          <div className="col-span-2 md:col-span-1">
            <Image
              src="/logo.png"
              alt="Louis Polo"
              width={80}
              height={36}
              className="h-9 w-auto object-contain dark:invert mb-4"
            />
            <p className="text-[11px] text-lp-muted-light dark:text-lp-muted-dark leading-relaxed mb-4">
              Premium hard luggage, designed for every journey.
              9 years of manufacturing excellence.
            </p>

            {/* Social links */}
            <div className="flex gap-3">
              <a
                href={BRAND.instagram}
                target="_blank"
                rel="noopener noreferrer"
                className="text-lp-muted-light dark:text-lp-muted-dark hover:text-lp-gold transition-colors duration-200"
                aria-label="Instagram"
              >
                <Instagram size={16} strokeWidth={1.5} />
              </a>
              <a
                href={BRAND.linkedin}
                target="_blank"
                rel="noopener noreferrer"
                className="text-lp-muted-light dark:text-lp-muted-dark hover:text-lp-gold transition-colors duration-200"
                aria-label="LinkedIn"
              >
                <Linkedin size={16} strokeWidth={1.5} />
              </a>
              <a
                href={BRAND.whatsapp}
                target="_blank"
                rel="noopener noreferrer"
                className="text-lp-muted-light dark:text-lp-muted-dark hover:text-lp-gold transition-colors duration-200"
                aria-label="WhatsApp"
              >
                <MessageCircle size={16} strokeWidth={1.5} />
              </a>
            </div>
          </div>

          {/* Link columns */}
          {Object.entries(FOOTER_LINKS).map(([category, links]) => (
            <div key={category}>
              <h4 className="lp-eyebrow mb-4">{category}</h4>
              <ul className="space-y-2.5">
                {links.map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className="text-[12px] text-lp-muted-light dark:text-lp-muted-dark hover:text-lp-gold transition-colors duration-200"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* ── Bottom: copyright + contact ── */}
        <div className="pt-6 flex flex-col md:flex-row md:items-center md:justify-between gap-2">
          <p className="text-[11px] text-lp-muted-light dark:text-lp-muted-dark">
            © {new Date().getFullYear()} {BRAND.address.company}. All rights reserved.
          </p>
          <p className="text-[11px] text-lp-muted-light dark:text-lp-muted-dark">
            {BRAND.email} · {BRAND.phone}
          </p>
        </div>

      </div>
    </footer>
  )
}
