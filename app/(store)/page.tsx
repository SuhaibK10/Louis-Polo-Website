// ─────────────────────────────────────────────────────────────────────────────
// app/(store)/page.tsx
// Homepage — assembles all sections in order.
// Server Component — fetches featured products for carousel.
// ─────────────────────────────────────────────────────────────────────────────

import type { Metadata } from 'next'
import { createClient }        from '@/lib/supabase/server'
import { Hero }                from '@/components/home/Hero'
import { Marquee }             from '@/components/home/Marquee'
import { BestSellersCarousel } from '@/components/home/BestSellersCarousel'
import { CategoryGrid }        from '@/components/home/CategoryGrid'
import { BrandStory }          from '@/components/home/BrandStory'
import { SEO }                 from '@/lib/constants'
import type { Product }        from '@/types'

export const metadata: Metadata = {
  title:       SEO.title,
  description: SEO.description,
}

// Fetch featured products for the carousel
async function getFeaturedProducts(): Promise<Product[]> {
  const supabase = await createClient()

  const { data, error } = await supabase
    .from('products')
    .select('*, variants(*)')
    .eq('is_active', true)
    .eq('is_featured', true)
    .limit(5)

  if (error) {
    console.error('[Homepage] Failed to fetch featured products:', error)
    return []
  }

  return data as Product[]
}

export default async function HomePage() {
  const featuredProducts = await getFeaturedProducts()

  return (
    <>
      <Hero />
      <Marquee />
      <BestSellersCarousel products={featuredProducts} />
      <CategoryGrid />
      <BrandStory />
    </>
  )
}
