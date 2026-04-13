// ─────────────────────────────────────────────────────────────────────────────
// lib/cloudinary.ts
// Cloudinary configuration and image URL helpers.
//
// Why URL-based transforms?
// Instead of uploading multiple sizes, we upload once and transform via URL.
// Example: one upload → mobile, tablet, desktop sizes all from same source.
// ─────────────────────────────────────────────────────────────────────────────

import { v2 as cloudinary } from 'cloudinary'

// Configure once — used in API routes and scripts
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME!,
  api_key:    process.env.CLOUDINARY_API_KEY!,
  api_secret: process.env.CLOUDINARY_API_SECRET!,
})

export default cloudinary

// ─── Image URL Helpers ────────────────────────────────────────────────────────

const CLOUD = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME

// Base URL builder — all transforms go through here
function buildUrl(publicId: string, transforms: string): string {
  return `https://res.cloudinary.com/${CLOUD}/image/upload/${transforms}/${publicId}`
}

// Product card thumbnail — 400×533 (3:4 ratio), auto WebP, 80% quality
export function productCardUrl(publicId: string): string {
  return buildUrl(publicId, 'f_auto,q_80,w_400,h_533,c_fill')
}

// Product detail hero — 800×1066, auto WebP, 85% quality
export function productHeroUrl(publicId: string): string {
  return buildUrl(publicId, 'f_auto,q_85,w_800,h_1066,c_fill')
}

// Carousel card — 600×800, auto WebP
export function carouselUrl(publicId: string): string {
  return buildUrl(publicId, 'f_auto,q_85,w_600,h_800,c_fill')
}

// Mobile thumbnail — 300×400, auto WebP, 75% quality (bandwidth saving)
export function mobileThumbnailUrl(publicId: string): string {
  return buildUrl(publicId, 'f_auto,q_75,w_300,h_400,c_fill')
}

// Square thumbnail for cart/order items — 200×200
export function squareThumbnailUrl(publicId: string): string {
  return buildUrl(publicId, 'f_auto,q_80,w_200,h_200,c_fill')
}

// ─── Upload Helper ────────────────────────────────────────────────────────────

// Upload a product image from a URL (used in migration script)
// Returns the Cloudinary public_id to store in Supabase
export async function uploadProductImage(
  imageUrl: string,
  productSlug: string,
  index: number
): Promise<string> {
  const result = await cloudinary.uploader.upload(imageUrl, {
    folder:    `louispolo/products/${productSlug}`,
    public_id: `${productSlug}-${index}`,
    overwrite: true,
    // Auto-optimize on upload
    quality:   'auto',
    fetch_format: 'auto',
  })

  return result.public_id
}
