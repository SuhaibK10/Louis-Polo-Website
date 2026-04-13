// ─────────────────────────────────────────────────────────────────────────────
// app/api/auth/send-otp/route.ts
// POST /api/auth/send-otp
// ─────────────────────────────────────────────────────────────────────────────

import { NextResponse }     from 'next/server'
import { createClient }     from '@/lib/supabase/server'
import { normalizePhone }   from '@/lib/utils'
import type { ApiResponse } from '@/types'

export async function POST(request: Request) {
  try {
    const body  = await request.json()
    const phone = normalizePhone(body.phone ?? '')

    if (!phone || phone.length < 13) {
      return NextResponse.json(
        { success: false, error: 'Valid phone number required' } as ApiResponse,
        { status: 400 }
      )
    }

    const supabase = await createClient()

    const { error } = await supabase.auth.signInWithOtp({ phone })

    if (error) throw error

   return NextResponse.json({
  success: true,
  data:    { phone, message: 'OTP sent successfully' },
})

  } catch (error) {
    const message = error instanceof Error ? error.message : 'Failed to send OTP'
    console.error('[POST /api/auth/send-otp]', error)
    return NextResponse.json(
      { success: false, error: message } as ApiResponse,
      { status: 500 }
    )
  }
}