// ─────────────────────────────────────────────────────────────────────────────
// app/(store)/shop/[slug]/page.tsx
// Individual product page.
// - generateStaticParams: pre-renders all product pages at build time (fast)
// - generateMetadata: dynamic SEO per product
// - Server Component: fetches product + variants from Supabase
// ─────────────────────────────────────────────────────────────────────────────

import type { Metadata } from 'next'
import { notFound }      from 'next/navigation'
import { createClient }  from '@/lib/supabase/server'
import { ImageGallery }  from '@/components/product/ImageGallery'
import { ProductInfo }   from '@/components/product/ProductInfo'
import type { Product }  from '@/types'

interface ProductPageProps {
  params: Promise<{ slug: string }>
}

// ─── Fetch helpers ────────────────────────────────────────────────────────────

async function getProduct(slug: string): Promise<Product | null> {
  const supabase = await createClient()

  const { data, error } = await supabase
    .from('products')
    .select('*, variants(*)')
    .eq('slug', slug)
    .eq('is_active', true)
    .single()

  if (error || !data) return null
  return data as Product
}

// ─── Static params — pre-render all product pages ─────────────────────────────

export async function generateStaticParams() {
  const supabase = await createClient()

  const { data } = await supabase
    .from('products')
    .select('slug')
    .eq('is_active', true)

  return (data ?? []).map(({ slug }) => ({ slug }))
}

// ─── Dynamic metadata per product ─────────────────────────────────────────────

export async function generateMetadata(
  { params }: ProductPageProps
): Promise<Metadata> {
  const { slug } = await params
  const product  = await getProduct(slug)

  if (!product) return { title: 'Product Not Found' }

  return {
    title:       product.name,
    description: product.description,
    openGraph: {
      title:  `${product.name} | Louis Polo`,
      description: product.description,
      images: product.images[0]
        ? [{
            url: `https://res.cloudinary.com/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}/image/upload/f_auto,q_85,w_1200/${product.images[0]}`,
            width: 1200,
            height: 630,
          }]
        : [],
    },
  }
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default async function ProductPage({ params }: ProductPageProps) {
  const { slug } = await params
  const product  = await getProduct(slug)

  // 404 if product not found or inactive
  if (!product) notFound()

  return (
    <div className="md:grid md:grid-cols-2 md:min-h-[80vh]">
      {/* Left: Image gallery */}
      <ImageGallery images={product.images} name={product.name} />

      {/* Right: Product info — sticky on desktop */}
      <div className="md:sticky md:top-[65px] md:self-start">
        <ProductInfo product={product} />
      </div>
    </div>
  )
}
