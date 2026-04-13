// ─────────────────────────────────────────────────────────────────────────────
// app/(store)/shop/page.tsx
// Product listing page — fetches all active products server-side.
// Supports category filtering via URL query params.
// ─────────────────────────────────────────────────────────────────────────────

import type { Metadata } from 'next'
import { createClient } from '@/lib/supabase/server'
import { ProductGrid } from '@/components/shop/ProductGrid'
import type { Product, ProductCategory } from '@/types'

export const metadata: Metadata = {
  title:       'Shop',
  description: 'Browse the complete Louis Polo collection — trolley bags, sets, backpacks and more.',
}

interface ShopPageProps {
  searchParams: Promise<{ category?: string; sort?: string }>
}

async function getProducts(category?: ProductCategory): Promise<Product[]> {
  const supabase = await createClient()

  let query = supabase
    .from('products')
    .select('*, variants(*)')
    .eq('is_active', true)
    .order('created_at', { ascending: false })

  // Filter by category if provided
  if (category) {
    query = query.eq('category', category)
  }

  const { data, error } = await query

  if (error) {
    console.error('[Shop] Failed to fetch products:', error)
    return []
  }

  return data as Product[]
}

export default async function ShopPage({ searchParams }: ShopPageProps) {
  const params   = await searchParams
  const category = params.category as ProductCategory | undefined
  const products = await getProducts(category)

  return (
    <div className="px-5 md:px-8 py-10 md:py-14">
      {/* ── Page header ──────────────────────────────────────────────────── */}
      <div className="mb-8 md:mb-12">
        <p className="lp-eyebrow mb-2">
          {category ? category.replace('-', ' ') : 'All Products'}
        </p>
        <h1 className="font-display text-3xl md:text-4xl lg:text-5xl font-normal text-lp-ink dark:text-lp-mist leading-none tracking-lp-tight transition-colors duration-350">
          {category
            ? category.charAt(0).toUpperCase() + category.slice(1).replace('-', ' ')
            : 'Our Collection'
          }
        </h1>
        <p className="text-[12px] text-lp-muted-light dark:text-lp-muted-dark mt-2">
          {products.length} {products.length === 1 ? 'product' : 'products'}
        </p>
      </div>

      {/* ── Product grid with filters ─────────────────────────────────────── */}
      <ProductGrid products={products} activeCategory={category} />
    </div>
  )
}
