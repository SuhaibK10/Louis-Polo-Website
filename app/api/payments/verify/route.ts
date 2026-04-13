// ─────────────────────────────────────────────────────────────────────────────
// app/api/payments/verify/route.ts
// POST /api/payments/verify
// Verifies Razorpay payment signature and marks order as paid in DB.
// This is a critical security step — never skip signature verification.
// ─────────────────────────────────────────────────────────────────────────────

import { NextResponse }          from 'next/server'
import { createAdminClient }     from '@/lib/supabase/server'
import { verifyRazorpaySignature } from '@/lib/razorpay'
import { sendOrderConfirmation } from '@/lib/resend'
import type { ApiResponse, RazorpayPaymentVerification } from '@/types'

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const {
      orderId,
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
      email,
    }: {
      orderId: string
      email?:  string
    } & RazorpayPaymentVerification = body

    // ── 1. Verify signature ────────────────────────────────────────────────
    // If this fails, someone tampered with the payment — reject immediately
    const isValid = verifyRazorpaySignature({
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
    })

    if (!isValid) {
      console.error('[Payment Verify] Invalid signature for order:', orderId)
      return NextResponse.json(
        { success: false, error: 'Payment verification failed' } as ApiResponse,
        { status: 400 }
      )
    }

    const supabase = createAdminClient()

    // ── 2. Update order status ─────────────────────────────────────────────
    const { data: order, error: updateError } = await supabase
      .from('orders')
      .update({
        status:               'confirmed',
        payment_status:       'paid',
        razorpay_payment_id,
      })
      .eq('id', orderId)
      .select('*, order_items(*)')
      .single()

    if (updateError) throw updateError

    // ── 3. Update stock ────────────────────────────────────────────────────
    // Decrement stock for each variant purchased
    for (const item of order.order_items ?? []) {
      await supabase.rpc('decrement_stock', {
        variant_id: item.variant_id,
        quantity:   item.quantity,
      })
    }

    // ── 4. Send confirmation email ─────────────────────────────────────────
    // Fire-and-forget — don't block the response on email sending
    if (email) {
      sendOrderConfirmation(order, email).catch((err) => {
        console.error('[Payment Verify] Email failed:', err)
      })
    }

    return NextResponse.json({
      success: true,
      data: { orderId, orderNumber: order.order_number },
    } as unknown as ApiResponse)

  } catch (error) {
    console.error('[POST /api/payments/verify]', error)
    return NextResponse.json(
      { success: false, error: 'Payment verification failed' } as ApiResponse,
      { status: 500 }
    )
  }
}
