// ─────────────────────────────────────────────────────────────────────────────
// app/api/auth/verify-otp/route.ts
// POST /api/auth/verify-otp
// Verifies the OTP entered by the user.
// On success: creates/updates user profile in our users table.
// ─────────────────────────────────────────────────────────────────────────────

import { NextResponse }      from 'next/server'
import { createAdminClient } from '@/lib/supabase/server'
import { normalizePhone }    from '@/lib/utils'
import type { ApiResponse }  from '@/types'

export async function POST(request: Request) {
  try {
    const body  = await request.json()
    const phone = normalizePhone(body.phone ?? '')
    const token = String(body.token ?? '').trim()

    if (!phone || !token || token.length !== 6) {
      return NextResponse.json(
        { success: false, error: 'Phone and 6-digit OTP required' } as ApiResponse,
        { status: 400 }
      )
    }

    // Verify OTP via Supabase Auth
    const supabase = createAdminClient()

    const { data, error } = await supabase.auth.verifyOtp({
      phone,
      token,
      type: 'sms',
    })

    if (error || !data.user) throw error ?? new Error('Verification failed')

    // Upsert user profile in our custom users table
    // This runs after every login — keeps profile in sync
    await supabase
      .from('users')
      .upsert(
        {
          id:    data.user.id,
          phone: normalizePhone(phone),
        },
        { onConflict: 'id', ignoreDuplicates: true }
      )

    return NextResponse.json({
      success: true,
      data: { userId: data.user.id },
    } )

  } catch (error) {
    const message = error instanceof Error ? error.message : 'Verification failed'
    console.error('[POST /api/auth/verify-otp]', error)
    return NextResponse.json(
      { success: false, error: message } as ApiResponse,
      { status: 500 }
    )
  }
}
