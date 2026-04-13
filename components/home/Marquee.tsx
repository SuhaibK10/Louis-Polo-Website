// ─────────────────────────────────────────────────────────────────────────────
// components/home/Marquee.tsx
// Infinitely scrolling brand statement strip.
// Creates visual rhythm between sections and reinforces brand messaging.
// Server Component — pure CSS animation, no JS needed.
// ─────────────────────────────────────────────────────────────────────────────

import { MARQUEE_TEXT } from '@/lib/constants'

export function Marquee() {
  // Duplicate text to create seamless loop
  const text = `${MARQUEE_TEXT}${MARQUEE_TEXT}`

  return (
    <div
      className="
        py-2.5 overflow-hidden
        border-t border-b border-lp-border-light dark:border-lp-border-dark
        transition-colors duration-350
      "
      aria-hidden="true"  // decorative — screen readers skip this
    >
      <div
        className="
          flex whitespace-nowrap
          animate-marquee
        "
      >
        <span
          className="
            text-[9px] tracking-lp-widest uppercase
            text-lp-gold
          "
        >
          {text}
        </span>
      </div>
    </div>
  )
}
