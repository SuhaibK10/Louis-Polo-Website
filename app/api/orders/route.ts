// ─────────────────────────────────────────────────────────────────────────────
// app/api/orders/route.ts
// POST /api/orders
// 1. Validates cart items against real variant prices in DB
// 2. Creates order record in Supabase
// 3. Creates Razorpay order
// Returns orderId + razorpayOrderId to frontend
// ─────────────────────────────────────────────────────────────────────────────

import { NextResponse }      from 'next/server'
import { createAdminClient } from '@/lib/supabase/server'
import { createRazorpayOrder } from '@/lib/razorpay'
import { generateOrderNumber }  from '@/lib/utils'
import { CART }              from '@/lib/constants'
import type { ApiResponse, CartItem, Address } from '@/types'

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { items, address, total }: {
      items:   CartItem[]
      address: Address
      total:   number
    } = body

    if (!items?.length) {
      return NextResponse.json(
        { success: false, error: 'Cart is empty' } as ApiResponse,
        { status: 400 }
      )
    }

    const supabase = createAdminClient()

    // ── 1. Validate prices against DB ──────────────────────────────────────
    // Never trust client-side prices — always fetch from DB
    const variantIds = items.map((i) => i.variantId)
    const { data: dbVariants, error: variantError } = await supabase
      .from('variants')
      .select('id, price, stock')
      .in('id', variantIds)

    if (variantError) throw variantError

    // Verify stock and calculate server-side total
    let serverTotal = 0
    for (const item of items) {
      const dbVariant = dbVariants?.find((v) => v.id === item.variantId)
      if (!dbVariant) throw new Error(`Product variant not found: ${item.variantId}`)
      if (dbVariant.stock < item.quantity) throw new Error(`Insufficient stock for ${item.productName}`)
      serverTotal += dbVariant.price * item.quantity
    }

    // Add shipping
    const shipping = serverTotal >= CART.freeShippingThreshold ? 0 : CART.shippingCost
    serverTotal += shipping

    // ── 2. Generate order number ───────────────────────────────────────────
    // Count existing orders to generate sequential number
    const { count } = await supabase
      .from('orders')
      .select('*', { count: 'exact', head: true })

    const orderNumber = generateOrderNumber((count ?? 0) + 1)

    // ── 3. Create Razorpay order ───────────────────────────────────────────
    const razorpayOrder = await createRazorpayOrder(serverTotal, orderNumber)

    // ── 4. Create order in Supabase ───────────────────────────────────────
    const { data: order, error: orderError } = await supabase
      .from('orders')
      .insert({
        order_number:      orderNumber,
        phone:             address.phone,
        address:           address,
        status:            'pending',
        payment_status:    'pending',
        total:             serverTotal,
        razorpay_order_id: razorpayOrder.id,
      })
      .select()
      .single()

    if (orderError) throw orderError

    // ── 5. Create order items ─────────────────────────────────────────────
    const orderItems = items.map((item) => ({
      order_id:     order.id,
      variant_id:   item.variantId,
      product_name: item.productName,
      color:        item.color,
      size:         item.size,
      price:        item.price,
      quantity:     item.quantity,
      image:        item.image,
    }))

    const { error: itemsError } = await supabase
      .from('order_items')
      .insert(orderItems)

    if (itemsError) throw itemsError

    return NextResponse.json({
      success: true,
      data: {
        orderId:         order.id,
        orderNumber,
        razorpayOrderId: razorpayOrder.id,
      },
    } as unknown as ApiResponse)

  } catch (error) {
    console.error('[POST /api/orders]', error)
    const message = error instanceof Error ? error.message : 'Failed to create order'
    return NextResponse.json(
      { success: false, error: message } as ApiResponse,
      { status: 500 }
    )
  }
}
