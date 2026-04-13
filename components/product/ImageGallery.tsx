'use client'

// ─────────────────────────────────────────────────────────────────────────────
// components/product/ImageGallery.tsx
// Product image gallery with:
// - Main large image
// - Thumbnail strip below
// - Swipe gesture on mobile
// - Smooth transition between images
// ─────────────────────────────────────────────────────────────────────────────

import { useState }       from 'react'
import Image              from 'next/image'
import { motion, AnimatePresence } from 'framer-motion'
import { ChevronLeft, ChevronRight } from 'lucide-react'

interface ImageGalleryProps {
  images: string[]
  name:   string
}

const CLOUD = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME

function buildUrl(publicId: string, transforms: string) {
  return `https://res.cloudinary.com/${CLOUD}/image/upload/${transforms}/${publicId}`
}

export function ImageGallery({ images, name }: ImageGalleryProps) {
  const [active, setActive]       = useState(0)
  const [direction, setDirection] = useState<'left' | 'right'>('left')

  // Touch tracking
  const [touchStart, setTouchStart] = useState(0)

  const total = images.length

  function goTo(index: number, dir: 'left' | 'right') {
    setDirection(dir)
    setActive((index + total) % total)
  }

  function handleTouchStart(e: React.TouchEvent) {
    setTouchStart(e.targetTouches[0].clientX)
  }

  function handleTouchEnd(e: React.TouchEvent) {
    const delta = touchStart - e.changedTouches[0].clientX
    if (Math.abs(delta) > 50) {
      delta > 0
        ? goTo(active + 1, 'left')
        : goTo(active - 1, 'right')
    }
  }

  const slideVariants = {
    enter: (dir: 'left' | 'right') => ({
      x: dir === 'left' ? 30 : -30, opacity: 0,
    }),
    center: {
      x: 0, opacity: 1,
      transition: { duration: 0.4, ease: [0.25, 0.1, 0.25, 1] },
    },
    exit: (dir: 'left' | 'right') => ({
      x: dir === 'left' ? -30 : 30, opacity: 0,
      transition: { duration: 0.3 },
    }),
  }

  return (
    <div className="flex flex-col">
      {/* ── Main image ─────────────────────────────────────────────────── */}
      <div
        className="
          relative aspect-square md:aspect-[4/5]
          bg-lp-surface-light dark:bg-lp-surface-dark
          overflow-hidden cursor-grab active:cursor-grabbing
          transition-colors duration-350
        "
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
      >
        <AnimatePresence custom={direction} mode="wait">
          {images.length > 0 ? (
            <motion.div
              key={active}
              custom={direction}
              variants={slideVariants}
              initial="enter"
              animate="center"
              exit="exit"
              className="absolute inset-0"
            >
              <Image
                src={buildUrl(images[active], 'f_auto,q_90,w_900,h_1125,c_fill')}
                alt={`${name} — Image ${active + 1}`}
                fill
                className="object-cover"
                sizes="(max-width: 768px) 100vw, 50vw"
                priority={active === 0}
              />
            </motion.div>
          ) : (
            // Placeholder
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="font-display text-8xl text-lp-gold/20 select-none">LP</span>
            </div>
          )}
        </AnimatePresence>

        {/* Navigation arrows — only if multiple images */}
        {total > 1 && (
          <>
            <button
              onClick={() => goTo(active - 1, 'right')}
              className="
                absolute left-3 top-1/2 -translate-y-1/2
                w-8 h-8 flex items-center justify-center
                bg-lp-light/80 dark:bg-lp-dark/80
                text-lp-ink dark:text-lp-mist
                hover:bg-lp-gold hover:text-lp-dark
                transition-all duration-200 backdrop-blur-sm
              "
              aria-label="Previous image"
            >
              <ChevronLeft size={16} strokeWidth={1.5} />
            </button>

            <button
              onClick={() => goTo(active + 1, 'left')}
              className="
                absolute right-3 top-1/2 -translate-y-1/2
                w-8 h-8 flex items-center justify-center
                bg-lp-light/80 dark:bg-lp-dark/80
                text-lp-ink dark:text-lp-mist
                hover:bg-lp-gold hover:text-lp-dark
                transition-all duration-200 backdrop-blur-sm
              "
              aria-label="Next image"
            >
              <ChevronRight size={16} strokeWidth={1.5} />
            </button>

            {/* Image counter */}
            <div className="
              absolute bottom-3 right-3
              text-[10px] tracking-lp-wide
              bg-lp-light/80 dark:bg-lp-dark/80
              text-lp-ink dark:text-lp-mist
              px-2 py-1 backdrop-blur-sm
            ">
              {active + 1} / {total}
            </div>
          </>
        )}
      </div>

      {/* ── Thumbnail strip ─────────────────────────────────────────────── */}
      {total > 1 && (
        <div className="flex gap-1.5 p-3 overflow-x-auto scrollbar-hide">
          {images.map((img, i) => (
            <button
              key={i}
              onClick={() => goTo(i, i > active ? 'left' : 'right')}
              className={`
                relative flex-shrink-0 w-14 h-14 overflow-hidden
                transition-all duration-200
                ${i === active
                  ? 'ring-1 ring-lp-gold'
                  : 'opacity-50 hover:opacity-80'
                }
              `}
              aria-label={`View image ${i + 1}`}
            >
              <Image
                src={buildUrl(img, 'f_auto,q_70,w_120,h_120,c_fill')}
                alt={`${name} thumbnail ${i + 1}`}
                fill
                className="object-cover"
                sizes="56px"
              />
            </button>
          ))}
        </div>
      )}
    </div>
  )
}
