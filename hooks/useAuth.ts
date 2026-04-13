// ─────────────────────────────────────────────────────────────────────────────
// hooks/useAuth.ts
// Phone + OTP authentication using Supabase Phone Auth.
// ─────────────────────────────────────────────────────────────────────────────

'use client'

import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { normalizePhone } from '@/lib/utils'

export function useAuth() {
  const supabase = createClient()
  const [loading, setLoading] = useState(false)
  const [error, setError]     = useState<string | null>(null)

  // ─── Send OTP ──────────────────────────────────────────────────────────────

  async function sendOtp(phone: string): Promise<boolean> {
    setLoading(true)
    setError(null)

    try {
      const normalizedPhone = normalizePhone(phone)

      const { error } = await supabase.auth.signInWithOtp({
        phone: normalizedPhone,
      })

      if (error) throw error

      return true
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to send OTP'
      setError(message)
      return false
    } finally {
      setLoading(false)
    }
  }

  // ─── Verify OTP ────────────────────────────────────────────────────────────

  async function verifyOtp(phone: string, token: string): Promise<boolean> {
    setLoading(true)
    setError(null)

    try {
      const normalizedPhone = normalizePhone(phone)

      const { error } = await supabase.auth.verifyOtp({
        phone: normalizedPhone,
        token,
        type: 'sms',
      })

      if (error) throw error

      return true
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Invalid OTP'
      setError(message)
      return false
    } finally {
      setLoading(false)
    }
  }

  // ─── Sign Out ──────────────────────────────────────────────────────────────

  async function signOut(): Promise<void> {
    await supabase.auth.signOut()
  }

  return { sendOtp, verifyOtp, signOut, loading, error }
}
