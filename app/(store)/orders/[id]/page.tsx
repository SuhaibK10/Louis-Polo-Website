// ─────────────────────────────────────────────────────────────────────────────
// app/(store)/orders/[id]/page.tsx
// Order tracking / confirmation page.
// Shows: status timeline, items, address, total.
// Accessible without login — anyone with the order ID can view.
// ─────────────────────────────────────────────────────────────────────────────

import type { Metadata }  from 'next'
import { notFound }       from 'next/navigation'
import { createClient }   from '@/lib/supabase/server'
import { OrderStatus }    from '@/components/orders/OrderStatus'
import { formatPrice, formatDate } from '@/lib/utils'

export const metadata: Metadata = { title: 'Order Tracking' }

interface OrderPageProps {
  params: Promise<{ id: string }>
}

async function getOrder(id: string) {
  const supabase = await createClient()

  const { data, error } = await supabase
    .from('orders')
    .select('*, order_items(*)')
    .eq('id', id)
    .single()

  if (error || !data) return null
  return data
}

export default async function OrderPage({ params }: OrderPageProps) {
  const { id } = await params
  const order  = await getOrder(id)

  if (!order) notFound()

  const STATUS_STEPS = ['pending', 'confirmed', 'shipped', 'delivered']
  const currentStep  = STATUS_STEPS.indexOf(order.status)

  return (
    <div className="px-5 md:px-8 py-10 md:py-14 max-w-2xl mx-auto">

      {/* ── Header ─────────────────────────────────────────────────────────── */}
      <div className="mb-8">
        <p className="lp-eyebrow mb-2">Order Tracking</p>
        <h1 className="font-display text-3xl font-normal text-lp-ink dark:text-lp-mist leading-none tracking-lp-tight mb-1 transition-colors duration-350">
          {order.order_number}
        </h1>
        <p className="text-[12px] text-lp-muted-light dark:text-lp-muted-dark">
          Placed on {formatDate(order.created_at)}
        </p>
      </div>

      {/* ── Status Timeline ───────────────────────────────────────────────── */}
      <OrderStatus status={order.status} />

      {/* ── Items ─────────────────────────────────────────────────────────── */}
      <div className="mt-8 mb-8">
        <p className="text-[10px] tracking-lp-wider uppercase text-lp-muted-light dark:text-lp-muted-dark mb-4">
          Items Ordered
        </p>
        <div className="divide-y divide-lp-border-light dark:divide-lp-border-dark transition-colors duration-350">
          {order.order_items?.map((item: any) => (
            <div key={item.id} className="flex justify-between items-start py-3.5">
              <div>
                <p className="text-[14px] font-medium text-lp-ink dark:text-lp-mist transition-colors duration-350">
                  {item.product_name}
                </p>
                <p className="text-[11px] text-lp-muted-light dark:text-lp-muted-dark mt-0.5">
                  {item.color}{item.size ? ` · ${item.size}` : ''} · Qty {item.quantity}
                </p>
              </div>
              <span className="text-[14px] text-lp-ink dark:text-lp-mist transition-colors duration-350">
                {formatPrice(item.price * item.quantity)}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* ── Price summary ──────────────────────────────────────────────────── */}
      <div className="
        border border-lp-border-light dark:border-lp-border-dark
        p-4 space-y-2 mb-8
        transition-colors duration-350
      ">
        <div className="flex justify-between text-[12px]">
          <span className="text-lp-muted-light dark:text-lp-muted-dark">Subtotal</span>
          <span className="text-lp-ink dark:text-lp-mist">{formatPrice(order.total)}</span>
        </div>
        <div className="flex justify-between font-medium border-t border-lp-border-light dark:border-lp-border-dark pt-2">
          <span className="text-[11px] tracking-lp-wide uppercase text-lp-ink dark:text-lp-mist">Total Paid</span>
          <span className="font-display text-lg text-lp-ink dark:text-lp-mist">{formatPrice(order.total)}</span>
        </div>
      </div>

      {/* ── Delivery address ──────────────────────────────────────────────── */}
      {order.address && (
        <div>
          <p className="text-[10px] tracking-lp-wider uppercase text-lp-muted-light dark:text-lp-muted-dark mb-3">
            Delivering To
          </p>
          <div className="text-[13px] text-lp-muted-light dark:text-lp-muted-dark leading-relaxed">
            <p className="text-lp-ink dark:text-lp-mist font-medium mb-0.5 transition-colors duration-350">
              {order.address.name}
            </p>
            <p>{order.address.line1}</p>
            {order.address.line2 && <p>{order.address.line2}</p>}
            <p>{order.address.city}, {order.address.state} — {order.address.pincode}</p>
            <p className="mt-1">{order.address.phone}</p>
          </div>
        </div>
      )}
    </div>
  )
}
