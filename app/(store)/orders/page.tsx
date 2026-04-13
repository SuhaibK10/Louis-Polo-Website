'use client'

// ─────────────────────────────────────────────────────────────────────────────
// app/(store)/orders/page.tsx
// Order history page — shows all past orders for logged-in user.
// ─────────────────────────────────────────────────────────────────────────────

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { Package } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { createClient } from '@/lib/supabase/client'
import { formatPrice, formatDate } from '@/lib/utils'
import { ROUTES } from '@/lib/constants'
import { fadeUp, staggerChildren } from '@/lib/animations'
import type { Order } from '@/types'

// Order status badge colours
const STATUS_STYLES: Record<string, string> = {
  pending:   'bg-amber-50 text-amber-700 dark:bg-amber-900/20 dark:text-amber-400',
  confirmed: 'bg-blue-50 text-blue-700 dark:bg-blue-900/20 dark:text-blue-400',
  shipped:   'bg-purple-50 text-purple-700 dark:bg-purple-900/20 dark:text-purple-400',
  delivered: 'bg-green-50 text-green-700 dark:bg-green-900/20 dark:text-green-400',
  cancelled: 'bg-red-50 text-red-700 dark:bg-red-900/20 dark:text-red-400',
}

export default function OrdersPage() {
  const [orders, setOrders]   = useState<Order[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchOrders() {
      const supabase = createClient()

      const { data: { user } } = await supabase.auth.getUser()
      if (!user) { setLoading(false); return }

      const { data } = await supabase
        .from('orders')
        .select('*, order_items(*)')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })

      setOrders((data ?? []) as Order[])
      setLoading(false)
    }

    fetchOrders()
  }, [])

  if (loading) {
    return (
      <div className="px-5 py-14 space-y-4">
        {[1, 2, 3].map((i) => (
          <div key={i} className="h-24 bg-lp-surface-light dark:bg-lp-surface-dark animate-pulse" />
        ))}
      </div>
    )
  }

  if (orders.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] px-5 text-center">
        <Package size={48} strokeWidth={1} className="text-lp-muted-light dark:text-lp-muted-dark mb-4" />
        <h1 className="font-display text-2xl text-lp-ink dark:text-lp-mist mb-2 transition-colors duration-350">
          No orders yet
        </h1>
        <p className="text-[13px] text-lp-muted-light dark:text-lp-muted-dark mb-8">
          Your order history will appear here
        </p>
        <Link href={ROUTES.shop}>
          <Button variant="gold" size="md">Start Shopping</Button>
        </Link>
      </div>
    )
  }

  return (
    <motion.div
      className="px-5 md:px-8 py-10 md:py-14"
      variants={staggerChildren}
      initial="hidden"
      animate="visible"
    >
      <motion.div variants={fadeUp} className="mb-8">
        <p className="lp-eyebrow mb-2">History</p>
        <h1 className="font-display text-3xl font-normal text-lp-ink dark:text-lp-mist leading-none tracking-lp-tight transition-colors duration-350">
          Your Orders
        </h1>
      </motion.div>

      <motion.div variants={fadeUp} className="space-y-3">
        {orders.map((order) => (
          <Link
            key={order.id}
            href={`${ROUTES.orders}/${order.id}`}
            className="
              block border border-lp-border-light dark:border-lp-border-dark
              p-4 md:p-5
              hover:border-lp-gold dark:hover:border-lp-gold
              transition-all duration-200
            "
          >
            <div className="flex items-start justify-between gap-3 mb-3">
              <div>
                <p className="text-[11px] tracking-lp-wide uppercase text-lp-ink dark:text-lp-mist font-medium transition-colors duration-350">
                  {order.orderNumber}
                </p>
                <p className="text-[11px] text-lp-muted-light dark:text-lp-muted-dark mt-0.5">
                  {formatDate(order.createdAt)}
                </p>
              </div>

              <div className="flex flex-col items-end gap-1.5">
                <span className={`
                  text-[9px] tracking-lp-wide uppercase px-2 py-1
                  ${STATUS_STYLES[order.status] ?? ''}
                `}>
                  {order.status}
                </span>
                <span className="font-display text-lg text-lp-ink dark:text-lp-mist transition-colors duration-350">
                  {formatPrice(order.total)}
                </span>
              </div>
            </div>

            <p className="text-[11px] text-lp-muted-light dark:text-lp-muted-dark">
              {order.items?.length ?? 0} {(order.items?.length ?? 0) === 1 ? 'item' : 'items'}
              {order.items?.[0] && ` · ${order.items[0].productName}${(order.items?.length ?? 0) > 1 ? ' and more' : ''}`}
            </p>
          </Link>
        ))}
      </motion.div>
    </motion.div>
  )
}
