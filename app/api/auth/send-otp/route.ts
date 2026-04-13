// ─────────────────────────────────────────────────────────────────────────────
// app/api/auth/send-otp/route.ts
// POST /api/auth/send-otp
// Triggers Supabase Phone Auth to send an OTP SMS to the user's phone.
// ─────────────────────────────────────────────────────────────────────────────

import { NextResponse }     from 'next/server'
import { createAdminClient } from '@/lib/supabase/server'
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

    const supabase = createAdminClient()

    const { error } = await supabase.auth.admin.generateLink({
      type:  'phone_change',
      phone,
    })

    // Use signInWithOtp instead — admin generateLink doesn't work for phone
    // This sends the actual SMS via Supabase + Twilio
    const { error: otpError } = await (
      await import('@/lib/supabase/server')
    ).createClient().then((c) =>
      c.auth.signInWithOtp({ phone })
    )

    if (otpError) throw otpError

    return NextResponse.json({
      success: true,
      data:    { phone, message: 'OTP sent successfully' },
    } as ApiResponse)

  } catch (error) {
    const message = error instanceof Error ? error.message : 'Failed to send OTP'
    console.error('[POST /api/auth/send-otp]', error)
    return NextResponse.json(
      { success: false, error: message } as ApiResponse,
      { status: 500 }
    )
  }
}
