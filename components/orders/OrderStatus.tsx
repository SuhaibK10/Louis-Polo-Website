'use client'

// ─────────────────────────────────────────────────────────────────────────────
// components/orders/OrderStatus.tsx
// Visual status timeline — shows order progress with gold highlighting.
// ─────────────────────────────────────────────────────────────────────────────

import { motion } from 'framer-motion'
import { Check }  from 'lucide-react'
import type { OrderStatus as OrderStatusType } from '@/types'

interface OrderStatusProps {
  status: OrderStatusType
}

const STEPS: { key: OrderStatusType; label: string; sub: string }[] = [
  { key: 'pending',   label: 'Order Placed',     sub: 'We received your order' },
  { key: 'confirmed', label: 'Confirmed',         sub: 'Payment verified' },
  { key: 'shipped',   label: 'Shipped',           sub: 'On its way to you' },
  { key: 'delivered', label: 'Delivered',         sub: 'Enjoy your Louis Polo' },
]

const STATUS_INDEX: Record<OrderStatusType, number> = {
  pending:   0,
  confirmed: 1,
  shipped:   2,
  delivered: 3,
  cancelled: -1,
}

export function OrderStatus({ status }: OrderStatusProps) {
  const currentIndex = STATUS_INDEX[status]

  if (status === 'cancelled') {
    return (
      <div className="py-4 px-4 border border-lp-error/30 bg-lp-error/5 text-center">
        <p className="text-[11px] tracking-lp-wider uppercase text-lp-error">
          Order Cancelled
        </p>
      </div>
    )
  }

  return (
    <div className="py-6">
      <div className="flex items-start gap-0">
        {STEPS.map((step, index) => {
          const isCompleted = index < currentIndex
          const isCurrent   = index === currentIndex
          const isPending   = index > currentIndex

          return (
            <div key={step.key} className="flex-1 flex flex-col items-center">
              {/* Step indicator + connector line */}
              <div className="flex items-center w-full">
                {/* Left line */}
                {index > 0 && (
                  <div
                    className="flex-1 h-px transition-colors duration-500"
                    style={{
                      backgroundColor: isCompleted || isCurrent
                        ? '#C9A96E'
                        : '#E8E8E4',
                    }}
                  />
                )}

                {/* Circle */}
                <motion.div
                  className={`
                    w-7 h-7 rounded-full flex-shrink-0
                    flex items-center justify-center
                    border-2 transition-all duration-500
                    ${isCompleted
                      ? 'bg-lp-gold border-lp-gold'
                      : isCurrent
                        ? 'bg-transparent border-lp-gold'
                        : 'bg-transparent border-lp-border-light dark:border-lp-border-dark'
                    }
                  `}
                  initial={{ scale: 0.8 }}
                  animate={{ scale: isCurrent ? 1.1 : 1 }}
                  transition={{ duration: 0.4 }}
                >
                  {isCompleted ? (
                    <Check size={12} strokeWidth={2.5} className="text-lp-dark" />
                  ) : isCurrent ? (
                    <motion.div
                      className="w-2 h-2 rounded-full bg-lp-gold"
                      animate={{ scale: [1, 1.3, 1] }}
                      transition={{ repeat: Infinity, duration: 2 }}
                    />
                  ) : null}
                </motion.div>

                {/* Right line */}
                {index < STEPS.length - 1 && (
                  <div
                    className="flex-1 h-px transition-colors duration-500"
                    style={{
                      backgroundColor: isCompleted
                        ? '#C9A96E'
                        : '#E8E8E4',
                    }}
                  />
                )}
              </div>

              {/* Label */}
              <div className="mt-2.5 text-center px-1">
                <p className={`
                  text-[10px] tracking-lp-wide uppercase font-medium transition-colors duration-350
                  ${isCurrent || isCompleted
                    ? 'text-lp-gold'
                    : 'text-lp-muted-light dark:text-lp-muted-dark'
                  }
                `}>
                  {step.label}
                </p>
                <p className="text-[9px] text-lp-muted-light dark:text-lp-muted-dark mt-0.5 hidden sm:block">
                  {step.sub}
                </p>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
