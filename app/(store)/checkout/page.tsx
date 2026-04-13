'use client'

// ─────────────────────────────────────────────────────────────────────────────
// app/(store)/checkout/page.tsx
// Single-page checkout: address form + order summary + Razorpay payment.
// Redirects to login if user not authenticated.
// ─────────────────────────────────────────────────────────────────────────────

import { useState, useEffect } from 'react'
import { useRouter }           from 'next/navigation'
import { motion }              from 'framer-motion'
import { Button }              from '@/components/ui/Button'
import { useCart }             from '@/hooks/useCart'
import { createClient }        from '@/lib/supabase/client'
import { formatPrice }         from '@/lib/utils'
import { ROUTES }              from '@/lib/constants'
import { fadeUp, staggerChildren } from '@/lib/animations'
import type { Address }        from '@/types'

interface FormData {
  name:    string
  phone:   string
  email:   string
  line1:   string
  line2:   string
  city:    string
  state:   string
  pincode: string
}

const INITIAL_FORM: FormData = {
  name: '', phone: '', email: '',
  line1: '', line2: '', city: '', state: '', pincode: '',
}

export default function CheckoutPage() {
  const router             = useRouter()
  const { items, total, subtotal, shipping, isEmpty, clearCart } = useCart()
  const [form, setForm]    = useState<FormData>(INITIAL_FORM)
  const [loading, setLoading] = useState(false)
  const [error, setError]  = useState<string | null>(null)

  // Redirect if cart is empty
  useEffect(() => {
    if (isEmpty) router.replace(ROUTES.shop)
  }, [isEmpty, router])

  function handleChange(e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) {
    const { name, value } = e.target
    setForm((prev) => ({ ...prev, [name]: value }))
  }

  // ─── Razorpay Payment ───────────────────────────────────────────────────────

  async function handlePlaceOrder(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setError(null)

    try {
      // 1. Create order in our backend
      const orderRes = await fetch('/api/orders', {
        method:  'POST',
        headers: { 'Content-Type': 'application/json' },
        body:    JSON.stringify({ items, address: form, total }),
      })

      const orderData = await orderRes.json()
      if (!orderData.success) throw new Error(orderData.error)

      const { orderId, orderNumber, razorpayOrderId } = orderData.data

      // 2. Open Razorpay modal
      const razorpay = new (window as any).Razorpay({
        key:         process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
        amount:      total * 100,  // paise
        currency:    'INR',
        name:        'Louis Polo',
        description: `Order ${orderNumber}`,
        order_id:    razorpayOrderId,
        prefill: {
          name:    form.name,
          email:   form.email,
          contact: form.phone,
        },
        theme: { color: '#C9A96E' },

        handler: async (response: any) => {
          // 3. Verify payment on backend
          const verifyRes = await fetch('/api/payments/verify', {
            method:  'POST',
            headers: { 'Content-Type': 'application/json' },
            body:    JSON.stringify({
              orderId,
              razorpay_order_id:   response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature:  response.razorpay_signature,
            }),
          })

          const verifyData = await verifyRes.json()
          if (!verifyData.success) throw new Error('Payment verification failed')

          // 4. Clear cart and redirect to order confirmation
          clearCart()
          router.push(`${ROUTES.orders}/${orderId}`)
        },

        modal: {
          ondismiss: () => setLoading(false),
        },
      })

      razorpay.open()

    } catch (err) {
      const msg = err instanceof Error ? err.message : 'Something went wrong'
      setError(msg)
      setLoading(false)
    }
  }

  if (isEmpty) return null

  return (
    <>
      {/* Razorpay SDK */}
      <script src="https://checkout.razorpay.com/v1/checkout.js" async />

      <div className="px-5 md:px-8 py-10 md:py-14 max-w-5xl mx-auto">
        <motion.div
          variants={staggerChildren}
          initial="hidden"
          animate="visible"
        >
          {/* Header */}
          <motion.div variants={fadeUp} className="mb-8">
            <p className="lp-eyebrow mb-1">Checkout</p>
            <h1 className="font-display text-3xl font-normal text-lp-ink dark:text-lp-mist leading-none tracking-lp-tight transition-colors duration-350">
              Complete Your Order
            </h1>
          </motion.div>

          <div className="grid md:grid-cols-[1fr_360px] gap-8 md:gap-12">

            {/* ── Left: Address form ───────────────────────────────────── */}
            <motion.form
              variants={fadeUp}
              onSubmit={handlePlaceOrder}
              className="space-y-5"
              id="checkout-form"
            >
              <div>
                <p className="text-[10px] tracking-lp-wider uppercase text-lp-muted-light dark:text-lp-muted-dark mb-4">
                  Delivery Address
                </p>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {/* Full name */}
                  <div className="sm:col-span-2">
                    <CheckoutInput
                      label="Full Name"
                      name="name"
                      value={form.name}
                      onChange={handleChange}
                      required
                    />
                  </div>

                  {/* Phone */}
                  <CheckoutInput
                    label="Phone Number"
                    name="phone"
                    type="tel"
                    value={form.phone}
                    onChange={handleChange}
                    placeholder="+91 XXXXX XXXXX"
                    required
                  />

                  {/* Email */}
                  <CheckoutInput
                    label="Email (for confirmation)"
                    name="email"
                    type="email"
                    value={form.email}
                    onChange={handleChange}
                    placeholder="Optional"
                  />

                  {/* Address line 1 */}
                  <div className="sm:col-span-2">
                    <CheckoutInput
                      label="Address Line 1"
                      name="line1"
                      value={form.line1}
                      onChange={handleChange}
                      placeholder="House/Flat No, Street, Area"
                      required
                    />
                  </div>

                  {/* Address line 2 */}
                  <div className="sm:col-span-2">
                    <CheckoutInput
                      label="Address Line 2"
                      name="line2"
                      value={form.line2}
                      onChange={handleChange}
                      placeholder="Landmark (Optional)"
                    />
                  </div>

                  {/* City */}
                  <CheckoutInput
                    label="City"
                    name="city"
                    value={form.city}
                    onChange={handleChange}
                    required
                  />

                  {/* State */}
                  <CheckoutInput
                    label="State"
                    name="state"
                    value={form.state}
                    onChange={handleChange}
                    required
                  />

                  {/* Pincode */}
                  <CheckoutInput
                    label="Pincode"
                    name="pincode"
                    type="tel"
                    inputMode="numeric"
                    value={form.pincode}
                    onChange={handleChange}
                    maxLength={6}
                    pattern="\d{6}"
                    placeholder="6-digit pincode"
                    required
                  />
                </div>
              </div>

              {/* Error message */}
              {error && (
                <p className="text-[12px] text-lp-error">{error}</p>
              )}
            </motion.form>

            {/* ── Right: Order summary ─────────────────────────────────── */}
            <motion.div variants={fadeUp}>
              <p className="text-[10px] tracking-lp-wider uppercase text-lp-muted-light dark:text-lp-muted-dark mb-4">
                Order Summary
              </p>

              {/* Items */}
              <div className="space-y-3 mb-5">
                {items.map((item) => (
                  <div key={item.variantId} className="flex gap-3 items-start">
                    <div className="
                      w-14 flex-shrink-0 aspect-[3/4]
                      bg-lp-surface-light dark:bg-lp-surface-dark
                      transition-colors duration-350
                    " />
                    <div className="flex-1 min-w-0">
                      <p className="text-[13px] font-medium text-lp-ink dark:text-lp-mist truncate transition-colors duration-350">
                        {item.productName}
                      </p>
                      <p className="text-[11px] text-lp-muted-light dark:text-lp-muted-dark">
                        {item.color}{item.size ? ` · ${item.size}` : ''} · Qty {item.quantity}
                      </p>
                    </div>
                    <span className="text-[13px] text-lp-ink dark:text-lp-mist flex-shrink-0 transition-colors duration-350">
                      {formatPrice(item.price * item.quantity)}
                    </span>
                  </div>
                ))}
              </div>

              <div className="border-t border-lp-border-light dark:border-lp-border-dark pt-4 space-y-2.5">
                <div className="flex justify-between text-[12px]">
                  <span className="text-lp-muted-light dark:text-lp-muted-dark">Subtotal</span>
                  <span className="text-lp-ink dark:text-lp-mist">{formatPrice(subtotal)}</span>
                </div>
                <div className="flex justify-between text-[12px]">
                  <span className="text-lp-muted-light dark:text-lp-muted-dark">Shipping</span>
                  <span className={shipping === 0 ? 'text-lp-success' : 'text-lp-ink dark:text-lp-mist'}>
                    {shipping === 0 ? 'Free' : formatPrice(shipping)}
                  </span>
                </div>
                <div className="flex justify-between border-t border-lp-border-light dark:border-lp-border-dark pt-2.5">
                  <span className="text-[11px] tracking-lp-wide uppercase text-lp-ink dark:text-lp-mist">Total</span>
                  <span className="font-display text-xl text-lp-ink dark:text-lp-mist">{formatPrice(total)}</span>
                </div>
              </div>

              {/* Place order button */}
              <Button
                type="submit"
                form="checkout-form"
                variant="gold"
                size="md"
                fullWidth
                loading={loading}
                className="mt-5"
              >
                Pay {formatPrice(total)}
              </Button>

              <p className="text-[10px] text-center text-lp-muted-light dark:text-lp-muted-dark mt-3">
                Secure payment powered by Razorpay
              </p>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </>
  )
}

// ─── Reusable checkout input ──────────────────────────────────────────────────

interface CheckoutInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string
  name:  string
}

function CheckoutInput({ label, ...props }: CheckoutInputProps) {
  return (
    <div>
      <label className="block text-[10px] tracking-lp-wider uppercase text-lp-muted-light dark:text-lp-muted-dark mb-1.5">
        {label}
      </label>
      <input
        {...props}
        className="
          w-full px-3.5 py-3
          border border-lp-border-light dark:border-lp-border-dark
          focus:border-lp-gold outline-none
          bg-transparent
          text-[14px] text-lp-ink dark:text-lp-mist
          placeholder:text-lp-muted-light dark:placeholder:text-lp-muted-dark
          transition-all duration-200
        "
      />
    </div>
  )
}
