// ─────────────────────────────────────────────────────────────────────────────
// components/ui/Skeleton.tsx
// Loading placeholder — shown while data is fetching.
// Much better UX than a blank screen or spinner.
// ─────────────────────────────────────────────────────────────────────────────

import { cn } from '@/lib/utils'

interface SkeletonProps {
  className?: string
}

export function Skeleton({ className }: SkeletonProps) {
  return (
    <div
      className={cn(
        'animate-pulse rounded',
        'bg-lp-surface-light dark:bg-lp-surface-dark',
        className
      )}
    />
  )
}

// ─── Product Card Skeleton ────────────────────────────────────────────────────

export function ProductCardSkeleton() {
  return (
    <div className="flex gap-3">
      {/* Image */}
      <Skeleton className="w-[120px] flex-shrink-0 aspect-[3/4]" />

      {/* Info */}
      <div className="flex-1 pt-1 space-y-2">
        <Skeleton className="h-4 w-3/4" />
        <Skeleton className="h-3 w-1/2" />
        <div className="flex gap-1.5 pt-1">
          {[1, 2, 3].map((i) => (
            <Skeleton key={i} className="w-3 h-3 rounded-full" />
          ))}
        </div>
        <div className="flex items-center justify-between pt-2">
          <Skeleton className="h-4 w-16" />
          <Skeleton className="w-8 h-8" />
        </div>
      </div>
    </div>
  )
}
