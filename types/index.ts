// ─────────────────────────────────────────────────────────────────────────────
// types/index.ts
// Single source of truth for ALL TypeScript types in the Louis Polo app.
// Every piece of data has a type. No 'any' anywhere.
// ─────────────────────────────────────────────────────────────────────────────

// ─── Enums ───────────────────────────────────────────────────────────────────

export type ProductCategory =
  | 'trolley'
  | 'set'
  | 'backpack'
  | 'office-bag'
  | 'kids'
  | 'vanity'
  | 'duffle'

export type ProductSize = '20"' | '24"' | '28"' | 'Set of 3' | 'One Size'

export type OrderStatus =
  | 'pending'
  | 'confirmed'
  | 'shipped'
  | 'delivered'
  | 'cancelled'

export type PaymentStatus = 'pending' | 'paid' | 'failed' | 'refunded'

// ─── Product ──────────────────────────────────────────────────────────────────

export interface ProductFeature {
  // Icon name from lucide-react (e.g. 'RotateCw', 'Lock', 'Weight')
  icon: string
  label: string
}

export interface Product {
  id: string
  name: string
  slug: string
  description: string
  category: ProductCategory
  images: string[]           // Cloudinary URLs
  features: ProductFeature[] // e.g. 360° spinner wheels, TSA lock
  isActive: boolean
  isFeatured: boolean        // shows in Best Sellers carousel
  tag: string | null         // 'Best Seller' | 'New Arrival' | 'Exclusive' | null
  createdAt: string
  variants?: Variant[]       // populated via join
}

// ─── Variant ─────────────────────────────────────────────────────────────────

export interface Variant {
  id: string
  productId: string
  color: string              // e.g. 'Blue', 'Rosegold', 'Carbon Fiber'
  colorHex: string           // e.g. '#1E88E5' — for color swatch UI
  size: ProductSize | null   // null for bags with no size
  price: number              // in INR — NOT paise
  stock: number
  sku: string                // GS1 GTIN/EAN code
  weight_kg: number          // net weight in kg (from GS1 data)
}

// ─── Cart ─────────────────────────────────────────────────────────────────────

export interface CartItem {
  variantId: string
  productId: string
  productName: string
  productSlug: string
  image: string              // first image from product.images
  color: string
  colorHex: string
  size: ProductSize | null
  price: number
  quantity: number
}

// ─── User ─────────────────────────────────────────────────────────────────────

export interface User {
  id: string
  phone: string              // Indian format: +91XXXXXXXXXX
  name: string | null
  createdAt: string
  addresses?: Address[]
}

// ─── Address ──────────────────────────────────────────────────────────────────

export interface Address {
  id: string
  userId: string
  name: string               // recipient name
  phone: string              // recipient phone
  line1: string
  line2: string | null
  city: string
  state: string
  pincode: string            // 6-digit Indian pincode
  isDefault: boolean
}

// ─── Order ────────────────────────────────────────────────────────────────────

export interface Order {
  id: string
  orderNumber: string        // e.g. 'LP-2025-0001'
  userId: string | null      // null for guest orders
  phone: string              // always present — used for guest tracking
  address: Address           // snapshot at time of order (denormalised)
  status: OrderStatus
  paymentStatus: PaymentStatus
  total: number              // in INR
  razorpayOrderId: string | null
  razorpayPaymentId: string | null
  items: OrderItem[]
  createdAt: string
}

export interface OrderItem {
  id: string
  orderId: string
  variantId: string
  // Snapshot fields — preserved even if product is deleted later
  productName: string
  color: string
  size: ProductSize | null
  price: number
  quantity: number
  image: string
}

// ─── Razorpay ─────────────────────────────────────────────────────────────────

// What we send to Razorpay to create an order
export interface RazorpayOrderRequest {
  amount: number             // in PAISE (multiply INR by 100)
  currency: 'INR'
  receipt: string            // our order number
  notes?: Record<string, string>
}

// What Razorpay returns after payment — used for verification
export interface RazorpayPaymentVerification {
  razorpay_order_id: string
  razorpay_payment_id: string
  razorpay_signature: string
}

// ─── API Responses ────────────────────────────────────────────────────────────

// Consistent shape for every API route response
export interface ApiResponse<T = null> {
  success: boolean
  data?: T
  error?: string
}

// ─── UI ───────────────────────────────────────────────────────────────────────

export type Theme = 'light' | 'dark'

export interface NavItem {
  label: string
  href: string
}

export interface CategoryChip {
  label: string
  value: ProductCategory | 'all'
}
