// ─────────────────────────────────────────────────────────────────────────────
// lib/razorpay.ts
// Razorpay client configuration and payment helpers.
// Only used in API routes — never in client components.
// ─────────────────────────────────────────────────────────────────────────────

import Razorpay from 'razorpay'
import crypto from 'crypto'
import { toPaise } from './utils'
import type { RazorpayOrderRequest, RazorpayPaymentVerification } from '@/types'

// Initialize Razorpay instance — singleton
const razorpay = new Razorpay({
  key_id:     process.env.RAZORPAY_KEY_ID!,
  key_secret: process.env.RAZORPAY_KEY_SECRET!,
})

// ─── Create Order ─────────────────────────────────────────────────────────────

// Create a Razorpay order before payment
// Returns the order ID needed by the frontend to open the payment modal
export async function createRazorpayOrder(
  amountInr: number,
  orderNumber: string
) {
  const payload: RazorpayOrderRequest = {
    // Razorpay requires paise — multiply INR by 100
    amount:   toPaise(amountInr),
    currency: 'INR',
    receipt:  orderNumber,
    notes: {
      brand:        'Louis Polo',
      orderNumber,
    },
  }

  const order = await razorpay.orders.create(payload)
  return order
}

// ─── Verify Payment ───────────────────────────────────────────────────────────

// Verify that the payment signature from Razorpay is authentic
// This MUST be done server-side — never skip this step
// Returns true if signature is valid, false if tampered
export function verifyRazorpaySignature(
  verification: RazorpayPaymentVerification
): boolean {
  const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = verification

  // Create the expected signature using HMAC SHA256
  const body = `${razorpay_order_id}|${razorpay_payment_id}`
  const expectedSignature = crypto
    .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET!)
    .update(body)
    .digest('hex')

  return expectedSignature === razorpay_signature
}

export default razorpay
