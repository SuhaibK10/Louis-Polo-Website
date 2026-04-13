// ─────────────────────────────────────────────────────────────────────────────
// app/layout.tsx
// Root layout — wraps every page.
// Loads fonts, sets metadata, applies theme provider and smooth scroll.
// ─────────────────────────────────────────────────────────────────────────────

import type { Metadata } from 'next'
import { Plus_Jakarta_Sans, Inter } from 'next/font/google'
import { ThemeProvider } from 'next-themes'
import { SmoothScrollProvider } from '@/components/layout/SmoothScrollProvider'
import { SEO } from '@/lib/constants'
import '@/app/globals.css'

// ─── Fonts ────────────────────────────────────────────────────────────────────

// Display font — used for all headings
const jakarta = Plus_Jakarta_Sans({
  subsets:  ['latin'],
  weight:   ['300', '400', '500', '600'],
  variable: '--font-cormorant',  // keep same variable name — no other files need to change
  display:  'swap',
})

// UI font — used for body text, labels, buttons
const inter = Inter({
  subsets:  ['latin'],
  weight:   ['300', '400', '500', '600'],
  variable: '--font-inter',
  display:  'swap',
})

// ─── Metadata ─────────────────────────────────────────────────────────────────

export const metadata: Metadata = {
  metadataBase: new URL('https://louispolo.in'),
  title: {
    default:  SEO.title,
    // Product pages override this: "AeroSmart 3-in-1 | Louis Polo"
    template: '%s | Louis Polo',
  },
  description: SEO.description,
  keywords:    SEO.keywords,
  authors:     [{ name: 'Louis Polo' }],
  creator:     'Louis Polo',

  // Open Graph — controls how link previews look on WhatsApp, Instagram, etc.
  openGraph: {
    type:        'website',
    locale:      'en_IN',
    url:         SEO.url,
    siteName:    'Louis Polo',
    title:       SEO.title,
    description: SEO.description,
    images: [{
      url:    SEO.ogImage,
      width:  1200,
      height: 630,
      alt:    'Louis Polo — Trendsetters in Luggage',
    }],
  },

  // Twitter card
  twitter: {
    card:        'summary_large_image',
    title:       SEO.title,
    description: SEO.description,
    images:      [SEO.ogImage],
  },

  // Robots
  robots: {
    index:  true,
    follow: true,
  },

  // Favicon
  icons: {
    icon:  '/favicon.ico',
    apple: '/apple-touch-icon.png',
  },
}

// ─── Layout ───────────────────────────────────────────────────────────────────

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html
      lang="en"
      // suppressHydrationWarning prevents theme flash on load
      suppressHydrationWarning
      className={`${jakarta.variable} ${inter.variable}`}
    >
      <body className="font-sans bg-lp-light dark:bg-lp-dark text-lp-ink dark:text-lp-mist antialiased">
        <ThemeProvider
          attribute="class"
          defaultTheme="light"
          enableSystem={false}
          disableTransitionOnChange={false}
        >
          <SmoothScrollProvider>
            {children}
          </SmoothScrollProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}
