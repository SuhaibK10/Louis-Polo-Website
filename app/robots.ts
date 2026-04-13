// ─────────────────────────────────────────────────────────────────────────────
// app/robots.ts
// Controls which pages search engines can crawl.
// ─────────────────────────────────────────────────────────────────────────────

import type { MetadataRoute } from 'next'
import { SEO } from '@/lib/constants'

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: '*',
        allow:     '/',
        // Don't index checkout, account, or order pages
        disallow:  ['/checkout', '/account', '/orders/', '/api/'],
      },
    ],
    sitemap: `${SEO.url}/sitemap.xml`,
  }
}
