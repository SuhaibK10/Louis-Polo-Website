// ─────────────────────────────────────────────────────────────────────────────
// app/api/products/route.ts
// GET /api/products
// Returns all active products with their variants.
// Supports ?category= filter and ?featured=true for carousel.
// ─────────────────────────────────────────────────────────────────────────────

import { NextResponse }     from 'next/server'
import { createAdminClient } from '@/lib/supabase/server'
import type { ApiResponse, Product, ProductCategory } from '@/types'

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const category         = searchParams.get('category') as ProductCategory | null
    const featuredOnly     = searchParams.get('featured') === 'true'

    const supabase = createAdminClient()

    let query = supabase
      .from('products')
      .select('*, variants(*)')
      .eq('is_active', true)
      .order('created_at', { ascending: false })

    if (category)     query = query.eq('category', category)
    if (featuredOnly) query = query.eq('is_featured', true)

    const { data, error } = await query

    if (error) throw error

    const response: ApiResponse<Product[]> = {
      success: true,
      data:    data as Product[],
    }

    return NextResponse.json(response)

  } catch (error) {
    console.error('[GET /api/products]', error)
    return NextResponse.json(
      { success: false, error: 'Failed to fetch products' } as ApiResponse,
      { status: 500 }
    )
  }
}
