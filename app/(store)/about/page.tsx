'use client'

// ─────────────────────────────────────────────────────────────────────────────
// app/(store)/about/page.tsx
// Brand story page — manufacturing expertise, OEM credentials, team.
// ─────────────────────────────────────────────────────────────────────────────

import { motion }  from 'framer-motion'
import { BRAND }   from '@/lib/constants'
import { fadeUp, slideFromLeft, slideFromRight, staggerChildren, VIEWPORT_CONFIG } from '@/lib/animations'

export default function AboutPage() {
  return (
    <div className="px-5 md:px-8 py-12 md:py-20 max-w-4xl mx-auto">
      <motion.div
        variants={staggerChildren}
        initial="hidden"
        animate="visible"
      >
        {/* Header */}
        <motion.div variants={fadeUp} className="mb-14 md:mb-20">
          <p className="lp-eyebrow mb-3">Our Story</p>
          <h1 className="
            font-display text-5xl md:text-7xl
            font-normal leading-none tracking-lp-tight
            text-lp-ink dark:text-lp-mist
            transition-colors duration-350
          ">
            9 Years.
            <br />
            <span className="italic text-lp-gold">One Craft.</span>
          </h1>
        </motion.div>

        {/* Story */}
        <motion.div
          variants={slideFromLeft}
          initial="hidden"
          whileInView="visible"
          viewport={VIEWPORT_CONFIG}
          className="mb-14"
        >
          <div className="max-w-2xl">
            <p className="text-[15px] leading-relaxed text-lp-muted-light dark:text-lp-muted-dark mb-4">
              {BRAND.address.company} began as a manufacturing partner for luggage
              brands across India. For nearly a decade, we honed our craft behind
              the scenes — producing hard shell trolleys, vanity cases, and travel
              bags for companies large and small.
            </p>
            <p className="text-[15px] leading-relaxed text-lp-muted-light dark:text-lp-muted-dark">
              In 2024, we made a decision: to bring that manufacturing expertise
              directly to the traveller. Louis Polo was born — not as another
              middleman brand, but as a manufacturer selling to you directly.
              That means better quality, fairer prices, and a brand that
              genuinely understands what goes into every suitcase.
            </p>
          </div>
        </motion.div>

        {/* Stats */}
        <motion.div
          variants={slideFromRight}
          initial="hidden"
          whileInView="visible"
          viewport={VIEWPORT_CONFIG}
          className="grid grid-cols-2 md:grid-cols-4 gap-px bg-lp-border-light dark:bg-lp-border-dark mb-14 transition-colors duration-350"
        >
          {[
            { value: '9+',     label: 'Years Manufacturing' },
            { value: 'OEM',    label: 'Custom Capabilities' },
            { value: 'GS1',    label: 'Certified Catalogue' },
            { value: '50+',    label: 'Products Designed' },
          ].map(({ value, label }) => (
            <div
              key={label}
              className="p-6 md:p-8 bg-lp-light dark:bg-lp-dark transition-colors duration-350"
            >
              <span className="font-display text-4xl text-lp-gold block mb-2">{value}</span>
              <span className="text-[10px] tracking-lp-wider uppercase text-lp-muted-light dark:text-lp-muted-dark">
                {label}
              </span>
            </div>
          ))}
        </motion.div>

        {/* OEM section */}
        <motion.div
          variants={fadeUp}
          initial="hidden"
          whileInView="visible"
          viewport={VIEWPORT_CONFIG}
          className="mb-14"
        >
          <p className="lp-eyebrow mb-3">For Businesses</p>
          <h2 className="font-display text-3xl font-normal text-lp-ink dark:text-lp-mist leading-none tracking-lp-tight mb-4 transition-colors duration-350">
            OEM & ODM Manufacturing
          </h2>
          <p className="text-[14px] text-lp-muted-light dark:text-lp-muted-dark leading-relaxed max-w-xl mb-5">
            Looking for custom luggage for your brand, corporate gifting, or
            bulk orders? We offer full OEM and ODM services with fast sample
            delivery in 2–3 days.
          </p>
          <a
            href={BRAND.whatsapp}
            target="_blank"
            rel="noopener noreferrer"
            className="
              inline-flex items-center gap-2
              text-[10px] tracking-lp-wider uppercase
              text-lp-gold border border-lp-gold
              px-5 py-3 hover:bg-lp-gold hover:text-lp-dark
              transition-all duration-200
            "
          >
            Enquire on WhatsApp →
          </a>
        </motion.div>

        {/* Contact */}
        <motion.div
          variants={fadeUp}
          initial="hidden"
          whileInView="visible"
          viewport={VIEWPORT_CONFIG}
          className="border-t border-lp-border-light dark:border-lp-border-dark pt-10 transition-colors duration-350"
        >
          <p className="lp-eyebrow mb-3">Get In Touch</p>
          <div className="grid sm:grid-cols-2 gap-4">
            {[
              { label: 'Email',     value: BRAND.email },
              { label: 'Phone',     value: BRAND.phone },
              { label: 'WhatsApp',  value: 'Chat with us' },
              { label: 'Instagram', value: '@louispololuggage' },
            ].map(({ label, value }) => (
              <div key={label}>
                <p className="text-[10px] tracking-lp-wider uppercase text-lp-muted-light dark:text-lp-muted-dark mb-1">
                  {label}
                </p>
                <p className="text-[14px] text-lp-ink dark:text-lp-mist transition-colors duration-350">
                  {value}
                </p>
              </div>
            ))}
          </div>
        </motion.div>
      </motion.div>
    </div>
  )
}
