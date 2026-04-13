'use client'

// ─────────────────────────────────────────────────────────────────────────────
// components/layout/SmoothScrollProvider.tsx
// Wraps the app with Lenis smooth scroll.
// This is what gives the site that premium, genoshi.io-style scroll feel.
//
// Lenis intercepts mouse wheel + touch events and replaces the browser's
// default scroll with a momentum-based smooth version.
// ─────────────────────────────────────────────────────────────────────────────

import { useEffect } from 'react'
import Lenis from 'lenis'

export function SmoothScrollProvider({
  children,
}: {
  children: React.ReactNode
}) {
  useEffect(() => {
    const lenis = new Lenis({
      // Higher = more floaty/inertia. 1.2 feels premium without being sluggish.
      duration: 1.2,
      // Natural deceleration curve — matches how luxury brand sites feel
      easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      // Smooth mouse wheel on desktop
      smoothWheel: true,
    })

    // Lenis needs to be updated on every animation frame
    function raf(time: number) {
      lenis.raf(time)
      requestAnimationFrame(raf)
    }

    requestAnimationFrame(raf)

    // Cleanup on unmount
    return () => lenis.destroy()
  }, [])

  return <>{children}</>
}
