// ─────────────────────────────────────────────────────────────────────────────
// app/api/payments/create-order/route.ts
// POST /api/payments/create-order
// 1. Validates cart items against real DB prices (prevents price tampering)
// 2. Creates a Razorpay order
// Returns razorpay_order_id needed by frontend to open payment modal
// ─────────────────────────────────────────────────────────────────────────────

import { NextResponse }        from 'next/server'
import { createAdminClient }   from '@/lib/supabase/server'
import { createRazorpayOrder } from '@/lib/razorpay'
import { CART }                from '@/lib/constants'
import type { ApiResponse, CartItem } from '@/types'

export async function POST(request: Request) {
  try {
    const body: { items: CartItem[]; phone: string } = await request.json()

    if (!body.items?.length) {
      return NextResponse.json(
        { success: false, error: 'Cart is empty' } as ApiResponse,
        { status: 400 }
      )
    }

    const supabase = createAdminClient()

    // ── Validate prices against DB ──────────────────────────────────────────
    // Fetch real prices — prevents client from manipulating price in request
    const variantIds = body.items.map((i) => i.variantId)
    const { data: dbVariants, error } = await supabase
      .from('variants')
      .select('id, price, stock')
      .in('id', variantIds)

    if (error || !dbVariants) throw new Error('Failed to validate cart')

    // Build lookup map
    const priceMap = new Map(dbVariants.map((v) => [v.id, v]))

    // Verify each item and calculate real total
    let verifiedTotal = 0
    for (const item of body.items) {
      const dbVariant = priceMap.get(item.variantId)
      if (!dbVariant) throw new Error(`Product no longer available`)
      if (dbVariant.stock < item.quantity) throw new Error(`Insufficient stock for ${item.productName}`)
      verifiedTotal += dbVariant.price * item.quantity
    }

    // Add shipping if below threshold
    const shipping = verifiedTotal >= CART.freeShippingThreshold
      ? 0
      : CART.shippingCost

    const total = verifiedTotal + shipping

    // ── Create Razorpay order ───────────────────────────────────────────────
    const receipt = `LP-${Date.now()}`
    const razorpayOrder = await createRazorpayOrder(total, receipt)

    return NextResponse.json({
      success: true,
      data: {
        razorpayOrderId: razorpayOrder.id,
        amount:          total,
        currency:        'INR',
        receipt,
      },
    } as ApiResponse)

  } catch (error) {
    const message = error instanceof Error ? error.message : 'Failed to create order'
    console.error('[POST /api/payments/create-order]', error)
    return NextResponse.json(
      { success: false, error: message } as ApiResponse,
      { status: 500 }
    )
  }
}
