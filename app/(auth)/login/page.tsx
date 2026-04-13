'use client'

// ─────────────────────────────────────────────────────────────────────────────
// app/(auth)/login/page.tsx
// Phone number entry — first step of OTP login.
// After submit, redirects to /verify with phone in URL params.
// ─────────────────────────────────────────────────────────────────────────────

import { useState }      from 'react'
import { useRouter }     from 'next/navigation'
import { motion }        from 'framer-motion'
import { Phone }         from 'lucide-react'
import { Button }        from '@/components/ui/Button'
import { useAuth }       from '@/hooks/useAuth'
import { normalizePhone } from '@/lib/utils'
import { fadeUp, staggerChildren } from '@/lib/animations'

export default function LoginPage() {
  const router          = useRouter()
  const { sendOtp, loading, error } = useAuth()
  const [phone, setPhone]           = useState('')
  const [inputError, setInputError] = useState('')

  function validatePhone(value: string): boolean {
    const digits = value.replace(/\D/g, '')
    if (digits.length !== 10) {
      setInputError('Please enter a valid 10-digit mobile number')
      return false
    }
    setInputError('')
    return true
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()

    if (!validatePhone(phone)) return

    const normalized = normalizePhone(phone)
    const success    = await sendOtp(normalized)

    if (success) {
      // Pass phone to verify page via URL param
      router.push(`/verify?phone=${encodeURIComponent(normalized)}`)
    }
  }

  return (
    <div className="
      min-h-screen flex flex-col items-center justify-center
      px-5 py-12
      bg-lp-light dark:bg-lp-dark
      transition-colors duration-350
    ">
      <motion.div
        className="w-full max-w-sm"
        variants={staggerChildren}
        initial="hidden"
        animate="visible"
      >
        {/* Logo text */}
        <motion.div variants={fadeUp} className="text-center mb-10">
          <h1 className="font-display text-3xl font-normal tracking-lp-tight text-lp-ink dark:text-lp-mist transition-colors duration-350">
            Louis Polo
          </h1>
          <div className="w-8 h-px bg-lp-gold mx-auto mt-2" />
        </motion.div>

        {/* Heading */}
        <motion.div variants={fadeUp} className="mb-8">
          <p className="lp-eyebrow mb-2">Sign In</p>
          <h2 className="font-display text-2xl font-normal text-lp-ink dark:text-lp-mist transition-colors duration-350">
            Enter your mobile number
          </h2>
          <p className="text-[12px] text-lp-muted-light dark:text-lp-muted-dark mt-2">
            We'll send you a 6-digit OTP to verify
          </p>
        </motion.div>

        {/* Form */}
        <motion.form
          variants={fadeUp}
          onSubmit={handleSubmit}
          className="space-y-4"
        >
          {/* Phone input */}
          <div>
            <div className="
              flex items-center gap-2
              border border-lp-border-light dark:border-lp-border-dark
              focus-within:border-lp-gold
              transition-all duration-200
            ">
              {/* Country prefix */}
              <div className="
                flex items-center gap-1.5 px-3 py-3.5
                border-r border-lp-border-light dark:border-lp-border-dark
                transition-colors duration-350
              ">
                <Phone size={14} strokeWidth={1.5} className="text-lp-muted-light dark:text-lp-muted-dark" />
                <span className="text-[13px] text-lp-muted-light dark:text-lp-muted-dark">+91</span>
              </div>

              <input
                type="tel"
                inputMode="numeric"
                placeholder="98765 43210"
                value={phone}
                onChange={(e) => {
                  // Only allow digits, max 10
                  const digits = e.target.value.replace(/\D/g, '').slice(0, 10)
                  setPhone(digits)
                  if (inputError) validatePhone(digits)
                }}
                className="
                  flex-1 px-3 py-3.5 bg-transparent
                  text-[15px] text-lp-ink dark:text-lp-mist
                  placeholder:text-lp-muted-light dark:placeholder:text-lp-muted-dark
                  outline-none transition-colors duration-350
                "
                autoFocus
                required
              />
            </div>

            {/* Validation error */}
            {(inputError || error) && (
              <p className="text-[11px] text-lp-error mt-2">
                {inputError || error}
              </p>
            )}
          </div>

          <Button
            type="submit"
            variant="gold"
            size="md"
            fullWidth
            loading={loading}
            disabled={phone.length !== 10}
          >
            Send OTP
          </Button>
        </motion.form>

        {/* Guest note */}
        <motion.p
          variants={fadeUp}
          className="text-center text-[11px] text-lp-muted-light dark:text-lp-muted-dark mt-6"
        >
          New to Louis Polo? An account is created automatically.
        </motion.p>
      </motion.div>
    </div>
  )
}
