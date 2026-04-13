// ─────────────────────────────────────────────────────────────────────────────
// components/ui/Button.tsx
// Reusable button component — all button styles go through here.
// Never style buttons inline elsewhere in the codebase.
// ─────────────────────────────────────────────────────────────────────────────

import { forwardRef } from 'react'
import { cn } from '@/lib/utils'

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'gold' | 'outline' | 'ghost'
  size?:    'sm' | 'md' | 'lg'
  loading?: boolean
  fullWidth?: boolean
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      variant   = 'gold',
      size      = 'md',
      loading   = false,
      fullWidth = false,
      className,
      children,
      disabled,
      ...props
    },
    ref
  ) => {
    return (
      <button
        ref={ref}
        disabled={disabled || loading}
        className={cn(
          // Base
          'inline-flex items-center justify-center gap-2',
          'font-sans text-[10px] tracking-lp-wider uppercase',
          'transition-all duration-200',
          'disabled:opacity-50 disabled:cursor-not-allowed',
          'active:scale-[0.98]',

          // Size
          size === 'sm' && 'px-4 py-2.5',
          size === 'md' && 'px-6 py-3.5',
          size === 'lg' && 'px-8 py-4',

          // Variant — Gold (primary)
          variant === 'gold' && [
            'bg-lp-gold text-lp-dark',
            'hover:opacity-85',
          ],

          // Variant — Outline
          variant === 'outline' && [
            'border border-lp-ink dark:border-lp-mist',
            'text-lp-ink dark:text-lp-mist bg-transparent',
            'hover:bg-lp-gold hover:text-lp-dark hover:border-lp-gold',
          ],

          // Variant — Ghost
          variant === 'ghost' && [
            'bg-transparent text-lp-muted-light dark:text-lp-muted-dark',
            'hover:text-lp-ink dark:hover:text-lp-mist',
          ],

          // Full width
          fullWidth && 'w-full',

          className
        )}
        {...props}
      >
        {/* Loading spinner */}
        {loading && (
          <svg
            className="animate-spin h-3.5 w-3.5"
            viewBox="0 0 24 24"
            fill="none"
          >
            <circle
              className="opacity-25"
              cx="12" cy="12" r="10"
              stroke="currentColor" strokeWidth="4"
            />
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
            />
          </svg>
        )}
        {children}
      </button>
    )
  }
)

Button.displayName = 'Button'
