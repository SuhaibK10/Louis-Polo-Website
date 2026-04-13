// ─────────────────────────────────────────────────────────────────────────────
// app/sitemap.ts
// Auto-generated sitemap — submitted to Google for indexing.
// Includes all static pages + dynamically fetched product pages.
// ─────────────────────────────────────────────────────────────────────────────

import type { MetadataRoute } from 'next'
import { createClient }       from '@/lib/supabase/server'
import { SEO }                from '@/lib/constants'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const supabase = await createClient()

  // Fetch all active product slugs
  const { data: products } = await supabase
    .from('products')
    .select('slug, updated_at')
    .eq('is_active', true)

  const productUrls = (products ?? []).map(({ slug, updated_at }) => ({
    url:          `${SEO.url}/shop/${slug}`,
    lastModified: new Date(updated_at),
    changeFrequency: 'weekly' as const,
    priority:     0.8,
  }))

  return [
    {
      url:             SEO.url,
      lastModified:    new Date(),
      changeFrequency: 'daily',
      priority:        1,
    },
    {
      url:             `${SEO.url}/shop`,
      lastModified:    new Date(),
      changeFrequency: 'daily',
      priority:        0.9,
    },
    {
      url:             `${SEO.url}/about`,
      lastModified:    new Date(),
      changeFrequency: 'monthly',
      priority:        0.5,
    },
    ...productUrls,
  ]
}
