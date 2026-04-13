'use client'

// ─────────────────────────────────────────────────────────────────────────────
// app/(auth)/verify/page.tsx
// OTP entry — 6-digit code sent via SMS.
// Auto-submits when all 6 digits are entered.
// Resend option after 30 seconds.
// ─────────────────────────────────────────────────────────────────────────────

import { useState, useEffect, useRef, Suspense } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { motion }  from 'framer-motion'
import { Button }  from '@/components/ui/Button'
import { useAuth } from '@/hooks/useAuth'
import { fadeUp, staggerChildren } from '@/lib/animations'

const OTP_LENGTH  = 6
const RESEND_WAIT = 30  // seconds

function VerifyForm() {
  const router       = useRouter()
  const searchParams = useSearchParams()
  const phone        = searchParams.get('phone') ?? ''

  const { sendOtp, verifyOtp, loading, error } = useAuth()

  // OTP digits stored as an array of 6 strings
  const [digits, setDigits] = useState<string[]>(Array(OTP_LENGTH).fill(''))
  const [resendTimer, setResendTimer] = useState(RESEND_WAIT)
  const [canResend, setCanResend]     = useState(false)
  const inputRefs = useRef<(HTMLInputElement | null)[]>([])

  // Resend countdown timer
  useEffect(() => {
    if (resendTimer <= 0) {
      setCanResend(true)
      return
    }
    const t = setTimeout(() => setResendTimer((prev) => prev - 1), 1000)
    return () => clearTimeout(t)
  }, [resendTimer])

  // Auto-submit when all 6 digits filled
  useEffect(() => {
    const otp = digits.join('')
    if (otp.length === OTP_LENGTH) handleVerify(otp)
  }, [digits])

  async function handleVerify(otp?: string) {
    const code = otp ?? digits.join('')
    if (code.length !== OTP_LENGTH) return

    const success = await verifyOtp(phone, code)
    if (success) {
      // Redirect to checkout if coming from there, otherwise account
      const redirect = searchParams.get('redirect') ?? '/account'
      router.push(redirect)
    }
  }

  function handleDigitChange(index: number, value: string) {
    const digit = value.replace(/\D/g, '').slice(-1) // only last digit

    const newDigits = [...digits]
    newDigits[index] = digit
    setDigits(newDigits)

    // Auto-advance to next input
    if (digit && index < OTP_LENGTH - 1) {
      inputRefs.current[index + 1]?.focus()
    }
  }

  function handleKeyDown(index: number, e: React.KeyboardEvent) {
    if (e.key === 'Backspace' && !digits[index] && index > 0) {
      // Move to previous input on backspace when current is empty
      inputRefs.current[index - 1]?.focus()
    }
  }

  function handlePaste(e: React.ClipboardEvent) {
    e.preventDefault()
    const pasted = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, OTP_LENGTH)
    const newDigits = [...digits]
    pasted.split('').forEach((char, i) => { newDigits[i] = char })
    setDigits(newDigits)
    // Focus last filled input
    const lastIndex = Math.min(pasted.length, OTP_LENGTH - 1)
    inputRefs.current[lastIndex]?.focus()
  }

  async function handleResend() {
    if (!canResend) return
    await sendOtp(phone)
    setResendTimer(RESEND_WAIT)
    setCanResend(false)
    setDigits(Array(OTP_LENGTH).fill(''))
    inputRefs.current[0]?.focus()
  }

  const maskedPhone = phone.replace(/(\+91)(\d{5})(\d{5})/, '$1 $2 $3')

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
        {/* Logo */}
        <motion.div variants={fadeUp} className="text-center mb-10">
          <h1 className="font-display text-3xl font-normal tracking-lp-tight text-lp-ink dark:text-lp-mist transition-colors duration-350">
            Louis Polo
          </h1>
          <div className="w-8 h-px bg-lp-gold mx-auto mt-2" />
        </motion.div>

        {/* Heading */}
        <motion.div variants={fadeUp} className="mb-8">
          <p className="lp-eyebrow mb-2">Verify</p>
          <h2 className="font-display text-2xl font-normal text-lp-ink dark:text-lp-mist transition-colors duration-350 mb-2">
            Enter the OTP
          </h2>
          <p className="text-[12px] text-lp-muted-light dark:text-lp-muted-dark">
            Sent to <span className="text-lp-ink dark:text-lp-mist">{maskedPhone}</span>
          </p>
        </motion.div>

        {/* OTP Input boxes */}
        <motion.div variants={fadeUp} className="mb-6">
          <div className="flex gap-2.5 justify-between" onPaste={handlePaste}>
            {digits.map((digit, i) => (
              <input
                key={i}
                ref={(el) => { inputRefs.current[i] = el }}
                type="tel"
                inputMode="numeric"
                maxLength={1}
                value={digit}
                onChange={(e) => handleDigitChange(i, e.target.value)}
                onKeyDown={(e) => handleKeyDown(i, e)}
                className={`
                  w-12 h-14 text-center
                  text-xl font-medium
                  border transition-all duration-200
                  bg-transparent outline-none
                  text-lp-ink dark:text-lp-mist
                  ${digit
                    ? 'border-lp-gold'
                    : 'border-lp-border-light dark:border-lp-border-dark focus:border-lp-gold'
                  }
                  transition-colors duration-350
                `}
                autoFocus={i === 0}
              />
            ))}
          </div>

          {error && (
            <p className="text-[11px] text-lp-error mt-3">{error}</p>
          )}
        </motion.div>

        {/* Verify button */}
        <motion.div variants={fadeUp}>
          <Button
            variant="gold"
            size="md"
            fullWidth
            loading={loading}
            onClick={() => handleVerify()}
            disabled={digits.join('').length !== OTP_LENGTH}
          >
            Verify OTP
          </Button>
        </motion.div>

        {/* Resend */}
        <motion.div variants={fadeUp} className="text-center mt-5">
          {canResend ? (
            <button
              onClick={handleResend}
              className="text-[11px] text-lp-gold hover:opacity-75 transition-opacity"
            >
              Resend OTP
            </button>
          ) : (
            <p className="text-[11px] text-lp-muted-light dark:text-lp-muted-dark">
              Resend in{' '}
              <span className="text-lp-ink dark:text-lp-mist tabular-nums">
                {resendTimer}s
              </span>
            </p>
          )}
        </motion.div>

        {/* Change number */}
        <motion.div variants={fadeUp} className="text-center mt-3">
          <button
            onClick={() => router.push('/login')}
            className="text-[11px] text-lp-muted-light dark:text-lp-muted-dark hover:text-lp-gold transition-colors"
          >
            Change number
          </button>
        </motion.div>
      </motion.div>
    </div>
  )
}

export default function VerifyPage() {
  return (
    <Suspense>
      <VerifyForm />
    </Suspense>
  )
}
